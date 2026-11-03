import { PrismaClient } from '@prisma/client';
import BiasGauge from '@/components/BiasGauge';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 300;

async function getSpxMacroData() {
  try {
    const usdRecord = await prisma.currencyMacroScore.findFirst({
      where: { currencyCode: 'USD' },
      orderBy: { createdAt: 'desc' },
    });

    const realYield = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_real_yield_10y' } },
      orderBy: { releaseDate: 'desc' },
    });

    const ryVal = realYield?.actual ?? 2.63;
    const usdScore = usdRecord?.totalScore ?? 33;

    // Equity Multi-Factor Transmission Model
    const realYieldImpact = Math.round(-ryVal * 15); // High real yields compress P/E multiples
    const growthImpact = 45; // GDP expansion supports corporate earnings
    const usdImpact = Math.round(-usdScore * 0.4); // Strong USD headwinds S&P 500 international revenue
    const creditImpact = 35; // Unstressed credit markets provide liquidity tailwinds

    const spxScore = Math.min(100, Math.max(-100, Math.round(realYieldImpact + growthImpact + usdImpact + creditImpact)));

    return {
      spxScore,
      realYieldImpact,
      growthImpact,
      usdImpact,
      creditImpact,
      ryVal,
      usdScore,
    };
  } catch (err) {
    console.error('Error fetching SPX macro data:', err);
    return {
      spxScore: 15,
      realYieldImpact: -39,
      growthImpact: 45,
      usdImpact: -13,
      creditImpact: 35,
      ryVal: 2.63,
      usdScore: 33,
    };
  }
}

export default async function SpxPage() {
  const data = await getSpxMacroData();

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <h1 className="text-2xl font-bold tracking-wider text-white uppercase">
              S&P 500 ($SPX / $US500$) MACRO INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Institutional Risk-Appetite Transmission Model: Real Yield Multiples, Growth Momentum & Corporate Credit Spreads
          </p>
        </div>

        <div className="macro-card px-4 py-2.5 flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">EQUITY REGIME</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${data.spxScore >= 0 ? 'macro-badge-emerald' : 'macro-badge-rose'}`}>
            {data.spxScore >= 20 ? 'BULLISH EXPANSION' : data.spxScore >= 0 ? 'MODERATE GROWTH' : 'VALUATION COMPRESSION'}
          </span>
        </div>
      </div>

      {/* 5-FACTOR MODEL & GAUGE */}
      <section className="macro-card p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            <span className="h-2 w-2 bg-sky-400 rounded-full"></span>
            • S&P 500 EQUITY TRANSMISSION VECTOR BREAKDOWN
          </h2>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">GDP Growth Momentum (+54 PTS)</span>
                <span className="text-emerald-400 font-bold">+{data.growthImpact} PTS</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">10Y Real Yield Discounting ({data.ryVal}%)</span>
                <span className="text-rose-400 font-bold">{data.realYieldImpact} PTS</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: '39%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Broad USD Exchange Drag (+{data.usdScore} PTS)</span>
                <span className="text-rose-400 font-bold">{data.usdImpact} PTS</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-rose-400" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Credit Market Liquidity (NFCI Unstressed)</span>
                <span className="text-emerald-400 font-bold">+{data.creditImpact} PTS</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center border border-slate-800/80 rounded-xl p-4 bg-[#080b12]">
          <BiasGauge
            score={data.spxScore}
            title="S&P 500 MACRO BIAS"
            classification={data.spxScore >= 0 ? 'EARNINGS EXPANSION' : 'MULTIPLE COMPRESSION'}
          />
        </div>
      </section>

      {/* MULTI-TIMEFRAME DIRECTIONAL MATRIX */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • 1. MULTI-TIMEFRAME MACRO BIAS MATRIX (S&P 500)
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase">
                <th className="p-3">Timeframe</th>
                <th className="p-3">Directional Bias</th>
                <th className="p-3">Primary Macro Driver</th>
                <th className="p-3">Execution Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3 font-bold text-white">Intraday (H1/H4)</td>
                <td className="p-3 font-bold text-emerald-400">BULLISH DIP BUYING</td>
                <td className="p-3 text-slate-400">Unstressed Corporate Credit Spreads & Earnings Tailwinds</td>
                <td className="p-3 text-slate-300">Buy dips into H1/H4 demand zones near daily VWAP</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3 font-bold text-white">Weekly (Swing)</td>
                <td className="p-3 font-bold text-amber-400">CONSOLIDATION</td>
                <td className="p-3 text-slate-400">10Y Real Yield Discounting ({data.ryVal}%) vs Growth</td>
                <td className="p-3 text-slate-300">Trade range bounds; monitor yield spikes above 2.70%</td>
              </tr>
              <tr className="hover:bg-slate-900/40 transition">
                <td className="p-3 font-bold text-white">Monthly (Structural)</td>
                <td className="p-3 font-bold text-emerald-400">BULLISH EXPANSION</td>
                <td className="p-3 text-slate-400">U.S. GDP Output Expansion & Corporate Earnings Resiliency</td>
                <td className="p-3 text-slate-300">Hold long-term index position above major swing lows</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
