'use client';

import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface MacroDashboardProps {
  usdScore: number;
  classification: string;
  confidence: string;
  categoryScores: {
    growth: number;
    inflation: number;
    labor: number;
    fed: number;
    marketConfirm: number;
  };
  drivers: string[];
  risks: string[];
}

export const MacroDashboard: React.FC<MacroDashboardProps> = ({
  usdScore = 72,
  classification = 'BULLISH',
  confidence = 'HIGH',
  categoryScores = { growth: 68, inflation: 74, labor: 81, fed: 76, marketConfirm: 58 },
  drivers = [
    'Labor market stronger than expected (NFP +215K vs +175K forecast)',
    'Core CPI surprise remains sticky (+0.3% MoM)',
    'GDP growth estimate revised upward to 2.8%',
    'Fed hawkish pause probability at 84%',
  ],
  risks = [
    'Manufacturing PMI contraction zone (48.2)',
    'JOLTS Job Openings trending lower past 3 months',
  ],
}) => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 text-slate-100 font-mono p-6 border border-slate-800 rounded-xl shadow-2xl space-y-6">
      {/* HEADER */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-wider text-emerald-400 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            USD MACRO INTELLIGENCE
          </h1>
          <p className="text-xs text-slate-400 mt-1">Multi-Currency Deterministic Quantitative Engine</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-slate-400 font-semibold">ENGINE STATUS:</span>
          <span className="text-xs text-emerald-400 font-bold">OPERATIONAL</span>
        </div>
      </div>

      {/* CORE DISPLAY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-900/50 p-6 rounded-lg border border-slate-800/80">
        <div className="flex flex-col items-center justify-center md:border-r border-slate-800/80 pr-0 md:pr-6">
          <span className="text-xs text-slate-400 font-semibold tracking-wider">MACRO SCORE</span>
          <div className="text-6xl font-extrabold text-emerald-400 my-2 tracking-tight">
            +{usdScore}
          </div>
          <span className="text-lg font-bold text-emerald-400 tracking-wide">{classification}</span>
          <div className="mt-3 text-xs text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            CONFIDENCE: <strong className="text-emerald-300">{confidence}</strong>
          </div>
        </div>

        {/* BREAKDOWN BARS */}
        <div className="md:col-span-2 space-y-3">
          {Object.entries(categoryScores).map(([category, val]) => (
            <div key={category} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="uppercase text-slate-300">{category}</span>
                <span className="text-emerald-400">+{val}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.max(0, val))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DRIVERS AND RISKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/30 p-4 rounded-lg border border-emerald-900/40 space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2 tracking-wide uppercase">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Primary Macro Drivers
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {drivers.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/30 p-4 rounded-lg border border-amber-900/40 space-y-3">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 tracking-wide uppercase">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Macro Risks & Divergences
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {risks.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">⚠</span>
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};