import React from 'react';

interface AppleGlassLogoProps {
  className?: string;
  size?: number;
}

/**
 * Renders the official Apple logo in the frosted glass aesthetic from the uploaded asset,
 * featuring translucent frosted glass body, specular rim reflections, and iridescent chromatic
 * refraction caustics along the bottom rim curve.
 */
export const AppleGlassLogo: React.FC<AppleGlassLogoProps> = ({
  className = '',
  size = 28,
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <svg
        width={size}
        height={size * 1.22}
        viewBox="0 0 170 208"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
      >
        <defs>
          {/* Frosted Glass Body Gradient */}
          <linearGradient id="appleGlassBody" x1="85" y1="0" x2="85" y2="208" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#F1F5F9" stopOpacity="0.82" />
            <stop offset="70%" stopColor="#E2E8F0" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.5" />
          </linearGradient>

          {/* Top Specular Edge Highlight */}
          <linearGradient id="appleGlassEdge" x1="40" y1="0" x2="130" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="75%" stopColor="#94A3B8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.6" />
          </linearGradient>

          {/* Iridescent Chromatic Spectrum Caustic along lower curvature (from uploaded reference) */}
          <linearGradient id="appleIridescentGlow" x1="20" y1="140" x2="150" y2="205" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.75" />   {/* Soft violet */}
            <stop offset="28%" stopColor="#38BDF8" stopOpacity="0.7" />   {/* Cyan */}
            <stop offset="55%" stopColor="#4ADE80" stopOpacity="0.6" />   {/* Soft green/emerald */}
            <stop offset="78%" stopColor="#FDE047" stopOpacity="0.8" />   {/* Yellow gold */}
            <stop offset="100%" stopColor="#FB7185" stopOpacity="0.7" />  {/* Coral pink */}
          </linearGradient>

          {/* Inner Light Diffusion Filter */}
          <filter id="glassInnerDiff" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Clip path for the whole Apple logo */}
          <clipPath id="appleSilhouetteClip">
            {/* Apple Leaf */}
            <path d="M109.1 0C117.8 11.2 113.8 28.5 104.9 39.1C96.3 49.3 80.9 57.6 70.2 57.3C68.9 45.4 74.3 28.9 83.2 18.2C92.1 7.6 104.9 1.1 109.1 0Z" />
            {/* Apple Body with Bite */}
            <path d="M150.3 147.2C143.7 156.8 136.9 166.4 126.3 166.6C115.7 166.8 112.3 160.3 100.2 160.3C88 160.3 84.2 166.4 74.2 166.8C63.9 167.2 56 156.4 49.4 146.9C35.9 127.3 25.5 91.5 39.5 67.2C46.4 55.1 58.9 47.5 72.3 47.3C82.5 47.1 92.2 54.2 98.4 54.2C104.7 54.2 116.4 45.7 129.1 47.1C134.4 47.3 149.4 49.2 159.2 63.6C158.4 64.1 139.8 75 140.1 97.4C140.4 124.2 163.6 133.2 163.9 133.3C163.7 134 160.1 146.5 150.3 147.2Z" />
          </clipPath>
        </defs>

        {/* Ambient Back Glow */}
        <g opacity="0.3" filter="url(#glassInnerDiff)">
          <path
            d="M109.1 0C117.8 11.2 113.8 28.5 104.9 39.1C96.3 49.3 80.9 57.6 70.2 57.3C68.9 45.4 74.3 28.9 83.2 18.2C92.1 7.6 104.9 1.1 109.1 0Z"
            fill="#60A5FA"
          />
          <path
            d="M150.3 147.2C143.7 156.8 136.9 166.4 126.3 166.6C115.7 166.8 112.3 160.3 100.2 160.3C88 160.3 84.2 166.4 74.2 166.8C63.9 167.2 56 156.4 49.4 146.9C35.9 127.3 25.5 91.5 39.5 67.2C46.4 55.1 58.9 47.5 72.3 47.3C82.5 47.1 92.2 54.2 98.4 54.2C104.7 54.2 116.4 45.7 129.1 47.1C134.4 47.3 149.4 49.2 159.2 63.6C158.4 64.1 139.8 75 140.1 97.4C140.4 124.2 163.6 133.2 163.9 133.3C163.7 134 160.1 146.5 150.3 147.2Z"
            fill="#38BDF8"
          />
        </g>

        {/* Base Frosted Glass Silhouette */}
        <g clipPath="url(#appleSilhouetteClip)">
          {/* Main translucent frosted glass fill */}
          <rect x="0" y="0" width="170" height="208" fill="url(#appleGlassBody)" />

          {/* Diagonal Glass Sheen Reflection */}
          <path
            d="M-20 -20 L190 80 L160 210 L-50 110 Z"
            fill="linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)"
            opacity="0.6"
          />

          {/* Lower Iridescent Spectrum Caustic (Refraction from asset) */}
          <ellipse
            cx="100"
            cy="172"
            rx="75"
            ry="38"
            fill="url(#appleIridescentGlow)"
            opacity="0.85"
            style={{ mixBlendMode: 'screen', filter: 'blur(7px)' }}
          />

          {/* Secondary Iridescent Caustic Highlight at bottom notch */}
          <circle
            cx="100"
            cy="166"
            r="24"
            fill="#FDE047"
            opacity="0.65"
            style={{ mixBlendMode: 'screen', filter: 'blur(5px)' }}
          />

          {/* Specular Edge Rim Light */}
          <path
            d="M109.1 0C117.8 11.2 113.8 28.5 104.9 39.1C96.3 49.3 80.9 57.6 70.2 57.3C68.9 45.4 74.3 28.9 83.2 18.2C92.1 7.6 104.9 1.1 109.1 0Z"
            stroke="url(#appleGlassEdge)"
            strokeWidth="3.5"
            fill="none"
          />
          <path
            d="M150.3 147.2C143.7 156.8 136.9 166.4 126.3 166.6C115.7 166.8 112.3 160.3 100.2 160.3C88 160.3 84.2 166.4 74.2 166.8C63.9 167.2 56 156.4 49.4 146.9C35.9 127.3 25.5 91.5 39.5 67.2C46.4 55.1 58.9 47.5 72.3 47.3C82.5 47.1 92.2 54.2 98.4 54.2C104.7 54.2 116.4 45.7 129.1 47.1C134.4 47.3 149.4 49.2 159.2 63.6C158.4 64.1 139.8 75 140.1 97.4C140.4 124.2 163.6 133.2 163.9 133.3C163.7 134 160.1 146.5 150.3 147.2Z"
            stroke="url(#appleGlassEdge)"
            strokeWidth="3.5"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};
