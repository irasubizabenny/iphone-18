import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const CameraSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  // Gentle mouse parallax for subtle atmospheric depth
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 60, mass: 1 };
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

  // Subtle parallax shifts
  const pXLeft = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const pYLeft = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  const pXRight = useTransform(smoothX, [-0.5, 0.5], [8, -8]);
  const pYRight = useTransform(smoothY, [-0.5, 0.5], [6, -6]);

  const specs = [
    { value: '48MP', label: 'Fusion camera' },
    { value: '4K', label: 'Pro video' },
    { value: '120Hz', label: 'ProMotion display' },
    { value: 'Pro', label: 'Advanced camera controls' },
  ];

  return (
    <section
      ref={containerRef}
      id="camera"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 border-t border-white/[0.06] bg-[#030712]/30 backdrop-blur-[1px] overflow-hidden select-none"
    >
      {/* 
        ========================================================================
        Atmospheric Lighting & Chromatic Depth (Dark Navy / Sapphire & Prism)
        Inspired by the soft, luminous ambient fields of the uploaded reference
        ========================================================================
      */}
      {/* Subtle Burgundy caustic aura on bottom-right */}
      <div
        className="absolute bottom-1/4 -right-16 w-[580px] h-[580px] rounded-full pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(190,18,60,0.2) 0%, rgba(136,19,55,0.08) 55%, transparent 75%)',
          filter: 'blur(85px)',
        }}
        aria-hidden="true"
      />

      {/* 
        ========================================================================
        Outer Viewport Frame (Inspired by Reference Outer Enclosure)
        No cards or boxed panels inside. Pure typography and open negative space.
        ========================================================================
      */}
      <div className="max-w-7xl mx-auto relative rounded-[36px] sm:rounded-[44px] border border-white/[0.08] p-8 sm:p-14 lg:p-20 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
        
        {/* Subtle Inner Sheen - Neutral Glass */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
          }}
          aria-hidden="true"
        />

        {/* 
          ========================================================================
          Editorial Split Layout:
          Left Side: Main Description with Subtle Burgundy Gradient Heading
          Center: Generous Open Negative Space (Unobstructed)
          Right Side: Clean Supporting Technical Information (Card-Free)
          ========================================================================
        */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[460px] sm:min-h-[520px]">
          
          {/* LEFT SIDE — MAIN DESCRIPTION */}
          <motion.div
            style={{ x: pXLeft, y: pYLeft }}
            initial={{ opacity: 0, x: -30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex flex-col justify-center"
          >
            {/* Category Lead-in */}
            <span className="text-xs sm:text-sm font-medium tracking-widest uppercase text-white/60">
              Pro camera system
            </span>

            {/* Main Camera Heading with Subtle Burgundy Gradient */}
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight burgundy-heading-gradient leading-[1.08]">
              Capture more detail.
              <span className="block mt-1 font-light italic-editorial-serif text-white/90">
                Create with more freedom.
              </span>
            </h2>

            {/* Supporting Text */}
            <p className="mt-6 text-sm sm:text-base text-white/75 font-light leading-relaxed max-w-lg">
              An advanced camera system designed for detailed photography, cinematic video, and greater creative control.
            </p>
          </motion.div>

          {/* 
            CENTER / VISUAL AREA
            Generous open negative space between left and right.
            Strictly unobstructed — no text, no cards, no boxes.
          */}
          <div className="hidden lg:block lg:col-span-2 pointer-events-none" aria-hidden="true" />

          {/* RIGHT SIDE — CAMERA INFORMATION (Pure Typography, Strictly Card-Free) */}
          <motion.div
            style={{ x: pXRight, y: pYRight }}
            initial={{ opacity: 0, x: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4 flex flex-col justify-center lg:items-end space-y-9 sm:space-y-11"
          >
            {specs.map((item, idx) => (
              <motion.div
                key={item.value + item.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col lg:items-end text-left lg:text-right group cursor-default"
              >
                {/* Large Clean Number/Value */}
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white group-hover:text-rose-100 transition-colors duration-300">
                  {item.value}
                </div>
                {/* Clean Label Directly Below */}
                <div className="mt-1 text-xs sm:text-sm text-white/70 font-light tracking-wide group-hover:text-white/95 transition-colors duration-300">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>

      </div>
    </section>
  );
};
