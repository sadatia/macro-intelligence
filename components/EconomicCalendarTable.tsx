'use client';

import React from 'react';

export interface EconomicReleaseItem {
  id: string;
  date: string;
  time: string;
  currency: string;
  indicator: string;
  actual: number;
  forecast: number | null;
  previous: number;
  revisedPrevious?: number | null;
  unit: string;
  surpriseSigma: number | null;
  score: number;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
}

const MOCK_RELEASES: EconomicReleaseItem[] = [
  {
    id: '1',
    date: '2026-09-04',
    time: '12:30 GMT',
    currency: 'USD',
    indicator: 'Non-Farm Payrolls',
    actual: 215,
    forecast: 175,
    previous: 160,
    revisedPrevious: 170,
    unit: 'K',
    surpriseSigma: 2.0,
    score: 5,
    importance: 'HIGH',
  },
  {
    id: '2',
    date: '2026-09-04',
    time: '12:30 GMT',
    currency: 'USD',
    indicator: 'Unemployment Rate',
    actual: 3.9,
    forecast: 4.1,
    previous: 4.0,
    unit: '%',
    surpriseSigma: 2.0,
    score: 5,
    importance: 'HIGH',
  },
  {
    id: '3',
    date: '2026-09-03',
    time: '09:00 GMT',
    currency: 'EUR',
    indicator: 'CPI YoY Flash',
    actual: 2.4,
    forecast: 2.2,
    previous: 2.6,
    unit: '%',
    surpriseSigma: 0.8,
    score: 3,
    importance: 'HIGH',
  },
  {
    id: '4',
    date: '2026-09-02',
    time: '01:30 GMT',
    currency: 'AUD',
    indicator: 'GDP Growth QoQ',
    actual: 0.2,
    forecast: 0.4,
    previous: 0.3,
    unit: '%',
    surpriseSigma: -1.0,
    score: -3,
    importance: 'HIGH',
  },
  {
    id: '5',
    date: '2026-09-01',
    time: '23:30 GMT',
    currency: 'JPY',
    indicator: 'Manufacturing PMI',
    actual: 49.5,
    forecast: 49.8,
    previous: 49.2,
    unit: 'pts',
    surpriseSigma: -0.3,
    score: -1,
    importance: 'MEDIUM',
  },
];

export const EconomicCalendarTable: React.FC = () => {
  const getBadgeColor = (score: number) => {
    if (score >= 3) return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    if (score > 0) return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40';
    if (score === 0) return 'bg-slate-900 text-slate-400 border-slate-800';
    if (score > -3) return 'bg-rose-950/30 text-rose-400 border-rose-900/40';
    return 'bg-rose-950/80 text-rose-300 border-rose-800';
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-200 tracking-wider uppercase">
            Economic Calendar & Surprise Scoring
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Normalized Standard Deviation Surprises ($\sigma$) and Derived Macro Scores
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Showing 5 Latest Releases
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="p-3">DATE / TIME</th>
              <th className="p-3">CURR</th>
              <th className="p-3">INDICATOR</th>
              <th className="p-3">ACTUAL</th>
              <th className="p-3">FORECAST</th>
              <th className="p-3">PREVIOUS</th>
              <th className="p-3">SURPRISE ($\sigma$)</th>
              <th className="p-3 text-center">SCORE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {MOCK_RELEASES.map((rel) => (
              <tr key={rel.id} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 text-slate-400">
                  <div>{rel.date}</div>
                  <div className="text-[10px] text-slate-500">{rel.time}</div>
                </td>
                <td className="p-3 font-bold text-slate-200">{rel.currency}</td>
                <td className="p-3 font-semibold text-slate-300">{rel.indicator}</td>
                <td className="p-3 font-bold text-emerald-400">
                  {rel.actual}{rel.unit}
                </td>
                <td className="p-3 text-slate-400">
                  {rel.forecast !== null ? `${rel.forecast}${rel.unit}` : 'N/A'}
                </td>
                <td className="p-3 text-slate-500">
                  {rel.previous}{rel.unit}
                  {rel.revisedPrevious && (
                    <span className="text-[10px] text-amber-400 block">
                      Rev: {rel.revisedPrevious}{rel.unit}
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-slate-300">
                  {rel.surpriseSigma !== null
                    ? `${rel.surpriseSigma > 0 ? '+' : ''}${rel.surpriseSigma.toFixed(1)}$\sigma$`
                    : 'N/A'}
                </td>
                <td className="p-3 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded border text-xs font-bold ${getBadgeColor(rel.score)}`}>
                    {rel.score > 0 ? `+${rel.score}` : rel.score}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
