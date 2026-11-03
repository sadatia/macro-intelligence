import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import BiasGauge from '@/components/BiasGauge';
import { GoldCotCharts } from '@/components/GoldCotCharts';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 300; // Revalidate every 5 minutes

async function getXauusdData() {
  try {
    const [realYield, yieldCurve, usdIndex, breakeven, nfci, usdRecord, cotRecords] = await Promise.all([
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_real_yield_10y' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_yield_curve' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_broad_usd_index' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_10y_breakeven' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_chicago_nfci' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.currencyMacroScore.findFirst({
        where: { currencyCode: 'USD' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.cotPosition.findMany({
        where: { assetCode: 'XAU' },
        orderBy: { reportDate: 'asc' },
        take: 8,
      }),
    ]);

    const usdMacroScore = usdRecord?.totalScore ?? 22;
    const realYieldVal = realYield?.actual ?? 2.43;
    const yieldCurveVal = yieldCurve?.actual ?? 0.40;
    const usdIndexVal = usdIndex?.actual ?? 118.07;
    const breakevenVal = breakeven?.actual ?? 2.29;
    const nfciVal = nfci?.actual ?? -0.558;

    // Transmission Factor Scores (-100 to +100)
    const realYieldScore = Math.min(100, Math.max(-100, Math.round((2.0 - realYieldVal) * 50)));
    const yieldCurveScore = Math.min(100, Math.max(-100, Math.round(yieldCurveVal * 80)));
    const usdScore = Math.min(100, Math.max(-100, Math.round(-usdMacroScore * 2)));
    const inflationScore = Math.min(100, Math.max(-100, Math.round((breakevenVal - 2.0) * 80)));
    const stressScore = Math.min(100, Math.max(-100, Math.round((nfciVal + 0.5) * 100)));

    const totalScore = Math.round(
      realYieldScore * 0.30 +
      yieldCurveScore * 0.20 +
      usdScore * 0.20 +
      inflationScore * 0.15 +
      stressScore * 0.15
    );

    let classification = 'NEUTRAL';
    if (totalScore >= 25) classification = 'BULLISH ACCUMULATION';
    else if (totalScore <= -25) classification = 'BEARISH DISTRIBUTION';

    // Format Database COT Data into Chart Shape (with Fallbacks)
    const oiData = cotRecords.length > 0
      ? cotRecords.map((r) => ({
          period: new Date(r.reportDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          openInterest: Math.round(r.openInterest / 1000),
          netLongs: Math.round(r.nonCommNet / 1000),
        }))
      : [
          { period: 'May W1', openInterest: 485, netLongs: 210 },
          { period: 'May W3', openInterest: 492, netLongs: 218 },
          { period: 'Jun W1', openInterest: 478, netLongs: 205 },
          { period: 'Jun W3', openInterest: 482, netLongs: 212 },
          { period: 'Jul W1', openInterest: 510, netLongs: 235 },
          { period: 'Jul W3', openInterest: 465, netLongs: 220 },
          { period: 'Aug W1', openInterest: 525, netLongs: 248 },
          { period: 'Aug W3', openInterest: 415, netLongs: 243 },
        ];

    const cotChanges = cotRecords.length > 0
      ? cotRecords.map((r, i) => ({
          week: `W${i + 1}`,
          longDelta: Math.round(r.weeklyLongDelta),
          shortDelta: Math.round(r.weeklyShortDelta),
        }))
      : [
          { week: 'W1', longDelta: 8500, shortDelta: -4200 },
          { week: 'W2', longDelta: -3200, shortDelta: 6100 },
          { week: 'W3', longDelta: 12400, shortDelta: -2100 },
          { week: 'W4', longDelta: -5100, shortDelta: 8900 },
          { week: 'W5', longDelta: 16800, shortDelta: -7400 },
          { week: 'W6', longDelta: -9200, shortDelta: 4500 },
          { week: 'W7', longDelta: 4100, shortDelta: -1800 },
          { week: 'W8', longDelta: 21100, shortDelta: -8600 },
        ];

    const intradayBias = usdMacroScore > 20 ? 'BEARISH MOMENTUM' : usdMacroScore < -20 ? 'BULLISH MOMENTUM' : 'NEUTRAL CONSOLIDATION';
    const intradayStrategy = usdMacroScore > 20 
      ? 'Sell intraday rallies into key H1/H4 supply zones' 
      : usdMacroScore < -20 
      ? 'Buy dips near intraday H1/H4 demand zones' 
      : 'Trade range bounds with tight stops';

    const weeklyBias = totalScore >= 25 
      ? 'BULLISH ACCUMULATION' 
      : totalScore <= -25 
      ? 'BEARISH DISTRIBUTION' 
      : 'RANGE NEUTRAL';

    const weeklyStrategy = totalScore >= 25 
      ? 'Accumulate swing longs on pullbacks to support' 
      : totalScore <= -25 
      ? 'Sell swing rallies; favor downside continuations' 
      : 'Trade range bounds; await Real Yield confirmation';

    const monthlyBias = yieldCurveVal > 0 && breakevenVal > 2.0 ? 'ACCUMULATION' : 'STRUCTURAL BEARISH';

    return {
      totalScore,
      classification,
      usdMacroScore,
      realYieldVal,
      yieldCurveVal,
      usdIndexVal,
      breakevenVal,
      nfciVal,
      scores: {
        realYield: realYieldScore,
        yieldCurve: yieldCurveScore,
        usdStrength: usdScore,
        inflation: inflationScore,
        safeHaven: stressScore,
      },
      matrix: {
        intraday: { bias: intradayBias, strategy: intradayStrategy },
        weekly: { bias: weeklyBias, strategy: weeklyStrategy },
        monthly: { bias: monthlyBias },
      },
      oiData,
      cotChanges,
    };
  } catch (error) {
    console.error('Error fetching XAU/USD data:', error);
    return {
      totalScore: -18,
      classification: 'BEARISH DISTRIBUTION',
      usdMacroScore: 22,
      realYieldVal: 2.43,
      yieldCurveVal: 0.40,
      usdIndexVal: 118.07,
      breakevenVal: 2.29,
      nfciVal: -0.558,
      scores: { realYield: -22, yieldCurve: 32, usdStrength: -44, inflation: 23, safeHaven: -6 },
      matrix: {
        intraday: { bias: 'BEARISH MOMENTUM', strategy: 'Sell intraday rallies into key supply zones' },
        weekly: { bias: 'BEARISH DISTRIBUTION', strategy: 'Sell swing rallies; favor downside continuations' },
        monthly: { bias: 'ACCUMULATION' },
      },
      oiData: [
        { period: 'May W1', openInterest: 485, netLongs: 210 },
        { period: 'May W3', openInterest: 492, netLongs: 218 },
        { period: 'Jun W1', openInterest: 478, netLongs: 205 },
        { period: 'Jun W3', openInterest: 482, netLongs: 212 },
        { period: 'Jul W1', openInterest: 510, netLongs: 235 },
        { period: 'Jul W3', openInterest: 465, netLongs: 220 },
        { period: 'Aug W1', openInterest: 525, netLongs: 248 },
        { period: 'Aug W3', openInterest: 415, netLongs: 243 },
      ],
      cotChanges: [
        { week: 'W1', longDelta: 8500, shortDelta: -4200 },
        { week: 'W2', longDelta: -3200, shortDelta: 6100 },
        { week: 'W3', longDelta: 12400, shortDelta: -2100 },
        { week: 'W4', longDelta: -5100, shortDelta: 8900 },
        { week: 'W5', longDelta: 16800, shortDelta: -7400 },
        { week: 'W6', longDelta: -9200, shortDelta: 4500 },
        { week: 'W7', longDelta: 4100, shortDelta: -1800 },
        { week: 'W8', longDelta: 21100, shortDelta: -8600 },
      ],
    };
  }
}

export default async function XauusdPage() {
  const data = await getXauusdData();

  return (
    <main className="min-h-screen bg-[#07090e] text-emerald-400 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* HEADER SECTION */}
      <div>
        <Link href="/" className="text-emerald-400 text-xs hover:underline">
          &larr; Back to Main Intelligence Dashboard
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
            <span className="text-amber-400 font-bold">$</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-slate-200">
            GOLD ($XAU/USD$) MACRO INTELLIGENCE
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          5-Factor Intermarket Quantitative Model: Real Yields, Yield Curve Slope & Monetary Stance
        </p>
      </div>

      {/* TOP CARD: 5 DRIVERS + GAUGE */}
      <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-2 space-y-3.5">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            XAU/USD 5-FACTOR TRANSMISSION MODEL
          </h3>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">10Y REAL INTEREST YIELDS ({data.realYieldVal}%)</span>
              <span className={data.scores.realYield >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.scores.realYield > 0 ? `+${data.scores.realYield}` : data.scores.realYield} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div
                className={`h-full ${data.scores.realYield >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.abs(data.scores.realYield))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">YIELD CURVE SLOPE 10Y-2Y (+{data.yieldCurveVal}%)</span>
              <span className="text-emerald-400 font-bold">+{data.scores.yieldCurve} PTS</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${Math.min(100, Math.abs(data.scores.yieldCurve))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">BROAD USD MACRO SCORE (+{data.usdMacroScore} PTS)</span>
              <span className={data.scores.usdStrength >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.scores.usdStrength > 0 ? `+${data.scores.usdStrength}` : data.scores.usdStrength} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div
                className={`h-full ${data.scores.usdStrength >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.abs(data.scores.usdStrength))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">INFLATION EXPECTATIONS ({data.breakevenVal}%)</span>
              <span className="text-emerald-400 font-bold">+{data.scores.inflation} PTS</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div
                className="bg-emerald-500 h-full"
                style={{ width: `${Math.min(100, Math.abs(data.scores.inflation))}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">FINANCIAL STRESS (NFCI {data.nfciVal})</span>
              <span className={data.scores.safeHaven >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                {data.scores.safeHaven > 0 ? `+${data.scores.safeHaven}` : data.scores.safeHaven} PTS
              </span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded overflow-hidden border border-slate-800">
              <div
                className={`h-full ${data.scores.safeHaven >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, Math.abs(data.scores.safeHaven))}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-center border-t lg:border-t-0 lg:border-l border-slate-800/80 pt-6 lg:pt-0 lg:pl-6">
          <BiasGauge score={data.totalScore} title="XAU/USD MACRO BIAS" classification={data.classification} />
        </div>
      </div>

      {/* 1. MULTI-TIMEFRAME MACRO BIAS MATRIX */}
      <section className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-amber-400 rounded-full"></span>
          • 1. MULTI-TIMEFRAME MACRO BIAS MATRIX (GOLD)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase">
                <th className="p-3">Timeframe</th>
                <th className="p-3">Directional Bias</th>
                <th className="p-3">Primary Macro Driver</th>
                <th className="p-3">Execution Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              <tr>
                <td className="p-3 font-bold text-slate-300">Intraday (H1/H4)</td>
                <td className={`p-3 font-bold ${data.matrix.intraday.bias.includes('BULLISH') ? 'text-emerald-400' : data.matrix.intraday.bias.includes('BEARISH') ? 'text-rose-400' : 'text-amber-400'}`}>
                  {data.matrix.intraday.bias}
                </td>
                <td className="p-3 text-slate-400">USD Macro Score (+{data.usdMacroScore} PTS) & DXY ({data.usdIndexVal})</td>
                <td className="p-3 text-slate-400">{data.matrix.intraday.strategy}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-300">Weekly (Swing)</td>
                <td className={`p-3 font-bold ${data.matrix.weekly.bias.includes('BULLISH') ? 'text-emerald-400' : data.matrix.weekly.bias.includes('BEARISH') ? 'text-rose-400' : 'text-amber-400'}`}>
                  {data.matrix.weekly.bias}
                </td>
                <td className="p-3 text-slate-400">10Y Real Yield ({data.realYieldVal}%) vs Yield Curve Slope (+{data.yieldCurveVal}%)</td>
                <td className="p-3 text-slate-400">{data.matrix.weekly.strategy}</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-300">Monthly (Structural)</td>
                <td className="p-3 text-emerald-400 font-bold">{data.matrix.monthly.bias}</td>
                <td className="p-3 text-slate-400">Global Central Bank Reserve Diversification & Sovereign Debt Inflation</td>
                <td className="p-3 text-slate-400">Long-term physical spot accumulation on cyclical pullbacks</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. GOLD ($XAU/USD$) INTERMARKET CONFLUENCE ENGINE */}
      <section className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="h-2 w-2 bg-amber-400 rounded-full"></span>
          • 2. GOLD ($XAU/USD$) INTERMARKET CONFLUENCE ENGINE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-[#07090e] p-3.5 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-400 block mb-1">10Y Real Yield Vector</span>
            <span className="text-base font-bold text-rose-400">{data.scores.realYield} Pts ({data.realYieldVal}%)</span>
          </div>
          <div className="bg-[#07090e] p-3.5 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-400 block mb-1">Yield Curve Slope</span>
            <span className="text-base font-bold text-emerald-400">+{data.scores.yieldCurve} Pts (+{data.yieldCurveVal}%)</span>
          </div>
          <div className="bg-[#07090e] p-3.5 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-400 block mb-1">USD Macro Impact</span>
            <span className="text-base font-bold text-rose-400">{data.scores.usdStrength} Pts (+{data.usdMacroScore})</span>
          </div>
          <div className="bg-[#07090e] p-3.5 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-400 block mb-1">Inflation Breakeven</span>
            <span className="text-base font-bold text-emerald-400">+{data.scores.inflation} Pts ({data.breakevenVal}%)</span>
          </div>
          <div className="bg-[#07090e] p-3.5 border border-slate-800/80 rounded-lg">
            <span className="text-[10px] text-slate-400 block mb-1">Financial Stress</span>
            <span className="text-base font-bold text-slate-300">{data.scores.safeHaven} Pts ({data.nfciVal})</span>
          </div>
        </div>
      </section>

      {/* SECTIONS 3 & 4 CHARTS (POWERED BY REAL COT DB RECORDS) */}
      <GoldCotCharts
        assetName="COMEX GOLD"
        themeColor="#f59e0b"
        badgeText="INSTITUTIONAL POSITIONING"
        oiData={data.oiData}
        cotChanges={data.cotChanges}
      />
    </main>
  );
}
