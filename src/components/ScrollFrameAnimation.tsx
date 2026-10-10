import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FRAME_SEQUENCE, FRAME_METADATA, type FrameData } from '../data/frameSequence';

export const ScrollFrameAnimation: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Frame list state (initialized with pre-generated manifest, updated if /api/frames provides dynamic list)
  const [frames, setFrames] = useState<FrameData[]>(FRAME_SEQUENCE);
  const totalFrames = frames.length;

  // Loading state indicators
  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for high-frequency animation loop without React state overhead
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentFrameIndexRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);
  const isInViewRef = useRef(false);

  // Frame cache: HTMLImageElement array
  const cacheRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadingStatusRef = useRef<('idle' | 'loading' | 'loaded' | 'error')[]>([]);
  const activeDownloadsRef = useRef(0);
  const downloadQueueRef = useRef<number[]>([]);

  // Initialize cache slots
  if (cacheRef.current.length !== totalFrames) {
    cacheRef.current = new Array(totalFrames).fill(null);
    loadingStatusRef.current = new Array(totalFrames).fill('idle');
  }

  // Draw a frame to canvas with aspect ratio preservation (letterboxed / contain)
  const renderCanvasFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Look for exact frame or fallback to closest loaded frame in cache
    let imgToDraw = cacheRef.current[frameIdx];

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
      // Find closest loaded frame to avoid any black frame or flicker
      let bestDiff = Infinity;
      let fallbackImg: HTMLImageElement | null = null;
      for (let i = 0; i < totalFrames; i++) {
        const candidate = cacheRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          const diff = Math.abs(i - frameIdx);
          if (diff < bestDiff) {
            bestDiff = diff;
            fallbackImg = candidate;
          }
        }
      }
      imgToDraw = fallbackImg;
    }

    if (!imgToDraw) return;

    const nativeW = FRAME_METADATA.width;
    const nativeH = FRAME_METADATA.height;

    // Ensure canvas buffer matches native resolution
    if (canvas.width !== nativeW || canvas.height !== nativeH) {
      canvas.width = nativeW;
      canvas.height = nativeH;
    }

    // Direct 1:1 hardware blit
    ctx.drawImage(imgToDraw, 0, 0, nativeW, nativeH);
  }, [totalFrames]);

  // Load a single frame by index
  const loadFrame = useCallback((index: number, priority = false): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= totalFrames) return Promise.resolve(null);

    // Return existing if already loaded or loading
    if (loadingStatusRef.current[index] === 'loaded' && cacheRef.current[index]) {
      return Promise.resolve(cacheRef.current[index]);
    }

    if (loadingStatusRef.current[index] === 'loading') {
      return Promise.resolve(null);
    }

    const frameItem = frames[index];
    if (!frameItem) return Promise.resolve(null);

    return new Promise((resolve) => {
      loadingStatusRef.current[index] = 'loading';
      const img = new Image();
      img.decoding = 'async';

      img.onload = () => {
        cacheRef.current[index] = img;
        loadingStatusRef.current[index] = 'loaded';
        setLoadedCount((prev) => prev + 1);

        if (index === 0) {
          setInitialFrameLoaded(true);
        }

        // If the newly loaded frame is currently the target frame, re-render immediately
        const currentTargetIdx = Math.floor(currentProgressRef.current * (totalFrames - 1));
        if (Math.abs(currentTargetIdx - index) <= 1) {
          renderCanvasFrame(currentTargetIdx);
        }

        resolve(img);
      };

      img.onerror = () => {
        loadingStatusRef.current[index] = 'error';
        resolve(null);
      };

      img.src = frameItem.url;
    });
  }, [frames, totalFrames, renderCanvasFrame]);

  // Priority queue processor for preloading
  const processDownloadQueue = useCallback(() => {
    const MAX_CONCURRENT = 6;
    while (activeDownloadsRef.current < MAX_CONCURRENT && downloadQueueRef.current.length > 0) {
      const nextIdx = downloadQueueRef.current.shift();
      if (nextIdx === undefined) break;

      if (loadingStatusRef.current[nextIdx] === 'idle') {
        activeDownloadsRef.current++;
        loadFrame(nextIdx).finally(() => {
          activeDownloadsRef.current--;
          processDownloadQueue();
        });
      }
    }
  }, [loadFrame]);

  // Queue frames to be preloaded
  const queueFrames = useCallback((indices: number[], highPriority = false) => {
    const toAdd = indices.filter(
      (idx) => idx >= 0 && idx < totalFrames && loadingStatusRef.current[idx] === 'idle'
    );

    if (highPriority) {
      downloadQueueRef.current = [...toAdd, ...downloadQueueRef.current];
    } else {
      downloadQueueRef.current = [...downloadQueueRef.current, ...toAdd];
    }

    processDownloadQueue();
  }, [totalFrames, processDownloadQueue]);

  // Preload poster frame 0 immediately on mount
  useEffect(() => {
    loadFrame(0, true).then(() => {
      renderCanvasFrame(0);
    });

    // Also load frame 1, 2 for immediate responsiveness
    loadFrame(1, true);
    loadFrame(2, true);
  }, [loadFrame, renderCanvasFrame]);

  // Check /api/frames for dynamic auto-detection sync
  useEffect(() => {
    fetch('/api/frames')
      .then((res) => {
        if (!res.ok) throw new Error('API not available');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.frames) && data.frames.length > 0) {
          setFrames(data.frames);
        }
      })
      .catch(() => {
        // Fallback to static manifest seamlessly
      });
  }, []);

  // Intelligent tiered preloader triggered by IntersectionObserver
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let tier1Done = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInViewRef.current = entry.isIntersecting;

          if (entry.isIntersecting && !tier1Done) {
            tier1Done = true;

            // Tier 1: Strided keyframe sample across the entire timeline (every 8 frames)
            // Ensures scrubbing anywhere has an instant close frame
            const keyframeIndices: number[] = [];
            for (let i = 0; i < totalFrames; i += 8) {
              keyframeIndices.push(i);
            }
            if (!keyframeIndices.includes(totalFrames - 1)) {
              keyframeIndices.push(totalFrames - 1);
            }
            queueFrames(keyframeIndices, true);

            // Tier 2: Priority window around initial segment
            const firstSegment: number[] = [];
            for (let i = 0; i < Math.min(60, totalFrames); i++) {
              firstSegment.push(i);
            }
            queueFrames(firstSegment, true);

            // Tier 3: Infill remaining frames progressively in idle time
            const remaining: number[] = [];
            for (let i = 0; i < totalFrames; i++) {
              if (loadingStatusRef.current[i] === 'idle') {
                remaining.push(i);
              }
            }
            queueFrames(remaining, false);
          }
        });
      },
      { rootMargin: '400px 0px 400px 0px' }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [totalFrames, queueFrames]);

  // Dynamic window around current frame
  const prioritizeCurrentWindow = useCallback((frameIdx: number) => {
    const WINDOW_RADIUS = 20;
    const priorityIndices: number[] = [];
    const min = Math.max(0, frameIdx - WINDOW_RADIUS);
    const max = Math.min(totalFrames - 1, frameIdx + WINDOW_RADIUS);

    for (let i = min; i <= max; i++) {
      if (loadingStatusRef.current[i] === 'idle') {
        priorityIndices.push(i);
      }
    }

    if (priorityIndices.length > 0) {
      queueFrames(priorityIndices, true);
    }
  }, [totalFrames, queueFrames]);

  // Scroll listener for calculating targetProgress
  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollableDistance = rect.height - windowHeight;

      if (scrollableDistance <= 0) return;

      // When rect.top <= 0, we are scrubbing through the pinned section
      const rawProgress = -rect.top / scrollableDistance;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      targetProgressRef.current = clamped;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // requestAnimationFrame continuous interpolation loop
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const delta = target - current;

      // Lerp smoothing factor (0.16 provides high responsiveness with cinematic fluidity)
      if (Math.abs(delta) > 0.00008) {
        currentProgressRef.current += delta * 0.16;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;

      // Formula: frameIndex = Math.floor(progress * (totalFrames - 1))
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(p * (totalFrames - 1)))
      );

      // Render if frame changed or first frame
      if (frameIndex !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = frameIndex;
        renderCanvasFrame(frameIndex);
        prioritizeCurrentWindow(frameIndex);
        setScrollProgress(p);
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [totalFrames, renderCanvasFrame, prioritizeCurrentWindow]);

  // Initial resize and render
  useEffect(() => {
    renderCanvasFrame(0);
    const handleResize = () => {
      renderCanvasFrame(currentFrameIndexRef.current >= 0 ? currentFrameIndexRef.current : 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvasFrame]);

  // Dynamic editorial narratives aligned with video sequence stages
  // Stage 1 (0% - 28%): iPhone 18 Pro Crimson Titanium Chassis
  // Stage 2 (30% - 66%): Bowers & Wilkins Acoustic Enclosure
  // Stage 3 (70% - 100%): 48MP Triple Fusion Camera Architecture
  const getStageNarrative = (p: number) => {
    if (p < 0.28) {
      return {
        kicker: 'AEROSPACE CHASSIS',
        headline: 'Forged in Crimson Titanium.',
        detail: 'Continuous unibody contour engineered to microscopic tolerances.',
      };
    } else if (p < 0.68) {
      return {
        kicker: 'ACOUSTIC ENGINEERING',
        headline: 'Bowers & Wilkins Precision Core.',
        detail: 'Seamless sonic calibration with adaptive lossless resonance.',
      };
    } else {
      return {
        kicker: 'PRO OPTIC HORIZON',
        headline: '48MP Fusion Triple Architecture.',
        detail: 'Periscopic light fold with second-generation photonic capture.',
      };
    }
  };

  const narrative = getStageNarrative(scrollProgress);

  return (
    <section
      ref={sectionRef}
      id="cinematic-scrub-section"
      className="relative w-full h-[420vh] bg-[#030712] select-none"
      style={{
        overflowX: 'clip',
      }}
      aria-label="Interactive 3D Product Anatomy"
    >
      {/* 
        ========================================================================
        Pinned Visual Canvas Viewport
        Remains firmly sticky for the entire 420vh duration, releasing naturally
        after progress reaches 1.0.
        ========================================================================
      */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none"
      >
        {/* Subtle Atmospheric Dark Navy Lighting to blend seamlessly with hero & products */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none opacity-40 -z-10"
          style={{
            background: 'radial-gradient(ellipse 65% 50% at 50% 50%, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.15) 60%, transparent 80%)',
            filter: 'blur(70px)',
          }}
          aria-hidden="true"
        />

        {/* Ambient Burgundy Hue matching the hardware video palette */}
        <div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none opacity-25 -z-10"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(159, 18, 57, 0.35) 0%, rgba(3, 7, 18, 0) 70%)',
            filter: 'blur(60px)',
          }}
          aria-hidden="true"
        />

        {/* 
          ======================================================================
          Main GPU Canvas Frame Renderer
          Maintains native 2520x1080 resolution, styled with object-contain to
          preserve 2.3333 aspect ratio with zero distortion or cropping.
          ======================================================================
        */}
        <div className="relative w-full h-full max-w-[1920px] max-h-[100vh] flex items-center justify-center px-2 sm:px-6 md:px-10">
          <canvas
            ref={canvasRef}
            width={FRAME_METADATA.width}
            height={FRAME_METADATA.height}
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-opacity duration-500"
            style={{
              opacity: initialFrameLoaded ? 1 : 0.4,
              aspectRatio: `${FRAME_METADATA.width} / ${FRAME_METADATA.height}`,
            }}
          />

          {/* Fallback poster while first frame is loading */}
          {!initialFrameLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-rose-500/20 border-t-rose-500 animate-spin" />
                <span className="text-xs text-white/50 tracking-widest uppercase font-light">
                  Initializing Cinematic Sequence
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 
          ======================================================================
          Minimalist Editorial Overlays (Apple Keynote Aesthetic)
          Subtle floating captions that fade smoothly based on scrub progress.
          ======================================================================
        */}
        {/* Top Left Stage Kicker & Narrative */}
        <div className="absolute top-20 sm:top-24 left-6 sm:left-12 lg:left-20 max-w-sm sm:max-w-md pointer-events-none transition-all duration-700 ease-out">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md mb-2 sm:mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-rose-300/90">
              {narrative.kicker}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white/95 leading-tight">
            {narrative.headline}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-white/60 font-light leading-relaxed">
            {narrative.detail}
          </p>
        </div>

        {/* Top Right Frame Counter & Folder Continuity Telemetry */}
        <div className="absolute top-20 sm:top-24 right-6 sm:right-12 lg:right-20 flex flex-col items-end pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center gap-3 text-[11px] font-mono text-white/70">
            <span className="text-rose-400 font-semibold">
              FRAME {String(currentFrameIndexRef.current >= 0 ? currentFrameIndexRef.current + 1 : 1).padStart(3, '0')}
            </span>
            <span className="text-white/30">/</span>
            <span>{totalFrames}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-white/50 text-[10px]">
              {currentFrameIndexRef.current < 300 ? 'FOLDER 1' : 'FOLDER 2'}
            </span>
          </div>

          {/* Smooth transition badge when passing the folder seam */}
          <div
            className={`mt-2 text-[10px] tracking-wider uppercase transition-opacity duration-300 ${
              currentFrameIndexRef.current >= 295 && currentFrameIndexRef.current <= 305
                ? 'opacity-100 text-rose-400 font-medium'
                : 'opacity-0 text-transparent'
            }`}
          >
            Seamless Boundary Connection
          </div>
        </div>

        {/* 
          ======================================================================
          Bottom Minimalist Scrub Bar & Interaction Cue
          ======================================================================
        */}
        <div className="absolute bottom-8 sm:bottom-10 inset-x-6 sm:inset-x-12 lg:inset-x-20 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
          {/* Subtle Scrub Direction Cue */}
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs text-white/50 font-light tracking-wide">
            <span className="inline-block animate-bounce text-white/70">↓</span>
            <span>Scroll down to scrub physical timeline</span>
          </div>

          {/* Ultra-Slim Precision Scrub Progress Line */}
          <div className="w-full sm:w-64 h-[3px] rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-rose-400 to-white transition-all duration-75 rounded-full"
              style={{ width: `${(scrollProgress * 100).toFixed(2)}%` }}
            />
          </div>

          {/* Preload Cache Status */}
          <div className="text-[10px] font-mono text-white/40 tracking-wider">
            BUFFER {Math.min(100, Math.round((loadedCount / totalFrames) * 100))}%
          </div>
        </div>
      </div>
    </section>
  );
};
