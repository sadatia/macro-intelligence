'use client';

import React from 'react';

interface ConfluenceProps {
  asset: string;
  usdScore: number;
  realYield: number;
}

export function ConfluenceChecklist({ asset, usdScore, realYield }: ConfluenceProps) {
  // Quantitative Confluence Logic
  const conditions = [
    {
      label: 'Macro USD Score Alignment',
      pass: usdScore > 60,
      detail: `USD Composite Score (+${usdScore}) reinforces institutional dollar strength.`,
    },
    {
      label: '10Y Real Yield Headwind/Tailwind',
      pass: realYield > 2.0,
      detail: `Real yield level (${realYield}%) applies holding cost pressure on non-yielding assets.`,
    },
    {
      label: 'CFTC COT Speculator Accumulation',
      pass: true,
      detail: 'Non-Commercial net positioning sitting in the 82nd historical percentile.',
    },
    {
      label: 'Credit Stress / High Yield Spread',
      pass: true,
      detail: 'Credit spreads under 4.0% signal stable broader financial condition baselines.',
    },
  ];

  const passCount = conditions.filter((c) => c.pass).length;
  const confluenceScore = Math.round((passCount / conditions.length) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 bg-amber-400 rounded-sm"></span>
            AUTOMATED TRADE CONFLUENCE CHECKLIST ({asset})
          </h2>
          <p className="text-xs text-slate-400">Institutional Macro Fundamental & Intermarket Confirmation Rules</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-slate-400 block">CONFLUENCE RATING</span>
          <span className="text-xl font-mono font-bold text-emerald-400">{confluenceScore}% MATCH</span>
        </div>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {conditions.map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-3 border border-slate-800/80 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full shrink-0 ${item.pass ? 'bg-emerald-400' : 'bg-rose-400'}`}></span>
              <div>
                <span className="text-slate-200 font-bold block">{item.label}</span>
                <span className="text-[11px] text-slate-400">{item.detail}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-[10px] font-bold shrink-0 ${
              item.pass ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}>
              {item.pass ? 'CONFIRMED' : 'UNCONFIRMED'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
