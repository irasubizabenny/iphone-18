import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FRAME_SEQUENCE, FRAME_METADATA, type FrameData } from '../data/frameSequence';

export const FullPageScrollBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Unified 450-frame sequence (Folder 1 + Folder 2)
  const [frames, setFrames] = useState<FrameData[]>(FRAME_SEQUENCE);
  const totalFrames = frames.length;

  const [initialFrameLoaded, setInitialFrameLoaded] = useState(false);

  // Target and interpolated scroll progress (0 to 1)
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const currentFrameIndexRef = useRef(-1);
  const rafIdRef = useRef<number | null>(null);

  // Frame cache: in-memory HTMLImageElement array
  const cacheRef = useRef<(HTMLImageElement | null)[]>([]);
  const loadingStatusRef = useRef<('idle' | 'loading' | 'loaded' | 'error')[]>([]);
  const activeDownloadsRef = useRef(0);
  const downloadQueueRef = useRef<number[]>([]);

  // Initialize cache slots
  if (cacheRef.current.length !== totalFrames) {
    cacheRef.current = new Array(totalFrames).fill(null);
    loadingStatusRef.current = new Array(totalFrames).fill('idle');
  }

  // Draw a frame to canvas
  const renderCanvasFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Look for exact frame or fallback to nearest loaded frame to eliminate flicker
    let imgToDraw = cacheRef.current[frameIdx];

    if (!imgToDraw || !imgToDraw.complete || imgToDraw.naturalWidth === 0) {
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

    if (canvas.width !== nativeW || canvas.height !== nativeH) {
      canvas.width = nativeW;
      canvas.height = nativeH;
    }

    ctx.drawImage(imgToDraw, 0, 0, nativeW, nativeH);
  }, [totalFrames]);

  // Load a single frame by index
  const loadFrame = useCallback((index: number, priority = false): Promise<HTMLImageElement | null> => {
    if (index < 0 || index >= totalFrames) return Promise.resolve(null);

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

        if (index === 0) {
          setInitialFrameLoaded(true);
        }

        // Re-render if this newly loaded frame is the current target
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

  // Priority queue processor
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

  // Queue frames
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

  // Priority window around current frame
  const prioritizeCurrentWindow = useCallback((frameIdx: number) => {
    const WINDOW_RADIUS = 25;
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

  // Initial poster frame loading & progressive keyframe queue
  useEffect(() => {
    // 1. Poster frame 0 immediately
    loadFrame(0, true).then(() => {
      renderCanvasFrame(0);
    });

    // 2. Load immediate initial window (0 to 20)
    const initialBatch: number[] = [];
    for (let i = 1; i <= 20; i++) {
      initialBatch.push(i);
    }
    queueFrames(initialBatch, true);

    // 3. Strided keyframes across the entire 450-frame sequence (every 8 frames)
    // Guarantees fast scrub to any part of page has a close loaded frame
    const keyframes: number[] = [];
    for (let i = 0; i < totalFrames; i += 8) {
      keyframes.push(i);
    }
    if (!keyframes.includes(totalFrames - 1)) {
      keyframes.push(totalFrames - 1);
    }
    queueFrames(keyframes, false);

    // 4. Infill remaining frames progressively
    const remaining: number[] = [];
    for (let i = 0; i < totalFrames; i++) {
      if (loadingStatusRef.current[i] === 'idle') {
        remaining.push(i);
      }
    }
    queueFrames(remaining, false);
  }, [loadFrame, renderCanvasFrame, totalFrames, queueFrames]);

  // Check /api/frames for auto-detected updates
  useEffect(() => {
    fetch('/api/frames')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.frames) && data.frames.length > 0) {
          setFrames(data.frames);
        }
      })
      .catch(() => {});
  }, []);

  // Global Page Scroll Calculation
  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const maxScroll = docHeight - winHeight;

      if (maxScroll <= 0) {
        targetProgressRef.current = 0;
        return;
      }

      const rawProgress = scrollY / maxScroll;
      targetProgressRef.current = Math.min(Math.max(rawProgress, 0), 1);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, []);

  // requestAnimationFrame continuous interpolation loop
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const delta = target - current;

      // Smooth lag factor with inertia
      if (Math.abs(delta) > 0.00005) {
        currentProgressRef.current += delta * 0.14;
      } else {
        currentProgressRef.current = target;
      }

      const p = currentProgressRef.current;

      // Formula: frameIndex = Math.floor(progress * (totalFrames - 1))
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, Math.floor(p * (totalFrames - 1)))
      );

      if (frameIndex !== currentFrameIndexRef.current) {
        currentFrameIndexRef.current = frameIndex;
        renderCanvasFrame(frameIndex);
        prioritizeCurrentWindow(frameIndex);
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

  // Initial render on mount and resize
  useEffect(() => {
    renderCanvasFrame(0);
    const handleResize = () => {
      renderCanvasFrame(currentFrameIndexRef.current >= 0 ? currentFrameIndexRef.current : 0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvasFrame]);

  return (
    <div
      id="full-page-scroll-background"
      className="fixed inset-0 w-screen h-screen z-0 pointer-events-none overflow-hidden bg-[#030712] flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* 
        ========================================================================
        Full-Page Cinematic Frame Canvas
        Renders native 2520x1080 frames with aspect-ratio preservation.
        Edges seamlessly blend into the dark navy environment.
        ========================================================================
      */}
      <canvas
        ref={canvasRef}
        width={FRAME_METADATA.width}
        height={FRAME_METADATA.height}
        className="w-full h-full object-contain pointer-events-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)] transition-opacity duration-700"
        style={{
          opacity: initialFrameLoaded ? 1 : 0,
          aspectRatio: `${FRAME_METADATA.width} / ${FRAME_METADATA.height}`,
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      />

      {/* 
        ========================================================================
        Atmospheric Cinematic Lighting Overlays (Preserved & Enhanced)
        ========================================================================
      */}


      {/* Subtle Vignette for Text Contrast & Perfect Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(3, 7, 18, 0.15) 30%, rgba(3, 7, 18, 0.5) 75%, #030712 100%)',
        }}
        aria-hidden="true"
      />
    </div>
  );
};
