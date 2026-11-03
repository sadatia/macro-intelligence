'use client';

import React from 'react';
import { Layers, ShieldCheck, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

interface IndicatorBreakdown {
  name: string;
  category: string;
  weight: number;
  direction: string;
  latestValue: string;
  score: number;
}

interface CurrencyDetailProps {
  currencyCode: string;
  currencyName: string;
  centralBank: string;
  macroScore: number;
  classification: string;
  confidence: string;
  categoryScores: {
    growth: number;
    inflation: number;
    labor: number;
    policy: number;
    activity: number;
  };
  indicators: IndicatorBreakdown[];
}

export const CurrencyDetailView: React.FC<CurrencyDetailProps> = ({
  currencyCode,
  currencyName,
  centralBank,
  macroScore,
  classification,
  confidence,
  categoryScores,
  indicators,
}) => {
  const getScoreBadge = (score: number) => {
    if (score >= 3) return 'text-emerald-400 bg-emerald-950/80 border-emerald-800';
    if (score > 0) return 'text-emerald-400 bg-emerald-950/30 border-emerald-900/40';
    if (score === 0) return 'text-slate-400 bg-slate-900 border-slate-800';
    if (score > -3) return 'text-rose-400 bg-rose-950/30 border-rose-900/40';
    return 'text-rose-400 bg-rose-950/80 border-rose-800';
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-mono text-slate-100 space-y-6">
      {/* HEADER CARD */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl flex flex-wrap justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-wider text-emerald-400 uppercase">
              {currencyCode} - {currencyName}
            </h1>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-slate-400">
              {centralBank}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Detailed Quantitative Macro Profile & Category Weights</p>
        </div>

        <div className="flex items-center gap-6 bg-slate-900/60 p-4 rounded-lg border border-slate-800">
          <div className="text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">Macro Score</span>
            <span className="text-3xl font-extrabold text-emerald-400">{macroScore > 0 ? `+${macroScore}` : macroScore}</span>
          </div>
          <div className="border-l border-slate-800 pl-6">
            <span className="text-xs font-bold text-emerald-400 block">{classification}</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              CONFIDENCE: <strong className="text-slate-200">{confidence}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(categoryScores).map(([cat, val]) => (
          <div key={cat} className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="uppercase text-slate-400 font-bold">{cat}</span>
              <span className={val >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {val > 0 ? `+${val}` : val}
              </span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${val >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.abs(val))}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* INDICATOR WEIGHTS TABLE */}
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          Component Indicators & Weights
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                <th className="p-3">INDICATOR NAME</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">WEIGHT</th>
                <th className="p-3">ORIENTATION</th>
                <th className="p-3">LATEST VALUE</th>
                <th className="p-3 text-right">SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {indicators.map((ind, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-bold text-slate-200">{ind.name}</td>
                  <td className="p-3 uppercase text-slate-400 text-[10px]">{ind.category}</td>
                  <td className="p-3 font-mono text-slate-300">{ind.weight} pts</td>
                  <td className="p-3 text-slate-400 text-[10px]">{ind.direction}</td>
                  <td className="p-3 font-bold text-slate-200">{ind.latestValue}</td>
                  <td className="p-3 text-right">
                    <span className={`inline-block px-2 py-0.5 rounded border font-bold text-xs ${getScoreBadge(ind.score)}`}>
                      {ind.score > 0 ? `+${ind.score}` : ind.score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
