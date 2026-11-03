'use client';

import React from 'react';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'NZD'];

const MATRIX_SCORES: Record<string, Record<string, number>> = {
  USD: { USD: 0, EUR: 27, GBP: 14, JPY: 57, CAD: 21, AUD: 42, CHF: 6, NZD: 49 },
  EUR: { USD: -27, EUR: 0, GBP: -13, JPY: 30, CAD: -6, AUD: 15, CHF: -21, NZD: 22 },
  GBP: { USD: -13, EUR: 14, GBP: 0, JPY: 43, CAD: 7, AUD: 29, CHF: -8, NZD: 35 },
  JPY: { USD: -56, EUR: -29, GBP: -43, JPY: 0, CAD: -36, AUD: -14, CHF: -51, NZD: -8 },
  CAD: { USD: -20, EUR: 7, GBP: -7, JPY: 36, CAD: 0, AUD: 22, CHF: -15, NZD: 28 },
  AUD: { USD: -42, EUR: -15, GBP: -28, JPY: 15, CAD: -21, AUD: 0, CHF: -36, NZD: 7 },
  CHF: { USD: -5, EUR: 22, GBP: 8, JPY: 51, CAD: 15, AUD: 37, CHF: 0, NZD: 43 },
  NZD: { USD: -48, EUR: -21, GBP: -35, JPY: 8, CAD: -28, AUD: -6, CHF: -43, NZD: 0 },
};

export const CurrencyHeatmap: React.FC = () => {
  const getCellColor = (val: number, isDiag: boolean) => {
    if (isDiag) return 'bg-slate-900/60 text-slate-600';
    if (val >= 40) return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80';
    if (val > 0) return 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30';
    if (val <= -40) return 'bg-rose-950/80 text-rose-300 border-rose-800/80';
    return 'bg-rose-950/30 text-rose-400 border-rose-900/30';
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono shadow-2xl">
      <h2 className="text-base font-bold text-slate-200 mb-4 tracking-wider uppercase">
        8x8 Forex Relative Macro Matrix
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-2.5 text-slate-500 font-bold border border-slate-800/80 bg-slate-900/40">
                BASE \ QUOTE
              </th>
              {CURRENCIES.map((c) => (
                <th key={c} className="p-2.5 font-bold text-slate-300 border border-slate-800/80 bg-slate-900/40">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CURRENCIES.map((base) => (
              <tr key={base}>
                <td className="p-2.5 font-bold text-slate-300 border border-slate-800/80 bg-slate-900/40">
                  {base}
                </td>
                {CURRENCIES.map((quote) => {
                  const isDiag = base === quote;
                  const score = MATRIX_SCORES[base]?.[quote] ?? 0;
                  return (
                    <td
                      key={quote}
                      className={`p-2.5 font-bold border border-slate-800/60 ${getCellColor(score, isDiag)}`}
                    >
                      {isDiag ? '-' : `${score > 0 ? '+' : ''}${score}`}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};