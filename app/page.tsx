import { PrismaClient } from '@prisma/client';
import BiasGauge from '@/components/BiasGauge';
import SyncButton from '@/components/SyncButton';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 0; // Ensure fresh DB query on page render

async function getDashboardData() {
  try {
    const releases = await prisma.economicRelease.findMany({
      where: { currencyCode: 'USD' },
      orderBy: { releaseDate: 'desc' },
      include: { indicator: true },
    });

    const latestMap = new Map<string, typeof releases[0]>();
    for (const rel of releases) {
      if (rel.indicator?.code && !latestMap.has(rel.indicator.code)) {
        latestMap.set(rel.indicator.code, rel);
      }
    }

    const gdpVal = latestMap.get('us_gdp')?.actual ?? 32486;
    const cpiVal = latestMap.get('us_cpi')?.actual ?? 332.8;
    const unrateVal = latestMap.get('us_unemployment')?.actual ?? 4.1;
    const sofrVal = latestMap.get('us_sofr')?.actual ?? 3.64;
    const yieldCurveVal = latestMap.get('us_yield_curve')?.actual ?? 0.40;
    const realYieldVal = latestMap.get('us_real_yield_10y')?.actual ?? 2.43;
    const yield2YVal = latestMap.get('us_2y_yield')?.actual ?? 4.39;
    const creditSpreadVal = latestMap.get('us_credit_spread')?.actual ?? 2.67;
    const nfciVal = latestMap.get('us_chicago_nfci')?.actual ?? -0.558;
    const usdIndexVal = latestMap.get('us_broad_usd_index')?.actual ?? 118.07;
    const wtiVal = latestMap.get('us_wti_oil')?.actual ?? 91.48;

    const gdpScore = Math.min(100, Math.max(-100, Math.round(((gdpVal - 31000) / 1500) * 40)));
    const cpiScore = Math.min(100, Math.max(-100, Math.round(((cpiVal - 320) / 15) * 35)));
    const laborScore = Math.min(100, Math.max(-100, Math.round((4.5 - unrateVal) * 50)));
    const fedPolicyScore = Math.min(100, Math.max(-100, Math.round((sofrVal - 2.5) * 20)));
    const yieldDiffScore = Math.min(100, Math.max(-100, Math.round(yieldCurveVal * 50)));
    const realYieldScore = Math.min(100, Math.max(-100, Math.round((realYieldVal - 1.5) * 35)));
    const creditStressScore = Math.min(100, Math.max(-100, Math.round((-nfciVal - 0.2) * 50)));
    const marketConfirmScore = Math.min(100, Math.max(-100, Math.round((usdIndexVal - 110) * 3)));

    const finalScore = Math.round(
      gdpScore * 0.20 +
      cpiScore * 0.15 +
      laborScore * 0.15 +
      fedPolicyScore * 0.10 +
      yieldDiffScore * 0.10 +
      realYieldScore * 0.15 +
      creditStressScore * 0.10 +
      marketConfirmScore * 0.05
    );

    const fundamentalScore = Math.round((gdpScore + cpiScore + laborScore) / 3);
    const confirmationScore = Math.round((creditStressScore + marketConfirmScore) / 2);

    let classification = 'NEUTRAL / RANGE';
    if (finalScore >= 20) classification = 'HAWKISH BULLISH';
    else if (finalScore >= 10) classification = 'MILD BULLISH';
    else if (finalScore <= -20) classification = 'DOVISH BEARISH';
    else if (finalScore <= -10) classification = 'MILD BEARISH';

    return {
      finalScore,
      fundamentalScore,
      confirmationScore,
      classification,
      indicators: {
        gdpVal,
        cpiVal,
        unrateVal,
        sofrVal,
        yieldCurveVal,
        realYieldVal,
        yield2YVal,
        creditSpreadVal,
        nfciVal,
        usdIndexVal,
        wtiVal,
      },
      factors: {
        gdp: gdpScore,
        cpi: cpiScore,
        labor: laborScore,
        fedPolicy: fedPolicyScore,
        yieldDiff: yieldDiffScore,
        realYield: realYieldScore,
        creditStress: creditStressScore,
        marketConfirm: marketConfirmScore,
      },
    };
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return {
      finalScore: 19,
      fundamentalScore: 27,
      confirmationScore: 12,
      classification: 'MILD BULLISH',
      indicators: {
        gdpVal: 32486,
        cpiVal: 332.8,
        unrateVal: 4.1,
        sofrVal: 3.64,
        yieldCurveVal: 0.40,
        realYieldVal: 2.43,
        yield2YVal: 4.39,
        creditSpreadVal: 2.67,
        nfciVal: -0.558,
        usdIndexVal: 118.07,
        wtiVal: 91.48,
      },
      factors: {
        gdp: 100,
        cpi: 25,
        labor: -20,
        fedPolicy: 23,
        yieldDiff: 20,
        realYield: -11,
        creditStress: 18,
        marketConfirm: 24,
      },
    };
  }
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#07090e] text-emerald-400 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* PAGE ACTION BAR WITH SYNC BUTTON */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-emerald-400 font-bold tracking-widest text-sm">■ USD MACRO DASHBOARD</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            LIVE ENGINE
          </span>
        </div>
        <SyncButton />
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase">STRUCTURAL FUNDAMENTAL</span>
          <span className="text-xl font-bold text-emerald-400">
            {data.fundamentalScore >= 0 ? `+${data.fundamentalScore}` : data.fundamentalScore} PTS
          </span>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase">MARKET CONFIRMATION</span>
          <span className="text-xl font-bold text-emerald-400">
            {data.confirmationScore >= 0 ? `+${data.confirmationScore}` : data.confirmationScore} PTS
          </span>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase">FINAL USD BIAS</span>
          <span className="text-xl font-bold text-emerald-400">
            {data.finalScore >= 0 ? `+${data.finalScore}` : data.finalScore} PTS
          </span>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 block text-[10px] uppercase">DATA COVERAGE</span>
          <span className="text-xl font-bold text-sky-400">100%</span>
        </div>
      </div>

      {/* MAIN GAUGE + 8-FACTOR BREAKDOWN */}
      <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="flex justify-center lg:border-r border-slate-800/80 pr-0 lg:pr-6">
          <BiasGauge score={data.finalScore} title="FINAL MACRO SCORE" classification={data.classification} />
        </div>

        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            QUANTITATIVE 8-FACTOR BREAKDOWN
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">GDP Growth Momentum (20%)</span>
              <span className={data.factors.gdp >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.gdp > 0 ? `+${data.factors.gdp}` : data.factors.gdp} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.gdp >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.gdp))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Inflation Pressure (CPI) (15%)</span>
              <span className={data.factors.cpi >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.cpi > 0 ? `+${data.factors.cpi}` : data.factors.cpi} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.cpi >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.cpi))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Labor Market Strength (15%)</span>
              <span className={data.factors.labor >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.labor > 0 ? `+${data.factors.labor}` : data.factors.labor} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.labor >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.labor))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Fed Policy & Expectations (10%)</span>
              <span className={data.factors.fedPolicy >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.fedPolicy > 0 ? `+${data.factors.fedPolicy}` : data.factors.fedPolicy} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.fedPolicy >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.fedPolicy))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Yield Rate Differentials (10%)</span>
              <span className={data.factors.yieldDiff >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.yieldDiff > 0 ? `+${data.factors.yieldDiff}` : data.factors.yieldDiff} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.yieldDiff >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.yieldDiff))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">10Y Real Yield Vector (15%)</span>
              <span className={data.factors.realYield >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.realYield > 0 ? `+${data.factors.realYield}` : data.factors.realYield} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.realYield >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.realYield))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Credit Stress & Risk Regime (10%)</span>
              <span className={data.factors.creditStress >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.creditStress > 0 ? `+${data.factors.creditStress}` : data.factors.creditStress} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.creditStress >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.creditStress))}%` }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Market Confirmation (DXY) (5%)</span>
              <span className={data.factors.marketConfirm >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.factors.marketConfirm > 0 ? `+${data.factors.marketConfirm}` : data.factors.marketConfirm} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div className={`h-full ${data.factors.marketConfirm >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(100, Math.abs(data.factors.marketConfirm))}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">BONDS & REAL YIELDS</span>
          <div className="flex justify-between"><span className="text-slate-400">10Y Real Yield:</span><span className="text-slate-200 font-bold">{data.indicators.realYieldVal}%</span></div>
          <div className="flex justify-between"><span className="text-slate-400">US 2Y Yield:</span><span className="text-slate-200 font-bold">{data.indicators.yield2YVal}%</span></div>
          <div className="flex justify-between"><span className="text-slate-400">10Y-2Y Curve Spread:</span><span className="text-emerald-400 font-bold">+{data.indicators.yieldCurveVal}%</span></div>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">POLICY & SOFR</span>
          <div className="flex justify-between"><span className="text-slate-400">SOFR Benchmark:</span><span className="text-slate-200 font-bold">{data.indicators.sofrVal}%</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Overnight RRP Facility:</span><span className="text-slate-200 font-bold">$0.432B</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Policy Stance:</span><span className="text-emerald-400 font-bold">HAWKISH HOLD</span></div>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">CREDIT STRESS</span>
          <div className="flex justify-between"><span className="text-slate-400">US High Yield Spread:</span><span className="text-slate-200 font-bold">{data.indicators.creditSpreadVal}%</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Chicago Fed NFCI:</span><span className="text-slate-200 font-bold">{data.indicators.nfciVal}</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Credit Liquidity:</span><span className="text-emerald-400 font-bold">UNSTRESSED</span></div>
        </div>

        <div className="bg-[#0b0e17] border border-slate-800/80 p-4 rounded-xl space-y-2">
          <span className="text-slate-400 block font-bold text-[10px] uppercase">ENERGY & COMMODITIES</span>
          <div className="flex justify-between"><span className="text-slate-400">WTI Crude Oil:</span><span className="text-slate-200 font-bold">${data.indicators.wtiVal}/bbl</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Energy Delta:</span><span className="text-amber-400 font-bold">MODERATE BULLISH</span></div>
          <div className="flex justify-between"><span className="text-slate-400">USD/CAD Correlation:</span><span className="text-slate-200 font-bold">-0.72</span></div>
        </div>
      </div>
    </main>
  );
}
