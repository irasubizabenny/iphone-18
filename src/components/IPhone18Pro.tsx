import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AppleGlassLogo } from './AppleGlassLogo';

interface IPhone18ProProps {
  className?: string;
}

export const IPhone18Pro: React.FC<IPhone18ProProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for gentle, ultra-smooth cinematic parallax
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // High-inertia spring for slow, premium, silky dampening
  const springConfig = { damping: 30, stiffness: 65, mass: 1.2 };
  const smoothX = useSpring(x, springConfig);
  const smoothY = useSpring(y, springConfig);

  // Restrained 3D rotation angles (subtle parallax)
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const glareY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normalizedX = (e.clientX / innerWidth) - 0.5;
      const normalizedY = (e.clientY / innerHeight) - 0.5;
      x.set(normalizedX);
      y.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ perspective: 1400 }}
    >
      {/* Cinematic Deep Navy Atmospheric Lighting behind the phone */}
      <div
        className="absolute -inset-16 sm:-inset-24 rounded-full pointer-events-none opacity-80"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(29, 78, 216, 0.28) 0%, rgba(15, 34, 84, 0.18) 45%, rgba(3, 7, 18, 0) 75%)',
          filter: 'blur(45px)',
        }}
        aria-hidden="true"
      />

      {/* Floating 3D Parallax Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative group transition-transform duration-700 ease-out"
      >
        {/* Contact Shadow on Floor Plane */}
        <div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-14 rounded-[100%] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(2,6,23,0.55) 45%, transparent 75%)',
            filter: 'blur(16px)',
            transform: 'translateZ(-40px) scaleY(0.4)',
          }}
          aria-hidden="true"
        />

        {/* 
          =======================================================
          iPhone 18 Pro Hardware Chassis (Grade 5 Titanium)
          =======================================================
        */}
        <div className="relative w-[285px] h-[585px] sm:w-[335px] sm:h-[685px] md:w-[360px] md:h-[735px] rounded-[52px] sm:rounded-[58px] p-[3.5px] sm:p-[4px] bg-gradient-to-b from-[#334155]/90 via-[#0f172a] to-[#020617] titanium-frame transition-all">
          
          {/* Outer Chamfer Rim - Polished Micro-Edge Highlight */}
          <div
            className="absolute inset-0 rounded-[52px] sm:rounded-[58px] pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.05) 25%, rgba(0,0,0,0.6) 60%, rgba(148,163,184,0.3) 100%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1.2px',
            }}
          />

          {/* Hardware Buttons (Action Button, Volume, Power) */}
          {/* Action Button - Left */}
          <div className="absolute -left-[5px] top-[108px] sm:top-[124px] w-[2.5px] h-[26px] sm:h-[30px] rounded-l-[2px] bg-gradient-to-r from-slate-400 to-slate-700 shadow-sm" />
          {/* Volume Up - Left */}
          <div className="absolute -left-[5px] top-[148px] sm:top-[170px] w-[2.5px] h-[48px] sm:h-[56px] rounded-l-[2px] bg-gradient-to-r from-slate-400 to-slate-700 shadow-sm" />
          {/* Volume Down - Left */}
          <div className="absolute -left-[5px] top-[206px] sm:top-[236px] w-[2.5px] h-[48px] sm:h-[56px] rounded-l-[2px] bg-gradient-to-r from-slate-400 to-slate-700 shadow-sm" />
          {/* Side / Power Button - Right */}
          <div className="absolute -right-[5px] top-[165px] sm:top-[190px] w-[2.5px] h-[72px] sm:h-[84px] rounded-r-[2px] bg-gradient-to-l from-slate-400 to-slate-700 shadow-sm" />

          {/* Antenna Break Micro-Inlays */}
          <div className="absolute -left-[3px] top-[75px] w-[3px] h-[4px] bg-[#020617] opacity-80" />
          <div className="absolute -left-[3px] bottom-[75px] w-[3px] h-[4px] bg-[#020617] opacity-80" />
          <div className="absolute -right-[3px] top-[75px] w-[3px] h-[4px] bg-[#020617] opacity-80" />
          <div className="absolute -right-[3px] bottom-[75px] w-[3px] h-[4px] bg-[#020617] opacity-80" />

          {/* 
            =======================================================
            Super Retina XDR OLED Display (Edge-to-Edge)
            =======================================================
          */}
          <div className="relative w-full h-full rounded-[48px] sm:rounded-[54px] bg-black overflow-hidden flex flex-col justify-between shadow-inner">
            
            {/* Cinematic Wallpaper Artwork: Deep Navy Sapphire Fluid Ribbon */}
            <div className="absolute inset-0 z-0">
              <svg
                viewBox="0 0 400 800"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
                className="w-full h-full scale-[1.03]"
              >
                <defs>
                  {/* Background Base */}
                  <radialGradient id="oledDarkNavy" cx="50%" cy="40%" r="65%">
                    <stop offset="0%" stopColor="#081432" />
                    <stop offset="50%" stopColor="#030816" />
                    <stop offset="100%" stopColor="#010309" />
                  </radialGradient>

                  {/* Ribbon Light Layer 1 - Deep Sapphire to Electric Cyan */}
                  <linearGradient id="ribbonCyan" x1="0" y1="0" x2="400" y2="800" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.8" />
                    <stop offset="35%" stopColor="#2563EB" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                  </linearGradient>

                  {/* Ribbon Light Layer 2 - Iridescent Prism Caustic Glow */}
                  <linearGradient id="ribbonPrism" x1="400" y1="200" x2="0" y2="700" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
                    <stop offset="30%" stopColor="#C084FC" stopOpacity="0.35" />
                    <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.5" />
                    <stop offset="85%" stopColor="#FBBF24" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                  </linearGradient>

                  {/* Fluid Wave Filter */}
                  <filter id="fluidBloom" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="14" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Base OLED Field */}
                <rect width="400" height="800" fill="url(#oledDarkNavy)" />

                {/* Ambient Center Glow */}
                <circle cx="200" cy="410" r="220" fill="#1D4ED8" opacity="0.22" filter="url(#fluidBloom)" />

                {/* Fluid Ribbon 1: Sculpted Curvature */}
                <path
                  d="M -40 220 C 140 180, 220 380, 160 520 C 110 640, 260 740, 440 680 L 440 850 L -40 850 Z"
                  fill="url(#ribbonCyan)"
                  opacity="0.85"
                />

                {/* Fluid Ribbon 2: Inner Highlight Wave */}
                <path
                  d="M 60 160 C 220 240, 290 390, 210 540 C 140 670, 310 740, 460 760 L 460 550 C 330 520, 240 430, 270 330 C 290 260, 200 180, 60 160 Z"
                  fill="url(#ribbonPrism)"
                  style={{ mixBlendMode: 'screen' }}
                />

                {/* Fluid Ribbon 3: Luminous Crest Light */}
                <path
                  d="M 120 220 Q 230 330 200 460 T 260 660"
                  stroke="#93C5FD"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                  style={{ filter: 'blur(2px)' }}
                />

                {/* Center Apple Watermark Ambient Depth */}
                <g transform="translate(162, 360) scale(0.45)" opacity="0.08">
                  <path
                    d="M109.1 0C117.8 11.2 113.8 28.5 104.9 39.1C96.3 49.3 80.9 57.6 70.2 57.3C68.9 45.4 74.3 28.9 83.2 18.2C92.1 7.6 104.9 1.1 109.1 0Z"
                    fill="#FFFFFF"
                  />
                  <path
                    d="M150.3 147.2C143.7 156.8 136.9 166.4 126.3 166.6C115.7 166.8 112.3 160.3 100.2 160.3C88 160.3 84.2 166.4 74.2 166.8C63.9 167.2 56 156.4 49.4 146.9C35.9 127.3 25.5 91.5 39.5 67.2C46.4 55.1 58.9 47.5 72.3 47.3C82.5 47.1 92.2 54.2 98.4 54.2C104.7 54.2 116.4 45.7 129.1 47.1C134.4 47.3 149.4 49.2 159.2 63.6C158.4 64.1 139.8 75 140.1 97.4C140.4 124.2 163.6 133.2 163.9 133.3C163.7 134 160.1 146.5 150.3 147.2Z"
                    fill="#FFFFFF"
                  />
                </g>
              </svg>
            </div>

            {/* Dynamic Island & Status Bar */}
            <div className="relative z-10 w-full pt-3 sm:pt-3.5 px-6 sm:px-7 flex items-center justify-between">
              {/* Time */}
              <span className="text-[11px] sm:text-xs font-semibold text-white/90 tracking-tight font-sans">
                9:41
              </span>

              {/* Dynamic Island Pill */}
              <div className="relative w-[86px] sm:w-[102px] h-[24px] sm:h-[27px] rounded-full bg-black border border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center justify-between px-2.5 overflow-hidden">
                {/* TrueDepth Camera Aperture */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#030712] ring-1 ring-[#1e293b]/70 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-blue-950 ring-1 ring-blue-500/30" />
                </div>
                {/* Ambient Sensor */}
                <div className="w-1.5 h-1.5 rounded-full bg-[#050b1a] opacity-80" />
              </div>

              {/* Status Icons: Cellular, Wifi, Battery */}
              <div className="flex items-center gap-1.5 text-white/80">
                {/* 5G Signal */}
                <div className="flex items-end gap-[1.5px] h-2.5">
                  <div className="w-[2px] h-[3px] bg-white rounded-xs" />
                  <div className="w-[2px] h-[5px] bg-white rounded-xs" />
                  <div className="w-[2px] h-[7px] bg-white rounded-xs" />
                  <div className="w-[2px] h-[9px] bg-white rounded-xs" />
                </div>
                {/* Battery Pill */}
                <div className="w-4 h-2.5 rounded-[3px] border border-white/70 p-[1px] flex items-center">
                  <div className="h-full w-full bg-white rounded-[1px]" />
                </div>
              </div>
            </div>

            {/* Middle Screen Editorial Touch: The Apple Frosted Logo Floating within Screen */}
            <div className="relative z-10 flex flex-col items-center justify-center -mt-6">
              <motion.div
                animate={{
                  scale: [1, 1.02, 1],
                  opacity: [0.9, 1, 0.9],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="p-4"
              >
                <AppleGlassLogo size={48} />
              </motion.div>
              <p className="mt-2 text-[10px] sm:text-xs tracking-[0.25em] font-medium text-white/70 uppercase">
                Titanium
              </p>
            </div>

            {/* Bottom Screen Bar Indicator */}
            <div className="relative z-10 pb-3 sm:pb-3.5 flex items-center justify-center">
              <div className="w-28 sm:w-32 h-[4px] rounded-full bg-white/75" />
            </div>

            {/* 
              =======================================================
              Dynamic Specular Glint & Glass Sheen Overlay
              =======================================================
            */}
            <motion.div
              style={{
                x: glareX,
                y: glareY,
              }}
              className="absolute -inset-16 pointer-events-none opacity-45 mix-blend-overlay transition-opacity"
              aria-hidden="true"
            >
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(115deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 75%)',
                  transform: 'rotate(-15deg)',
                }}
              />
            </motion.div>

            {/* Ceramic Shield Glass Micro-Bevel */}
            <div className="absolute inset-0 rounded-[48px] sm:rounded-[54px] pointer-events-none border border-white/[0.08]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
