import Link from 'next/link';

export default function ExecutionGuidePage() {
  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="border-b border-slate-800/80 pb-4">
        <Link href="/" className="text-emerald-400 text-xs hover:underline inline-flex items-center gap-1 mb-2">
          &larr; Back to Main Intelligence Dashboard
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-white uppercase">
            Institutional Entry & Execution Guide
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          A step-by-step framework for converting macro scores, yield differentials, and COT positioning into high-probability trade setups.
        </p>
      </div>

      {/* 1. CORE PURPOSE */}
      <section className="macro-card border-emerald-500/30 p-6 space-y-3">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          • 1. UNDERSTANDING THE ENGINE'S PURPOSE
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          This platform generates a <strong className="text-white">deterministic directional baseline</strong>—it establishes the fundamental macro tailwind over multi-day to multi-week horizons. It is <strong className="text-rose-400">not</strong> an intraday scalp signal generator. Always pair macro scores with technical price action (liquidity grabs, order blocks, and market structure breaks) on your execution charts.
        </p>
      </section>

      {/* 2. STEP-BY-STEP ENTRY PROTOCOL */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          • 2. STANDARD 4-STEP ENTRY PROTOCOL
        </h2>

        <div className="grid grid-cols-1 gap-4">
          
          {/* STEP 1 */}
          <div className="macro-card p-5 space-y-3 hover:border-slate-700/80 transition-all duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 macro-badge-emerald px-2 py-0.5 rounded">
                STEP 01
              </span>
              <span className="text-xs text-slate-400 font-bold">DIRECTIONAL BIAS</span>
            </div>
            <h3 className="text-sm font-bold text-white">Check Macro Score & Bias Range</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review the <strong className="text-slate-200">Final USD Bias Score</strong> on the main dashboard (<span className="text-emerald-400 font-bold">[-100, +100] PTS</span> scale):
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2 bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-emerald-400 font-bold shrink-0">▲</span>
                <div>
                  <strong className="text-emerald-400">Score &gt; +20 PTS (Bullish USD):</strong> Look for Short/Sell setups on XAU/USD, EUR/USD, GBP/USD, or Long setups on USD/JPY.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-rose-400 font-bold shrink-0">▼</span>
                <div>
                  <strong className="text-rose-400">Score &lt; -20 PTS (Bearish USD):</strong> Look for Long/Buy setups on XAU/USD, EUR/USD, or Short setups on USD pairs.
                </div>
              </li>
              <li className="flex items-start gap-2 bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-amber-400 font-bold shrink-0">■</span>
                <div>
                  <strong className="text-amber-400">Score -19 to +19 PTS (Neutral Regime):</strong> Range trading conditions. Maintain tighter profit targets or await clear macro expansion.
                </div>
              </li>
            </ul>
          </div>

          {/* STEP 2 */}
          <div className="macro-card p-5 space-y-3 hover:border-slate-700/80 transition-all duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 macro-badge-emerald px-2 py-0.5 rounded">
                STEP 02
              </span>
              <span className="text-xs text-slate-400 font-bold">INTERMARKET CONFIRMATION</span>
            </div>
            <h3 className="text-sm font-bold text-white">Confirm Intermarket Yields & Policy Stance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Validate real interest rates (TIPS) and yield differentials on the <strong className="text-slate-200">Bonds & Real Yields</strong> module:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-sky-400">10Y Real Yield (DFII10) &gt; 2.20%:</strong> Elevates capital holding costs for non-yielding safe havens (Gold/Silver), reinforcing USD tailwinds and bearish precious metals bias.
              </li>
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-sky-400">2Y Yield Spread (DGS2):</strong> Widening sovereign yield differentials directly favor USD strength against lower-yielding foreign currencies.
              </li>
            </ul>
          </div>

          {/* STEP 3 */}
          <div className="macro-card p-5 space-y-3 hover:border-slate-700/80 transition-all duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 macro-badge-emerald px-2 py-0.5 rounded">
                STEP 03
              </span>
              <span className="text-xs text-slate-400 font-bold">POSITIONING & STRUCTURE</span>
            </div>
            <h3 className="text-sm font-bold text-white">Align COT Positioning & Technical Confluence</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combine CFTC COT non-commercial speculator positioning with H1/H4 technical structures on your charting software:
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-emerald-400">For Bearish USD / Bullish Metals:</strong> Wait for price to pull back into key H1/H4 demand zones or daily order blocks before entering long positions.
              </li>
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-rose-400">For Bullish USD / Bearish Metals:</strong> Wait for relief rallies into high-volume supply zones or resistance levels before executing short orders.
              </li>
            </ul>
          </div>

          {/* STEP 4 */}
          <div className="macro-card p-5 space-y-3 hover:border-slate-700/80 transition-all duration-200">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 macro-badge-emerald px-2 py-0.5 rounded">
                STEP 04
              </span>
              <span className="text-xs text-slate-400 font-bold">EVENT RISK MANAGEMENT</span>
            </div>
            <h3 className="text-sm font-bold text-white">Filter Event Risk via Dynamic Calendar</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Review the <strong className="text-slate-200">/calendar</strong> tab for tier-1 economic catalysts (NFP, CPI, FOMC, Central Bank Meetings):
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-amber-400">Pre-Event Buffer:</strong> Avoid initiating new market orders within 30 minutes prior to tier-1 high-voltage releases.
              </li>
              <li className="bg-[#080b12] p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-emerald-400">Post-Release Execution:</strong> Allow initial news volatility spikes and liquidity sweeps to clear, then trade post-release pullbacks aligned with the macro engine bias.
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 3. GOLDEN RULES */}
      <section className="macro-card border-amber-500/30 p-6 space-y-3">
        <h2 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <span>⚡</span> • 3. GOLDEN EXECUTION RULES
        </h2>
        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2 bg-[#080b12] p-3 rounded-lg border border-slate-800/80">
            <span className="text-amber-400 font-bold shrink-0">•</span>
            <div>
              <strong className="text-white">Never trade macro bias blindly without technical risk definition:</strong> Macro scores establish directional probability; technical price action dictates stop-loss placement and precise entry timing.
            </div>
          </li>
          <li className="flex items-start gap-2 bg-[#080b12] p-3 rounded-lg border border-slate-800/80">
            <span className="text-amber-400 font-bold shrink-0">•</span>
            <div>
              <strong className="text-white">Swing Horizon Focus:</strong> Macro scores are designed for multi-day swing trades (2-to-10 day holding period). Do not expect instant 1-minute reactions on pipeline score updates.
            </div>
          </li>
          <li className="flex items-start gap-2 bg-[#080b12] p-3 rounded-lg border border-slate-800/80">
            <span className="text-amber-400 font-bold shrink-0">•</span>
            <div>
              <strong className="text-white">Data Pipeline Verification:</strong> Verify that status badges display <span className="text-emerald-400 font-bold">OPERATIONAL</span> on the top header so you are executing trades on fresh FRED and CFTC releases.
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
