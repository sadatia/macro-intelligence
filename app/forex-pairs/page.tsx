import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 300;

async function getLiveRates() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch live rates from Frankfurter API:', error);
    return null;
  }
}

async function getForexCurrencyScores() {
  let dynamicUsdScore = 22;

  try {
    const latestScoreRecord = await prisma.currencyMacroScore.findFirst({
      where: { currencyCode: 'USD' },
      orderBy: { createdAt: 'desc' },
    });

    if (latestScoreRecord?.totalScore !== undefined) {
      dynamicUsdScore = Math.round(latestScoreRecord.totalScore);
    } else {
      const realYield = await prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_real_yield_10y' } },
        orderBy: { releaseDate: 'desc' },
      });
      const ryVal = realYield?.actual ?? 2.42;
      dynamicUsdScore = Math.min(100, Math.max(-100, Math.round(ryVal * 10 + 5)));
    }
  } catch (err) {
    console.error('Error fetching USD score record:', err);
  }

  const liveRatesData = await getLiveRates();
  const rates = liveRatesData?.rates ?? {};

  const currencies = [
    { code: 'USD', name: 'US Dollar', score: dynamicUsdScore, stance: 'HAWKISH HOLD', yield10y: '4.34%', driver: 'Strong Growth & Policy Stance' },
    { code: 'EUR', name: 'Euro', score: -20, stance: 'NEUTRAL / CUTS', yield10y: '2.25%', driver: 'Stagnant Manufacturing & ECB Rate Cuts' },
    { code: 'GBP', name: 'British Pound', score: 15, stance: 'BALANCED', yield10y: '3.95%', driver: 'Sticky Services Inflation' },
    { code: 'JPY', name: 'Japanese Yen', score: -65, stance: 'SLIGHT HAWKISH', yield10y: '0.92%', driver: 'Wide Yield Differentials & BOJ Inertia' },
    { code: 'AUD', name: 'Australian Dollar', score: 10, stance: 'NEUTRAL', yield10y: '4.10%', driver: 'China Headwinds vs Local Inflation' },
    { code: 'CAD', name: 'Canadian Dollar', score: -15, stance: 'DOVISH CUTS', yield10y: '3.15%', driver: 'Oil Price Neutrality & BOC Rate Cuts' },
    { code: 'CHF', name: 'Swiss Franc', score: -30, stance: 'DOVISH', yield10y: '0.45%', driver: 'SNB Rate Cuts & Safe-Haven Outflows' },
  ];

  const sortedCurrencies = [...currencies].sort((a, b) => b.score - a.score);
  const strongest = sortedCurrencies.slice(0, 3);
  const weakest = sortedCurrencies.slice(-3).reverse();

  const getSpotRate = (pair: string) => {
    if (!rates || Object.keys(rates).length === 0) return 'N/A';
    if (pair === 'EUR/USD') return rates.EUR ? (1 / rates.EUR).toFixed(4) : 'N/A';
    if (pair === 'GBP/USD') return rates.GBP ? (1 / rates.GBP).toFixed(4) : 'N/A';
    if (pair === 'USD/JPY') return rates.JPY ? rates.JPY.toFixed(2) : 'N/A';
    if (pair === 'AUD/USD') return rates.AUD ? (1 / rates.AUD).toFixed(4) : 'N/A';
    if (pair === 'USD/CAD') return rates.CAD ? rates.CAD.toFixed(4) : 'N/A';
    if (pair === 'USD/CHF') return rates.CHF ? rates.CHF.toFixed(4) : 'N/A';
    if (pair === 'EUR/GBP') return rates.EUR && rates.GBP ? (rates.GBP / rates.EUR).toFixed(4) : 'N/A';
    if (pair === 'GBP/JPY') return rates.GBP && rates.JPY ? (rates.JPY / rates.GBP).toFixed(2) : 'N/A';
    return 'N/A';
  };

  const getBiasLabel = (diff: number) => {
    if (diff >= 40) return 'STRONG BULLISH';
    if (diff >= 15) return 'BULLISH';
    if (diff <= -40) return 'STRONG BEARISH';
    if (diff <= -15) return 'BEARISH';
    return 'NEUTRAL';
  };

  const pairs = [
    { pair: 'EUR/USD', netScore: -20 - dynamicUsdScore, spot: getSpotRate('EUR/USD'), strategy: 'Sell rallies into H1/H4 supply zones' },
    { pair: 'GBP/USD', netScore: 15 - dynamicUsdScore, spot: getSpotRate('GBP/USD'), strategy: 'Look for short continuation setups' },
    { pair: 'USD/JPY', netScore: dynamicUsdScore - (-65), spot: getSpotRate('USD/JPY'), strategy: 'Buy pullbacks into 10Y yield support' },
    { pair: 'AUD/USD', netScore: 10 - dynamicUsdScore, spot: getSpotRate('AUD/USD'), strategy: 'Sell key structural resistance' },
    { pair: 'USD/CAD', netScore: dynamicUsdScore - (-15), spot: getSpotRate('USD/CAD'), strategy: 'Hold long positions above swing lows' },
    { pair: 'USD/CHF', netScore: dynamicUsdScore - (-30), spot: getSpotRate('USD/CHF'), strategy: 'Buy dips aligned with yield differential' },
    { pair: 'EUR/GBP', netScore: -20 - 15, spot: getSpotRate('EUR/GBP'), strategy: 'Fade breakout attempts into resistance' },
    { pair: 'GBP/JPY', netScore: 15 - (-65), spot: getSpotRate('GBP/JPY'), strategy: 'Buy dips; yield differential tailwind' },
  ].map((p) => ({ ...p, bias: getBiasLabel(p.netScore) }));

  return { currencies: sortedCurrencies, strongest, weakest, pairs };
}

