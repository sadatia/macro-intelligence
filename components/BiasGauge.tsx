'use client';

import React from 'react';

interface BiasGaugeProps {
  score: number; // Value from -100 to +100
  title?: string;
  classification?: string;
}

export default function BiasGauge({ score, title, classification }: BiasGaugeProps) {
  // Clamp score between -100 and +100
  const clampedScore = Math.max(-100, Math.min(100, score));

  // Map -100..+100 score to -90..+90 degrees
  const angle = (clampedScore / 100) * 90;

  // Color determination based on score
  const getScoreColor = (val: number) => {
    if (val >= 50) return '#10b981'; // Strong Bullish
    if (val >= 15) return '#34d399'; // Bullish
    if (val <= -50) return '#e11d48'; // Strong Bearish
    if (val <= -15) return '#f43f5e'; // Bearish
    return '#f59e0b'; // Neutral
  };

  const currentColor = getScoreColor(clampedScore);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
      {title && (
        <span className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-2">
          {title}
        </span>
      )}

      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="gaugeArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e11d48" />
              <stop offset="25%" stopColor="#f43f5e" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Background Arc Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored Gradient Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeArc)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Scale Ticks */}
          <line x1="20" y1="100" x2="28" y2="100" stroke="#64748b" strokeWidth="2" />
          <line x1="100" y1="20" x2="100" y2="28" stroke="#64748b" strokeWidth="2" />
          <line x1="180" y1="100" x2="172" y2="100" stroke="#64748b" strokeWidth="2" />

          {/* Center Pivot Point */}
          <circle cx="100" cy="100" r="7" fill="#334155" stroke="#0f172a" strokeWidth="2" />

          {/* Animated Gauge Needle */}
          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: '100px 100px',
              transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <line x1="100" y1="100" x2="100" y2="28" stroke={currentColor} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="100" cy="100" r="3.5" fill={currentColor} />
          </g>
        </svg>

        {/* Floating Live Value Box */}
        <div className="absolute bottom-0 text-center transform translate-y-1">
          <span className="text-3xl font-extrabold tracking-tight" style={{ color: currentColor }}>
            {clampedScore > 0 ? `+${clampedScore}` : clampedScore}
          </span>
        </div>
      </div>

      {classification && (
        <span
          className="text-xs font-bold uppercase tracking-wider mt-3 px-2.5 py-0.5 rounded-full border"
          style={{
            color: currentColor,
            borderColor: `${currentColor}40`,
            backgroundColor: `${currentColor}10`,
          }}
        >
          {classification}
        </span>
      )}
    </div>
  );
}
