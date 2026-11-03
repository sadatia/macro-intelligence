import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function FomcRegimePage() {
  const [releases, latestScore] = await Promise.all([
    prisma.economicRelease.findMany({
      orderBy: { releaseDate: 'desc' },
      take: 15,
      include: { indicator: true },
    }),
    prisma.currencyMacroScore.findFirst({
      where: { currencyCode: 'USD' },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const growthScore = latestScore?.growthScore ?? 68;
  const inflationScore = latestScore?.inflationScore ?? 74;

  // 4-Quadrant Classification Matrix
  const isGrowthAccelerating = growthScore >= 50;
  const isInflationAccelerating = inflationScore >= 50;

  let currentQuadrant = '';
  let quadrantDescription = '';
  let assetImpact = '';

  if (isGrowthAccelerating && isInflationAccelerating) {
    currentQuadrant = 'QUAD 2: INFLATIONARY EXPANSION';
    quadrantDescription = 'Growth Accelerating + Inflation Accelerating';
    assetImpact = 'USD Bullish | Rates High | Bearish XAU Headwind';
  } else if (isGrowthAccelerating && !isInflationAccelerating) {
    currentQuadrant = 'QUAD 1: GOLDILOCKS / NON-INFLATIONARY GROWTH';
    quadrantDescription = 'Growth Accelerating + Inflation Disinflating';
    assetImpact = 'Equities Outperform | USD Neutral | Moderate XAU';
  } else if (!isGrowthAccelerating && isInflationAccelerating) {
    currentQuadrant = 'QUAD 3: STAGFLATION';
    quadrantDescription = 'Growth Decelerating + Inflation Accelerating';
    assetImpact = 'Highly Bullish XAU & Commodities | Equities Underperform';
  } else {
    currentQuadrant = 'QUAD 4: DEFLATIONARY CONTRACTION';
    quadrantDescription = 'Growth Decelerating + Inflation Disinflating';
    assetImpact = 'Dovish Fed | Rate Cuts | Bullish Bonds & Safe-Haven XAU';
  }

  // Dynamic FedWatch Implied Probabilities (derived from total score)
  const usdScore = latestScore?.totalScore ?? 70;
  const pauseProb = usdScore >= 65 ? 58 : usdScore >= 50 ? 42 : 25;
  const hikeProb = usdScore >= 70 ? 38 : 10;
  const cutProb = Math.max(0, 100 - pauseProb - hikeProb);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <Link href="/" className="text-emerald-400 text-xs font-mono hover:underline block mb-2">
          &larr; Back to Main Intelligence Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-100 font-mono">FOMC FEDWATCH & MACRO REGIME</h1>
        <p className="text-sm text-slate-400 mt-1">
          Target Rate Decision Probabilities & 4-Quadrant Macro Economic Cycle Classifier
        </p>
      </div>

      {/* 1. FEDWATCH FOMC RATE PROBABILITY GAUGE */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg font-bold text-sky-400 font-mono">FEDWATCH FOMC RATE PROBABILITY GAUGE</h2>
            <p className="text-xs text-slate-400">Target Rate Decision Outlook for Upcoming FOMC Meeting</p>
          </div>
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-3 py-1 rounded-md border border-slate-700">
            Implied Rate Horizon: 3.50% - 3.75%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Pause / Unchanged</span>
            <div className="text-3xl font-mono font-bold text-emerald-400">{pauseProb}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${pauseProb}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Baseline scenario driven by sticky core inflation observations.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">25 bps Rate Cut</span>
            <div className="text-3xl font-mono font-bold text-sky-400">{cutProb}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-sky-400 h-full" style={{ width: `${cutProb}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Requires labor market cooling in upcoming NFP releases.</p>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono uppercase block mb-1">25 bps Rate Hike</span>
            <div className="text-3xl font-mono font-bold text-rose-400">{hikeProb}%</div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-rose-400 h-full" style={{ width: `${hikeProb}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">Hawkish pressure driven by labor tightness & real yield firming.</p>
          </div>
        </div>
      </section>

      {/* 2. MACRO REGIME CLASSIFIER (4-QUADRANT MODEL) */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-lg font-bold text-amber-400 font-mono">MACRO REGIME CLASSIFIER (4-QUADRANT MODEL)</h2>
          <p className="text-xs text-slate-400">Classifying Macroeconomic Cycle via Growth vs. Inflation Acceleration Vector</p>
        </div>

        {/* Current Active Quadrant Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-mono text-amber-400 uppercase font-bold tracking-wider block">CURRENT ACTIVE REGIME</span>
            <h3 className="text-xl font-bold font-mono text-slate-100">{currentQuadrant}</h3>
            <p className="text-xs text-slate-300 mt-1">{quadrantDescription} &bull; <span className="text-amber-400 font-bold">{assetImpact}</span></p>
          </div>
          <div className="text-left md:text-right shrink-0">
            <span className="text-xs font-mono text-slate-400 block">Growth Score: <span className="text-white font-bold">{growthScore}/100</span></span>
            <span className="text-xs font-mono text-slate-400 block">Inflation Score: <span className="text-white font-bold">{inflationScore}/100</span></span>
          </div>
        </div>

        {/* 4-Quadrant Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className={`p-5 rounded-xl border ${growthScore >= 50 && inflationScore < 50 ? 'border-emerald-400 bg-emerald-500/10' : 'border-slate-800 bg-slate-950/50 opacity-60'}`}>
            <span className="text-slate-400 font-bold block mb-1">QUAD 1: GOLDILOCKS</span>
            <p className="text-emerald-400 font-bold mb-2">Growth Acceleration | Inflation Disinflation</p>
            <p className="text-slate-300 text-[11px]">Equities bullish, USD neutral, Yields stable. Risk assets outperform.</p>
          </div>

          <div className={`p-5 rounded-xl border ${growthScore >= 50 && inflationScore >= 50 ? 'border-amber-400 bg-amber-500/10' : 'border-slate-800 bg-slate-950/50 opacity-60'}`}>
            <span className="text-slate-400 font-bold block mb-1">QUAD 2: INFLATIONARY EXPANSION</span>
            <p className="text-amber-400 font-bold mb-2">Growth Acceleration | Inflation Acceleration</p>
            <p className="text-slate-300 text-[11px]">USD Bullish, Fed Hawkish, Real yields firm, Bearish XAU headwinds.</p>
          </div>

          <div className={`p-5 rounded-xl border ${growthScore < 50 && inflationScore >= 50 ? 'border-rose-400 bg-rose-500/10' : 'border-slate-800 bg-slate-950/50 opacity-60'}`}>
            <span className="text-slate-400 font-bold block mb-1">QUAD 3: STAGFLATION</span>
            <p className="text-rose-400 font-bold mb-2">Growth Deceleration | Inflation Acceleration</p>
            <p className="text-slate-300 text-[11px]">Highly Bullish Gold & Commodities, Equities drop, USD volatile.</p>
          </div>

          <div className={`p-5 rounded-xl border ${growthScore < 50 && inflationScore < 50 ? 'border-sky-400 bg-sky-500/10' : 'border-slate-800 bg-slate-950/50 opacity-60'}`}>
            <span className="text-slate-400 font-bold block mb-1">QUAD 4: DEFLATIONARY CONTRACTION</span>
            <p className="text-sky-400 font-bold mb-2">Growth Deceleration | Inflation Disinflation</p>
            <p className="text-slate-300 text-[11px]">Fed Dovish, Rate cuts, Yields drop, Bullish Bonds & Safe-Haven Gold.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