export default async function ForexPage() {
  const data = await getForexCurrencyScores();

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* SECTION HEADER */}
      <div className="border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <span className="text-emerald-400 font-bold">$</span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider text-white">
            MAJOR FOREX CURRENCY MATRIX
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Relative Currency Strength Heatmap, Yield Differentials & Daily High-Confluence Pairings
        </p>
      </div>

      {/* DAILY STRONGEST VS WEAKEST BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="macro-card border-emerald-500/30 p-5 space-y-3">
          <h2 className="text-xs font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
            <span>▲</span> DAILY STRONGEST CURRENCIES (BUY BIAS)
          </h2>
          <div className="space-y-2">
            {data.strongest.map((c) => (
              <div key={c.code} className="flex justify-between items-center p-2.5 bg-[#080b12] border border-slate-800/80 rounded-lg text-xs">
                <div>
                  <span className="font-bold text-white text-sm mr-2">{c.code}</span>
                  <span className="text-slate-400">({c.name})</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-bold block">+{c.score} PTS</span>
                  <span className="text-[10px] text-slate-500">{c.stance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="macro-card border-rose-500/30 p-5 space-y-3">
          <h2 className="text-xs font-bold text-rose-400 tracking-wider uppercase flex items-center gap-2">
            <span>▼</span> DAILY WEAKEST CURRENCIES (SELL BIAS)
          </h2>
          <div className="space-y-2">
            {data.weakest.map((c) => (
              <div key={c.code} className="flex justify-between items-center p-2.5 bg-[#080b12] border border-slate-800/80 rounded-lg text-xs">
                <div>
                  <span className="font-bold text-white text-sm mr-2">{c.code}</span>
                  <span className="text-slate-400">({c.name})</span>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-bold block">{c.score} PTS</span>
                  <span className="text-[10px] text-slate-500">{c.stance}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CURRENCY STRENGTH SCOREBOARD TABLE */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • 1. RELATIVE CURRENCY STRENGTH SCOREBOARD
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase">
                <th className="p-3">Currency</th>
                <th className="p-3">Macro Score</th>
                <th className="p-3">Central Bank Stance</th>
                <th className="p-3">10Y Sovereign Yield</th>
                <th className="p-3">Primary Fundamental Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {data.currencies.map((c) => (
                <tr key={c.code} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#080b12] border border-slate-800 text-emerald-400">
                      {c.code}
                    </span>
                    <span>{c.name}</span>
                  </td>
                  <td className="p-3 font-bold">
                    <span className={c.score > 0 ? 'text-emerald-400' : c.score < 0 ? 'text-rose-400' : 'text-amber-400'}>
                      {c.score > 0 ? `+${c.score}` : c.score} PTS
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{c.stance}</td>
                  <td className="p-3 text-white font-bold">{c.yield10y}</td>
                  <td className="p-3 text-slate-400">{c.driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* MAJOR FOREX PAIRS DIRECTIONAL PERMITS */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • 2. MAJOR FOREX PAIRS DIRECTIONAL PERMITS & STRATEGY
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase">
                <th className="p-3">Pair</th>
                <th className="p-3">Live Spot Rate</th>
                <th className="p-3">Net Score Differential</th>
                <th className="p-3">Directional Bias</th>
                <th className="p-3">Execution Strategy (Layer 3)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {data.pairs.map((p) => (
                <tr key={p.pair} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-bold text-white">{p.pair}</td>
                  <td className="p-3 font-bold text-sky-400">{p.spot}</td>
                  <td className="p-3 font-bold">
                    <span className={p.netScore > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {p.netScore > 0 ? `+${p.netScore}` : p.netScore} PTS
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    <span className={p.bias.includes('BULLISH') ? 'text-emerald-400' : p.bias.includes('BEARISH') ? 'text-rose-400' : 'text-amber-400'}>
                      {p.bias}
                    </span>
                  </td>
                  <td className="p-3 text-slate-300">{p.strategy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
