'use client';

import React from 'react';

const correlations = [
  { pair: 'XAU/USD vs 10Y Real Yields (DFII10)', coefficient: -0.84, status: 'NORMAL INVERSE', regime: 'Yield-Driven Headwind' },
  { pair: 'BTC/USD vs Global M2 Money Supply', coefficient: +0.76, status: 'STRONG POSITIVE', regime: 'Liquidity Expansion' },
  { pair: 'USD/CAD vs WTI Crude Oil (DCOILWTICO)', coefficient: -0.68, status: 'MODERATE INVERSE', regime: 'Energy Commodity Drive' },
  { pair: 'XAU/USD vs US Dollar Index (DXY)', coefficient: -0.79, status: 'STRONG INVERSE', regime: 'Currency Debasement' },
  { pair: 'US High Yield Spreads vs Equities', coefficient: -0.72, status: 'STRONG INVERSE', regime: 'Risk Appetite Confirmation' },
];

export function CorrelationMatrix() {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4 font-sans">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 bg-sky-400 rounded-sm"></span>
            30-DAY ROLLING INTERMARKET CORRELATION MATRIX
          </h2>
          <p className="text-xs text-slate-400">Institutional Cross-Asset Relationship Stability & Regime Shift Detection</p>
        </div>
        <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded border border-slate-700">
          Rolling Window: 30D
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {correlations.map((item, idx) => (
          <div key={idx} className="bg-slate-950 p-4 border border-slate-800/80 rounded-xl space-y-2">
            <span className="text-slate-300 font-bold block">{item.pair}</span>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Correlation ($r$):</span>
              <span className={`text-lg font-bold ${item.coefficient < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {item.coefficient > 0 ? `+${item.coefficient}` : item.coefficient}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={item.coefficient < 0 ? 'bg-rose-400 h-full' : 'bg-emerald-400 h-full'} 
                style={{ width: `${Math.abs(item.coefficient) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 pt-1">
              <span>{item.status}</span>
              <span className="text-slate-400">{item.regime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
