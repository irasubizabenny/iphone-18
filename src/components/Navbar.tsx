import React from 'react';
import { AppleGlassLogo } from './AppleGlassLogo';

interface NavbarProps {
  onCtaClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCtaClick }) => {
  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'iPhone 18 Pro', href: '#hero' },
    { label: 'Airpods', href: '#audio' },
    { label: 'Camera', href: '#camera' },
  ];

  return (
    <header className="fixed top-4 sm:top-6 left-0 right-0 z-50 px-5 sm:px-8 pointer-events-none">
      <nav
        className="max-w-4xl mx-auto h-14 sm:h-[60px] px-6 sm:px-8 rounded-full floating-navbar flex items-center justify-between pointer-events-auto transition-all duration-300 hover:border-rose-500/30 hover:shadow-[0_0_25px_rgba(225,29,72,0.15)]"
        aria-label="Main Navigation"
      >
        {/* Brand Zone (Uploaded Apple Logo + Wordmark) */}
        <a
          href="#"
          className="flex items-center gap-2.5 py-1 transition-opacity hover:opacity-85 select-none"
          aria-label="Apple Home"
        >
          <AppleGlassLogo size={18} />
          <span className="text-[14px] font-semibold tracking-tight text-white/95">
            Apple
          </span>
        </a>

        {/* Center Nav Links with increased breathing room */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-2.5 py-1 rounded-md text-[13px] font-normal tracking-wide text-white/75 hover:text-rose-200 transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right Pill Button - Burgundy Accent Color matching section headings and icons */}
        <div className="flex items-center gap-3 pl-1">
          <button
            onClick={onCtaClick}
            className="px-4.5 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r from-[#9F1239] to-[#881337] hover:from-[#BE123C] hover:to-[#9F1239] border border-rose-400/25 shadow-[0_4px_16px_rgba(159,18,57,0.35)] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
          >
            Pre-order
          </button>
        </div>
      </nav>
    </header>
  );
};

