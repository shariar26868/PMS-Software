import React from 'react';

/**
 * MaxValid Logo Component
 * 
 * Variants:
 * - 'on-dark' (default for dark blue background): MAX in Crisp White + Cyan arc, VALID in Vibrant Magenta Pink.
 * - 'original' / 'light': MAX in Dark Teal (#065A74), VALID in Magenta Pink (#E5007D) (matches original image).
 * - 'badge': Logo embedded in a pristine white rounded pill container, perfect for dark themes.
 */
export default function MaxValidLogo({ className = "h-9", variant = "on-dark" }) {
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center justify-center bg-white px-3.5 py-1.5 rounded-xl shadow-lg shadow-black/20 ring-1 ring-slate-200/40 select-none ${className}`}>
        <MaxValidLogo className="h-full" variant="original" />
      </div>
    );
  }

  // Color Definitions
  const isOriginal = variant === 'original' || variant === 'light';

  // MAX text & Teal swoosh colors
  const maxColor = isOriginal ? '#065A74' : '#FFFFFF';
  const tealSwooshColor = isOriginal ? '#065A74' : '#00C2FF';
  const pinkColor = isOriginal ? '#E5007D' : '#FF1493';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg
        viewBox="0 0 380 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto drop-shadow-md"
      >
        <defs>
          <linearGradient id="pinkGradValid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF3399" />
            <stop offset="100%" stopColor={pinkColor} />
          </linearGradient>
          <linearGradient id="tealGradMax" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isOriginal ? '#065A74' : '#FFFFFF'} />
            <stop offset="100%" stopColor={isOriginal ? '#003E52' : '#F1F5F9'} />
          </linearGradient>
        </defs>

        <g>
          {/* MAX Text */}
          <text
            x="5"
            y="62"
            fill={maxColor}
            fontSize="54"
            fontWeight="900"
            fontFamily="'Outfit', 'Inter', system-ui, sans-serif"
            letterSpacing="-1"
          >
            MA
          </text>

          {/* X Left stroke in Teal / White */}
          <path
            d="M 102 22 L 128 62"
            stroke={maxColor}
            strokeWidth="13"
            strokeLinecap="round"
          />

          {/* Swoosh bottom arc sweeping under MAX */}
          <path
            d="M 52 75 C 50 92, 95 96, 130 68"
            stroke={tealSwooshColor}
            strokeWidth="11"
            strokeLinecap="round"
            fill="none"
          />

          {/* Pink Swoosh Checkmark rising upwards into VALID */}
          <path
            d="M 115 72 C 140 48, 168 25, 198 12 C 205 9, 202 17, 194 23 C 172 39, 145 66, 135 84 Z"
            fill="url(#pinkGradValid)"
          />

          {/* VALID Text */}
          <text
            x="165"
            y="62"
            fill="url(#pinkGradValid)"
            fontSize="54"
            fontWeight="900"
            fontFamily="'Outfit', 'Inter', system-ui, sans-serif"
            letterSpacing="-1"
          >
            ALID
          </text>

          {/* V letter in Pink */}
          <path
            d="M 148 22 L 168 62 L 184 22"
            stroke="url(#pinkGradValid)"
            strokeWidth="13"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
}
