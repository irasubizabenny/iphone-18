import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const ProductsSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  // Gentle mouse parallax for the products canvas
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 28, stiffness: 55, mass: 1.1 };
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

  // Motion parallax offsets for different card depths
  const pX1 = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);
  const pY1 = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

  const pX2 = useTransform(smoothX, [-0.5, 0.5], [16, -16]);
  const pY2 = useTransform(smoothY, [-0.5, 0.5], [12, -12]);

  const pX3 = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const pY3 = useTransform(smoothY, [-0.5, 0.5], [14, -14]);

  return (
    <section
      ref={containerRef}
      id="products"
      className="relative w-full py-28 sm:py-36 px-5 sm:px-8 border-t border-white/[0.06] bg-[#030712]/30 backdrop-blur-[1px] overflow-hidden select-none"
    >
      {/* 
        ========================================================================
        Atmospheric Background Lighting
        ========================================================================
      */}


      <div className="max-w-7xl mx-auto">
        {/* 
          ========================================================================
          Top Layout: Left Editorial Hero + Right Asymmetric Canvas
          Inspired by the uploaded reference composition
          ========================================================================
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Editorial Heading & Context with subtle Burgundy Heading Gradient */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between h-full"
          >
            <div>
              <h2 className="mt-3 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight burgundy-heading-gradient leading-[1.05]">
                Product Design
              </h2>

              <p className="mt-2 text-lg sm:text-xl text-white/80 font-light italic-editorial-serif">
                Form, tuned to absolute capability.
              </p>

              <p className="mt-5 text-sm sm:text-base text-white/70 font-light leading-relaxed max-w-md">
                Every subsystem in iPhone 18 Pro has been architected to disappear into the experience.
                Seven specialized innovations unite to deliver an uncompromising standard of speed,
                endurance, and visual precision.
              </p>
            </div>

            {/* 
              CARD 06 — DESIGN (Titanium Structure with Burgundy Accent Icon)
            */}
            <motion.div
              style={{ x: pX3, y: pY3 }}
              initial={{ opacity: 0, y: 35, scale: 0.96, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 lg:mt-12"
            >
              <div className="p-6 rounded-[26px] floating-glass-card group cursor-default">
                <div className="flex items-center gap-3">
                  {/* Consistent Burgundy Icon: Design / Titanium Alloy */}
                  <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
                    <div className="w-3.5 h-3.5 rounded-sm bg-gradient-to-br from-[#fb7185] to-[#881337]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                      Titanium Structure
                    </h3>
                    <p className="text-xs sm:text-[13px] text-white/70 font-normal leading-relaxed mt-0.5">
                      Premium titanium construction with a refined finish.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Controlled Asymmetric Card Constellation (Matching reference right cluster) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* 
              CARD 02 — CAMERA
            */}
            <motion.div
              style={{ x: pX2, y: pY2 }}
              initial={{ opacity: 0, y: 35, scale: 0.95, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-[26px] floating-glass-card flex flex-col justify-between group cursor-default"
            >
              <div className="my-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4c0519]/25 border border-[#9f1239]/30 flex items-center justify-center shadow-[0_0_15px_rgba(190,18,60,0.2)]">
                  <div className="w-4 h-4 rounded-full border border-[#f43f5e]/60 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#E11D48]" />
                  </div>
                </div>
                <div className="text-xs font-mono font-semibold tracking-wide text-rose-100">
                  Fusion Optics System
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                  Fusion Camera System
                </h3>
                <p className="mt-1 text-xs sm:text-[13px] text-white/75 font-normal leading-relaxed">
                  48MP Fusion camera system for detailed photography and video.
                </p>
              </div>
            </motion.div>

            {/* 
              CARD 03 — PERFORMANCE
            */}
            <motion.div
              style={{ x: pX2, y: pY2 }}
              initial={{ opacity: 0, y: 35, scale: 0.95, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 1.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-[26px] floating-glass-card flex flex-col justify-between group cursor-default"
            >
              <div className="my-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#4c0519]/25 border border-[#9f1239]/30 flex items-center justify-center shadow-[0_0_15px_rgba(190,18,60,0.2)]">
                  <div className="w-3.5 h-3.5 rounded-[3px] bg-gradient-to-tr from-[#fb7185] to-[#881337]" />
                </div>
                <div className="text-xs font-mono font-semibold tracking-wide text-rose-100">
                  Silicon Neural Compute
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                  A20 Pro Silicon
                </h3>
                <p className="mt-1 text-xs sm:text-[13px] text-white/75 font-normal leading-relaxed">
                  A20 Pro performance built for demanding everyday tasks.
                </p>
              </div>
            </motion.div>

          </div>
        </div>

        {/* 
          ========================================================================
          Bottom Trio: Grounded Horizontal Cards
          Cards 04, 05, and 07 with Burgundy Accent Icons
          ========================================================================
        */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          
          {/* CARD 04 — BATTERY */}
          <motion.div
            style={{ x: pX1, y: pY1 }}
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-[26px] floating-glass-card group cursor-default flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              {/* Burgundy Battery Icon */}
              <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
                  <line x1="22" y1="11" x2="22" y2="13" />
                  <line x1="6" y1="11" x2="6" y2="13" />
                  <line x1="10" y1="11" x2="10" y2="13" />
                  <line x1="14" y1="11" x2="14" y2="13" />
                </svg>
              </div>

              <div className="w-5 h-2.5 rounded-[3px] border border-[#f43f5e]/70 p-[1.5px] flex items-center">
                <div className="w-full h-full bg-[#E11D48] rounded-[1px]" />
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                All-Day Endurance
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-white/75 font-normal leading-relaxed">
                Long-lasting power for everyday use.
              </p>
            </div>
          </motion.div>

          {/* CARD 05 — CHARGING */}
          <motion.div
            style={{ x: pX2, y: pY2 }}
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-[26px] floating-glass-card group cursor-default flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              {/* Burgundy Charging Icon */}
              <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                Fast Power Delivery
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-white/75 font-normal leading-relaxed">
                Fast, convenient charging when you need more power.
              </p>
            </div>
          </motion.div>

          {/* CARD 07 — INTELLIGENCE */}
          <motion.div
            style={{ x: pX3, y: pY3 }}
            initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-[26px] floating-glass-card group cursor-default flex flex-col justify-between sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center justify-between">
              {/* Burgundy Intelligence Icon */}
              <div className="w-8 h-8 rounded-xl bg-[#4c0519]/35 border border-[#9f1239]/40 flex items-center justify-center shadow-[0_0_12px_rgba(190,18,60,0.25)]">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
              </div>
              <div className="w-2 h-2 rounded-full bg-[#E11D48] shadow-[0_0_8px_#E11D48]" />
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold tracking-tight text-white group-hover:text-rose-100 transition-colors">
                Personal Intelligence
              </h3>
              <p className="mt-1 text-xs sm:text-[13px] text-white/75 font-normal leading-relaxed">
                Advanced intelligent features designed around the user.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
