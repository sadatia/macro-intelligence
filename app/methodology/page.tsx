import React from 'react';

export default function MethodologyPage() {
  const factors = [
    { name: 'Fed Policy Stance (EFFR)', code: 'us_fed_effr', weight: '20%', source: 'Federal Reserve', category: 'Structural' },
    { name: 'GDP Growth Momentum', code: 'us_gdp', weight: '15%', source: 'BEA', category: 'Structural' },
    { name: 'Labor Market Strength (NFP)', code: 'us_nfp', weight: '15%', source: 'BLS', category: 'Structural' },
    { name: '2Y Yield Differential', code: 'us_rate_diff_2y', weight: '15%', source: 'FRED', category: 'Structural' },
    { name: 'Inflation Pressure (CPI)', code: 'us_cpi', weight: '10%', source: 'BLS', category: 'Structural' },
    { name: '10Y Real Yield Vector', code: 'us_real_yield_10y', weight: '10%', source: 'U.S. Treasury', category: 'Structural' },
    { name: 'Market Confirmation (DXY)', code: 'us_dxy_trend', weight: '10%', source: 'Market Data', category: 'Confirmation' },
    { name: 'Chicago Fed NFCI', code: 'us_nfci', weight: '5%', source: 'Chicago Fed', category: 'Structural' },
  ];

  return (
    <main className="p-8 max-w-6xl mx-auto font-mono text-slate-100">
      <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* HEADER */}
        <div className="border-b border-slate-800 pb-4">
          <h1 className="text-xl font-bold tracking-wider text-emerald-400 uppercase">
            Scoring Methodology & Quantitative Framework
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic 8-Factor Weighting, Normalized Surprises (&sigma;), and Currency Relative Bias
          </p>
        </div>

        {/* SECTION 1: SURPRISE CALCULATION */}
        <div className="space-y-3 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">1. Standardized Surprise Score (&sigma;)</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Economic data releases are normalized against historical forecast surprises using indicator-specific standard deviation (&sigma;):
          </p>
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-emerald-300 font-mono text-center">
            Normalized Surprise (&sigma;) = (Actual - Forecast) / Historical Standard Deviation
          </div>
          <ul className="text-xs text-slate-400 space-y-1 list-disc pl-5">
            <li>&ge; +2.0&sigma; &rArr; +5 (Strong Bullish)</li>
            <li>+1.0&sigma; to +2.0&sigma; &rArr; +4</li>
            <li>+0.5&sigma; to +1.0&sigma; &rArr; +3</li>
            <li>-0.2&sigma; to +0.2&sigma; &rArr; 0 (Neutral)</li>
            <li>&le; -2.0&sigma; &rArr; -5 (Strong Bearish)</li>
          </ul>
        </div>

        {/* SECTION 2: 8-FACTOR WEIGHT DISTRIBUTION TABLE */}
        <div className="space-y-3 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">2. Quantitative 8-Factor Model & Weights</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            The composite USD score aggregates 8 normalized factors weighted by macroeconomic impact:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase">
                  <th className="py-2 px-3">Factor Name</th>
                  <th className="py-2 px-3">Prisma Code</th>
                  <th className="py-2 px-3">Weight</th>
                  <th className="py-2 px-3">Source</th>
                  <th className="py-2 px-3">Layer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {factors.map((item) => (
                  <tr key={item.code} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 font-semibold text-white">{item.name}</td>
                    <td className="py-2 px-3 text-emerald-400">{item.code}</td>
                    <td className="py-2 px-3 text-amber-400 font-bold">{item.weight}</td>
                    <td className="py-2 px-3 text-slate-400">{item.source}</td>
                    <td className="py-2 px-3 text-sky-400">{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: REVISION & TREND ENGINES */}
        <div className="space-y-3 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">3. Revisions & Trend Modifiers</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Revisions to previous observations (Revised Previous - Previous) adjust individual metrics up to &plusmn;1.0 point. Momentum across the trailing 3 releases applies a &plusmn;0.5 trend modifier before final factor scores are clamped to [-5, +5].
          </p>
        </div>

        {/* SECTION 4: RELATIVE FOREX BIAS */}
        <div className="space-y-3 bg-slate-900/40 p-4 rounded-lg border border-slate-800">
          <h2 className="text-sm font-bold text-slate-200">4. Cross-Currency Relative Normalization</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Forex Matrix relative scores compare base and quote currency scores, normalized and clamped to [-100, +100]:
          </p>
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs text-emerald-300 font-mono text-center">
            Relative Score = clamp((Base Score - Quote Score) / 2, -100, +100)
          </div>
        </div>

        {/* FOOTER DISCLAIMER */}
        <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
          Disclaimer: USD Macro Intelligence is an analytical framework and quantitative assessment tool. It does not provide guaranteed trade execution signals or direct financial advice.
        </div>
      </div>
    </main>
  );
}
