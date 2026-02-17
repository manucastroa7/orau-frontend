
import React from 'react';

export const COLORS = {
  cream: '#F8F7F3',
  taupe: '#7D7268',
  dark: '#1A1A1A',
  gold: '#C5A059'
};

export const SOL_DE_MAYO_SVG = (className = "w-6 h-6") => (
  <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Central Face Details */}
    <g stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="50" cy="50" r="14" fill="none" />
      {/* Eyes */}
      <ellipse cx="45" cy="47" rx="2.5" ry="1.5" />
      <circle cx="45" cy="47" r="0.8" fill="currentColor" />
      <ellipse cx="55" cy="47" rx="2.5" ry="1.5" />
      <circle cx="55" cy="47" r="0.8" fill="currentColor" />
      {/* Eyebrows */}
      <path d="M42 44.5 C43 43.5 47 43.5 48 44.5" />
      <path d="M52 44.5 C53 43.5 57 43.5 58 44.5" />
      {/* Nose */}
      <path d="M50 48 L50 54 M48 54 L52 54" />
      {/* Mouth */}
      <path d="M46 58 C47 57 53 57 54 58 M47 58.5 C48 59.5 52 59.5 53 58.5" />
    </g>

    {/* Rays: 16 straight and 16 wavy */}
    <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      {[...Array(32)].map((_, i) => {
        const angle = (i * 360) / 32;
        const rad = (angle * Math.PI) / 180;
        const isWavy = i % 2 !== 0;
        
        if (!isWavy) {
          // Straight rays
          return (
            <line
              key={i}
              x1={50 + 16 * Math.cos(rad)}
              y1={50 + 16 * Math.sin(rad)}
              x2={50 + 42 * Math.cos(rad)}
              y2={50 + 42 * Math.sin(rad)}
            />
          );
        } else {
          // Wavy rays (Approximated with a path)
          const rStart = 16;
          const rEnd = 40;
          const x1 = 50 + rStart * Math.cos(rad);
          const y1 = 50 + rStart * Math.sin(rad);
          
          // Mid points for wave
          const rMid1 = 24;
          const rMid2 = 32;
          const waveAmp = 0.08; // wave amplitude in radians
          
          const xM1 = 50 + rMid1 * Math.cos(rad + waveAmp);
          const yM1 = 50 + rMid1 * Math.sin(rad + waveAmp);
          const xM2 = 50 + rMid2 * Math.cos(rad - waveAmp);
          const yM2 = 50 + rMid2 * Math.sin(rad - waveAmp);
          const x2 = 50 + rEnd * Math.cos(rad);
          const y2 = 50 + rEnd * Math.sin(rad);

          return (
            <path
              key={i}
              d={`M ${x1} ${y1} Q ${xM1} ${yM1} ${xM2} ${yM2} T ${x2} ${y2}`}
              fill="none"
              strokeWidth="0.8"
            />
          );
        }
      })}
    </g>
  </svg>
);

export const LOGO_SVG = (
  <svg viewBox="0 0 400 200" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="0.5">
    <circle cx="100" cy="100" r="45" />
    <circle cx="103" cy="100" r="45" />
    <path d="M160 60 L160 140 M160 60 L200 60 L200 100 L160 100 L210 140" strokeLinejoin="round" />
    <path d="M230 140 L260 60 L290 140 M245 110 L275 110" />
    <path d="M320 60 L320 120 C320 135 345 135 345 120 L345 60" />
  </svg>
);
