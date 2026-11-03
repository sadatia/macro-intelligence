'use client';

import React from 'react';

export interface CentralBankInfo {
  bank: string;
  currency: string;
  rate: number;
  previousRate: number;
  stance: 'STRONGLY_HAWKISH' | 'HAWKISH' | 'NEUTRAL' | 'DOVISH' | 'STRONGLY_DOVISH';
  nextMeeting: string;
  policyScore: number;
}

const BANKS: CentralBankInfo[] = [
  { bank: 'Federal Reserve (Fed)', currency: 'USD', rate: 5.25, previousRate: 5.50, stance: 'HAWKISH', nextMeeting: '2026-09-17', policyScore: 4 },
  { bank: 'European Central Bank (ECB)', currency: 'EUR', rate: 3.75, previousRate: 4.00, stance: 'NEUTRAL', nextMeeting: '2026-09-12', policyScore: 0 },
  { bank: 'Bank of England (BoE)', currency: 'GBP', rate: 5.00, previousRate: 5.25, stance: 'HAWKISH', nextMeeting: '2026-09-18', policyScore: 3 },
  { bank: 'Bank of Japan (BoJ)', currency: 'JPY', rate: 0.25, previousRate: 0.10, stance: 'DOVISH', nextMeeting: '2026-09-20', policyScore: -4 },
  { bank: 'Bank of Canada (BoC)', currency: 'CAD', rate: 4.25, previousRate: 4.50, stance: 'NEUTRAL', nextMeeting: '2026-09-10', policyScore: 1 },
  { bank: 'Reserve Bank of Australia (RBA)', currency: 'AUD', rate: 4.35, previousRate: 4.35, stance: 'NEUTRAL', nextMeeting: '2026-09-24', policyScore: 0 },
  { bank: 'Swiss National Bank (SNB)', currency: 'CHF', rate: 1.25, previousRate: 1.50, stance: 'HAWKISH', nextMeeting: '2026-09-26', policyScore: 3 },
  { bank: 'Reserve Bank of NZ (RBNZ)', currency: 'NZD', rate: 5.25, previousRate: 5.50, stance: 'DOVISH', nextMeeting: '2026-10-02', policyScore: -2 },
];

export const CentralBankWatch: React.FC = () => {
  const getStanceBadge = (stance: string) => {
    switch (stance) {
      case 'STRONGLY_HAWKISH':
      case 'HAWKISH':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      case 'NEUTRAL':
        return 'bg-slate-900 text-slate-400 border-slate-800';
      case 'DOVISH':
      case 'STRONGLY_DOVISH':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      default:
        return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono shadow-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-200 tracking-wider uppercase">
          Central Bank Policy Matrix
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Policy Interest Rates, Hawkish/Dovish Orientations, and Upcoming Decisions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {BANKS.map((item) => (
          <div key={item.currency} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400">{item.currency}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-bold ${getStanceBadge(item.stance)}`}>
                  {item.stance}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-200">{item.bank}</div>
              <div className="mt-3 flex justify-between items-baseline">
                <span className="text-xs text-slate-500">Policy Rate:</span>
                <span className="text-lg font-extrabold text-emerald-400">{item.rate.toFixed(2)}%</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between items-center text-[11px] text-slate-400">
              <span>Next Decision:</span>
              <span className="text-slate-300 font-bold">{item.nextMeeting}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
