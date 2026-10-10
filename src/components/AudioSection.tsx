import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface AudioCard {
  id: string;
  title: string;
  description: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  xFactor: number;
  yFactor: number;
  delay: number;
  renderIcon: () => React.ReactNode;
}

export const AudioSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  // Parallax tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 26, stiffness: 60, mass: 1.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView) {
        const xNorm = (e.clientX - rect.left) / rect.width - 0.5;
        const yNorm = (e.clientY - rect.top) / rect.height - 0.5;
        mouseX.set(xNorm);
        mouseY.set(yNorm);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const cards: AudioCard[] = [
    {
      id: 'sound',
      title: 'SOUND',
      description: 'Rich, balanced audio for an immersive experience.',
      position: 'top-left',
      xFactor: -18,
      yFactor: -14,
      delay: 0.15,
      renderIcon: () => (
        <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        </div>
      ),
    },
    {
      id: 'spatial-audio',
      title: 'SPATIAL AUDIO',
      description: 'A more immersive sound experience that surrounds you.',
      position: 'top-right',
      xFactor: 18,
      yFactor: -14,
      delay: 0.25,
      renderIcon: () => (
        <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3a9 9 0 0 1 9 9" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
      ),
    },
    {
      id: 'noise-control',
      title: 'ACTIVE NOISE CONTROL',
      description: 'Reduce unwanted surroundings and stay focused.',
      position: 'bottom-left',
      xFactor: -18,
      yFactor: 14,
      delay: 0.35,
      renderIcon: () => (
        <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </div>
      ),
    },
    {
      id: 'battery',
      title: 'BATTERY',
      description: 'Designed for dependable listening throughout the day.',
      position: 'bottom-right',
      xFactor: 18,
      yFactor: 14,
      delay: 0.45,
      renderIcon: () => (
        <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
            <line x1="22" y1="11" x2="22" y2="13" />
            <line x1="6" y1="11" x2="6" y2="13" />
            <line x1="10" y1="11" x2="10" y2="13" />
            <line x1="14" y1="11" x2="14" y2="13" />
          </svg>
        </div>
      ),
    },
  ];

  return (
    <section
      ref={containerRef}
      id="audio"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 border-t border-white/[0.06] bg-[#030712]/30 backdrop-blur-[1px] overflow-hidden select-none"
    >
      {/* 
        ========================================================================
        Atmospheric Lighting & Soft Sapphire/Indigo Radial Radiance
        ========================================================================
      */}


      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* 
          ========================================================================
          Section Header with Subtle Burgundy Heading Gradient
          ========================================================================
        */}
        <div className="w-full flex flex-col items-center text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight burgundy-heading-gradient leading-tight">
              Sound, supercharged.
            </h2>
            <p className="mt-3 text-lg sm:text-xl text-white/80 font-light italic-editorial-serif">
              Acoustic purity tuned to surround every sensation.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-white/65 font-light max-w-md mx-auto leading-relaxed">
              Custom acoustic architecture, active noise cancellation, and personalized spatial sound — seamlessly integrated.
            </p>
          </motion.div>
        </div>

        {/* 
          ========================================================================
          Reference-Inspired Central Stage with 4 Corner Floating Cards
          The central area remains completely clean and unobstructed.
          Four cards are anchored ONLY around the 4 corners/outer edges.
          ========================================================================
        */}
        <div className="relative w-full max-w-4xl mt-16 sm:mt-20 min-h-[460px] sm:min-h-[520px] flex items-center justify-center">
          
          {/* 
            ========================================================================
            Corner Placement Layout
            Desktop: Absolute positioning strictly at the 4 corners/outer edges.
            Mobile: Staggered 2x2 grid with generous central breathing space.
            ========================================================================
          */}
          <div className="w-full h-full pointer-events-none">
            
            {/* Desktop Corner Cards (Hidden on small mobile, visible sm+) */}
            <div className="hidden sm:block absolute inset-0 pointer-events-none">
              {cards.map((card) => {
                const posX = useTransform(smoothX, [-0.5, 0.5], [-card.xFactor, card.xFactor]);
                const posY = useTransform(smoothY, [-0.5, 0.5], [-card.yFactor, card.yFactor]);

                const cornerClasses = {
                  'top-left': 'top-2 left-0 sm:left-2',
                  'top-right': 'top-2 right-0 sm:right-2',
                  'bottom-left': 'bottom-2 left-0 sm:left-2',
                  'bottom-right': 'bottom-2 right-0 sm:right-2',
                }[card.position];

                return (
                  <motion.div
                    key={card.id}
                    style={{ x: posX, y: posY }}
                    initial={{ opacity: 0, y: card.yFactor * 1.5, scale: 0.94, filter: 'blur(8px)' }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{
                      duration: 1.2,
                      delay: card.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className={`absolute ${cornerClasses} pointer-events-auto w-[250px] md:w-[275px]`}
                  >
                    <div className="p-5 rounded-[22px] floating-glass-card group cursor-default">
                      <div className="flex items-center gap-3">
                        {card.renderIcon()}
                        <h3 className="text-sm font-bold tracking-wider uppercase text-white group-hover:text-rose-100 transition-colors">
                          {card.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-xs text-white/75 font-normal leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mobile Fallback: Outer 2x2 corner-spaced arrangement */}
            <div className="sm:hidden grid grid-cols-1 gap-4 mt-6 pointer-events-auto w-full">
              {cards.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: card.delay, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full"
                >
                  <div className="p-5 rounded-[22px] floating-glass-card group">
                    <div className="flex items-center gap-3">
                      {card.renderIcon()}
                      <h3 className="text-sm font-bold tracking-wider uppercase text-white">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-xs text-white/75 font-normal leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
