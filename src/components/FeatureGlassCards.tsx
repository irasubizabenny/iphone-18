import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface CardData {
  id: string;
  tag: string;
  title: string;
  description: string;
  width: string;
  minHeight: string;
  floatClass: string;
  delay: number;
  xFactor: number;
  yFactor: number;
  renderIcon: () => React.ReactNode;
}

export const FeatureGlassCards: React.FC = () => {
  // Mouse position tracking for gentle cinematic parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 60, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set((e.clientX / innerWidth) - 0.5);
      mouseY.set((e.clientY / innerHeight) - 0.5);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const cards: CardData[] = [
    {
      id: 'a20-pro',
      tag: 'Silicon',
      title: 'A20 Pro',
      description: 'Next-generation Pro performance.',
      width: 'w-full sm:w-[280px] lg:w-[295px]',
      minHeight: 'min-h-[148px]',
      floatClass: 'animate-float-a',
      delay: 0.1,
      xFactor: -22,
      yFactor: -16,
      renderIcon: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
            <div className="w-2.5 h-2.5 rounded-[2px] bg-gradient-to-tr from-[#fb7185] to-[#881337]" />
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-rose-300/80">
            3nm Architecture
          </span>
        </div>
      ),
    },
    {
      id: 'promotion',
      tag: 'Display',
      title: 'ProMotion',
      description: 'Smooth display experience up to 120Hz.',
      width: 'w-full sm:w-[295px] lg:w-[315px]',
      minHeight: 'min-h-[156px]',
      floatClass: 'animate-float-b',
      delay: 0.2,
      xFactor: 24,
      yFactor: -18,
      renderIcon: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12h4l3-8 4 16 3-8h4" />
            </svg>
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-rose-300/80">
            120Hz Adaptive
          </span>
        </div>
      ),
    },
    {
      id: 'fusion-camera',
      tag: 'Optics',
      title: '48MP Fusion Camera',
      description: 'Detailed photography with greater flexibility.',
      width: 'w-full sm:w-[310px] lg:w-[330px]',
      minHeight: 'min-h-[154px]',
      floatClass: 'animate-float-c',
      delay: 0.3,
      xFactor: -26,
      yFactor: 18,
      renderIcon: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
            <div className="w-3 h-3 rounded-full border border-rose-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48]" />
            </div>
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-rose-300/80">
            Quad-Pixel Optical
          </span>
        </div>
      ),
    },
    {
      id: 'pro-battery',
      tag: 'Power',
      title: 'Pro Battery',
      description: 'Built for longer everyday use.',
      width: 'w-full sm:w-[275px] lg:w-[290px]',
      minHeight: 'min-h-[148px]',
      floatClass: 'animate-float-a',
      delay: 0.4,
      xFactor: 22,
      yFactor: 16,
      renderIcon: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
            <div className="w-3.5 h-2 rounded-[2px] border border-rose-400 p-[1px] flex items-center">
              <div className="w-full h-full bg-[#E11D48] rounded-[1px]" />
            </div>
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-rose-300/80">
            Extended Lifespan
          </span>
        </div>
      ),
    },
    {
      id: 'titanium-design',
      tag: 'Structure',
      title: 'Titanium Design',
      description: 'Refined, durable premium construction.',
      width: 'w-full sm:w-[320px] lg:w-[340px]',
      minHeight: 'min-h-[152px]',
      floatClass: 'animate-float-b',
      delay: 0.5,
      xFactor: 0,
      yFactor: 20,
      renderIcon: () => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
            <div className="w-2.5 h-2.5 rounded-sm bg-gradient-to-br from-[#fb7185] to-[#881337]" />
          </div>
          <span className="text-[11px] font-medium tracking-wider uppercase text-rose-300/80">
            Grade 5 Alloy
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-12 sm:mt-16 pb-8 select-none">


      {/* 
        ========================================================================
        Asymmetric Floating Composition
        Medium-sized glass cards positioned with organic balance, varied offsets,
        and subtle parallax without a rigid equal grid.
        ========================================================================
      */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-center justify-items-center">
        {cards.map((card, idx) => {
          // Individual parallax motion transforms
          const posX = useTransform(smoothX, [-0.5, 0.5], [-card.xFactor, card.xFactor]);
          const posY = useTransform(smoothY, [-0.5, 0.5], [-card.yFactor, card.yFactor]);

          // Asymmetrical vertical and horizontal nudge classes
          const offsetClasses = [
            'lg:-translate-y-4 lg:-translate-x-3', // Card 1 (A20 Pro): slightly high & left
            'lg:translate-y-3 lg:translate-x-2',   // Card 2 (ProMotion): slightly offset down
            'lg:translate-y-6 lg:-translate-x-2',  // Card 3 (Fusion Camera): lower left
            'lg:-translate-y-2 lg:translate-x-4',  // Card 4 (Pro Battery): upper right
            'lg:col-span-3 lg:justify-self-center lg:translate-y-1', // Card 5 (Titanium): anchored center bottom
          ][idx];

          return (
            <motion.div
              key={card.id}
              style={{
                x: posX,
                y: posY,
              }}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 1.1,
                delay: card.delay,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`relative ${card.width} ${card.minHeight} ${offsetClasses}`}
            >
              {/* Floating keyframe animation container */}
              <div className={`w-full h-full ${card.floatClass}`}>
                <div className="w-full h-full p-5 sm:p-6 rounded-[24px] floating-glass-card flex flex-col justify-between group cursor-default">
                  {/* Card Header Micro-UI with Burgundy Accent */}
                  <div className="flex items-center justify-between">
                    {card.renderIcon()}
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E11D48]/40 group-hover:bg-[#F43F5E] group-hover:shadow-[0_0_8px_#FB7185] transition-all duration-300" />
                  </div>

                  {/* Card Content */}
                  <div className="mt-4">
                    <h3 className="text-lg sm:text-[19px] font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-[13px] text-white/70 font-normal leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
