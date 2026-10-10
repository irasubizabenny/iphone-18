import React from 'react';
import { motion } from 'motion/react';
import { Navbar } from './components/Navbar';
import { FeatureGlassCards } from './components/FeatureGlassCards';
import { FullPageScrollBackground } from './components/FullPageScrollBackground';
import { ProductsSection } from './components/ProductsSection';
import { AudioSection } from './components/AudioSection';
import { CameraSection } from './components/CameraSection';

export default function App() {
  const handleExploreClick = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] text-white flex flex-col justify-between relative overflow-x-hidden select-none">
      {/* 
        ========================================================================
        Full-Page Scroll-Controlled Video Background (Folder 1 + Folder 2)
        Replaces static background visuals with one continuous 450-frame animation.
        ========================================================================
      */}
      <FullPageScrollBackground />

      {/* Floating Navigation Bar (Labels updated strictly to 4 items) */}
      <Navbar onCtaClick={handleExploreClick} />

      {/* 
        ========================================================================
        1. Main Hero Banner Area (Preserved Exactly)
        ========================================================================
      */}
      <main id="overview" className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32 md:pt-36 pb-12 flex flex-col items-center justify-between">
        
        {/* Editorial Narrative & Large Typography Header */}
        <div id="hero" className="w-full flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Supporting Kicker: “Pro, further.” */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-2 sm:mb-3"
          >
            <p className="italic-editorial-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
              Pro, further.
            </p>
          </motion.div>

          {/* Main Title: “iPhone 18 Pro” */}
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative py-2 sm:py-4 px-6 sm:px-12 flex items-center justify-center"
          >
            {/* Luminous Keynote Back-Plate Aura - Clean Neutral Glass Radiance */}
            <div
              className="absolute inset-0 rounded-[40px] pointer-events-none opacity-40 -z-10"
              style={{
                background: 'radial-gradient(ellipse 80% 65% at 50% 50%, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.04) 55%, transparent 80%)',
                filter: 'blur(32px)',
              }}
              aria-hidden="true"
            />

            {/* Subtle Keynote Grid Pattern Highlight */}
            <div
              className="absolute inset-x-4 inset-y-1 pointer-events-none opacity-20 -z-10 rounded-2xl"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
              aria-hidden="true"
            />

            <h1 className="iphone-reference-title text-5xl sm:text-6xl md:text-7xl lg:text-[6.5rem] xl:text-[7.5rem] tracking-[-0.04em] font-extrabold select-none">
              iPhone 18 Pro
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/85 max-w-xl font-light leading-relaxed tracking-normal"
          >
            Sculpted in aerospace titanium with an uninterrupted optical horizon.
            Engineered to disappear into every moment, leaving only pure capability.
          </motion.p>

          {/* Single Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8"
          >
            <button
              onClick={handleExploreClick}
              className="group relative inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-sm font-medium text-white glass-button-dark transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              aria-label="Explore iPhone 18 Pro"
            >
              <span className="tracking-wide">Explore iPhone 18 Pro</span>
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1.5 text-white/80">
                →
              </span>
            </button>
          </motion.div>
        </div>

        {/* Asymmetric Floating Transparent Glass Cards Composition */}
        <div id="features-area" className="w-full">
          <FeatureGlassCards />
        </div>
      </main>

      {/* 
        ========================================================================
        2. Products Page Section (Sequential Next Section from Uploaded Reference)
        ========================================================================
      */}
      <ProductsSection />

      {/* 
        ========================================================================
        3. Audio Page Section (AirPods & Audio Architecture)
        ========================================================================
      */}
      <AudioSection />

      {/* 
        ========================================================================
        4. Camera Page Section (Final Pro Camera Architecture)
        ========================================================================
      */}
      <CameraSection />

      {/* 
        ========================================================================
        Footer Brand Line
        ========================================================================
      */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-white/50 font-light select-none">
        <span>Copyright © 2026 Apple Inc. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <span className="hover:text-white/80 transition-colors cursor-default">Privacy Policy</span>
          <span className="hover:text-white/80 transition-colors cursor-default">Legal</span>
          <span className="hover:text-white/80 transition-colors cursor-default">United States</span>
        </div>
      </footer>
    </div>
  );
}
