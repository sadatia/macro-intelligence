import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import BiasGauge from '@/components/BiasGauge';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 300; // Revalidate every 5 minutes

async function getTrumpTrackerData() {
  const defaultComments = [
    {
      id: 'tc-1',
      category: 'TRADE & TARIFFS',
      statement: 'Universal 10-20% baseline tariffs on foreign imports & 60% reciprocal tariff levies on Chinese trade flows.',
      usdImpact: 35,
      xauImpact: 45,
      btcImpact: -10,
      transmission: 'Drives inflation expectations higher, keeping bond yields elevated & fueling stagflation hedge gold demand.',
    },
    {
      id: 'tc-2',
      category: 'MONETARY POLICY',
      statement: 'Direct presidential jawboning for aggressive Federal Reserve rate cuts & questioning central bank independence.',
      usdImpact: -40,
      xauImpact: 50,
      btcImpact: 35,
      transmission: 'Erodes USD yield buffer while accelerating non-yielding store-of-value assets and crypto liquidity.',
    },
    {
      id: 'tc-3',
      category: 'DIGITAL ASSETS',
      statement: 'Executive proposal for U.S. Strategic Bitcoin Reserve & appointing crypto-friendly SEC and CFTC leadership.',
      usdImpact: -15,
      xauImpact: 20,
      btcImpact: 85,
      transmission: 'Eliminates regulatory friction and creates direct sovereign treasury accumulation vectors for Bitcoin.',
    },
  ];

  try {
    const comments = await prisma.trumpComment.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const activeList = comments.length > 0 ? comments : defaultComments;

    const totalUsd = activeList.reduce((acc, curr) => acc + curr.usdImpact, 0);
    const totalXau = activeList.reduce((acc, curr) => acc + curr.xauImpact, 0);
    const totalBtc = activeList.reduce((acc, curr) => acc + curr.btcImpact, 0);

    const usdScore = Math.round(totalUsd / activeList.length);
    const xauScore = Math.round(totalXau / activeList.length);
    const btcScore = Math.round(totalBtc / activeList.length);

    return {
      usdScore,
      xauScore,
      btcScore,
      comments: activeList,
    };
  } catch (error) {
    console.error('Error fetching Trump Tracker data:', error);
    return {
      usdScore: 10,
      xauScore: 38,
      btcScore: 37,
      comments: defaultComments,
    };
  }
}

export default async function TrumpTrackerPage() {
  const data = await getTrumpTrackerData();

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h1 className="text-2xl font-bold tracking-wider text-white uppercase">
              TRUMP POLICY & SENTIMENT TRACKER
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Quantitative Transmission Channels: Tariff Levies, Monetary Pressure, Fiscal Policy & Asset Impulse Gauges
          </p>
        </div>

        <div className="macro-card px-4 py-2.5 flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">POLICY IMPULSE</span>
          <span className="text-xs font-bold text-amber-400 macro-badge-amber px-2 py-0.5 rounded animate-pulse">
            HIGH VOLATILITY CATALYST
          </span>
        </div>
      </div>

      {/* THREE ASSET IMPULSE GAUGES */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-amber-400 rounded-full"></span>
          • POLICY SENTIMENT GAUGES (USD / GOLD / BTC)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="flex justify-center border border-slate-800/80 rounded-xl p-4 bg-[#080b12]">
            <BiasGauge
              score={data.usdScore}
              title="US DOLLAR INDEX (USD)"
              classification={data.usdScore >= 0 ? 'TARIFF HAWKISH' : 'DOVISH JAWBONING'}
            />
          </div>

          <div className="flex justify-center border border-slate-800/80 rounded-xl p-4 bg-[#080b12]">
            <BiasGauge
              score={data.xauScore}
              title="GOLD ($XAU/$)"
              classification={data.xauScore >= 0 ? 'DEBASEMENT HEDGE' : 'REAL YIELD HEADWIND'}
            />
          </div>

          <div className="flex justify-center border border-slate-800/80 rounded-xl p-4 bg-[#080b12]">
            <BiasGauge
              score={data.btcScore}
              title="BITCOIN ($BTC/$)"
              classification={data.btcScore >= 0 ? 'STRATEGIC RESERVE' : 'LIQUIDITY CONSTRAINED'}
            />
          </div>
        </div>
      </section>

      {/* POLICY STATEMENTS & ASSET TRANSMISSION LOG TABLE */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • POLICY STATEMENTS & ASSET TRANSMISSION LOG
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase">
                <th className="p-3 w-1/6">Category</th>
                <th className="p-3 w-2/6">Policy Statement / Executive Order</th>
                <th className="p-3 text-center">USD</th>
                <th className="p-3 text-center">Gold</th>
                <th className="p-3 text-center">BTC</th>
                <th className="p-3 w-2/6">Primary Transmission Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {data.comments.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 font-bold text-amber-400 tracking-wider">
                    <span className="px-2 py-0.5 rounded bg-[#080b12] border border-amber-500/30 text-amber-400">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200 leading-snug">
                    {item.statement}
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className={item.usdImpact >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.usdImpact > 0 ? `+${item.usdImpact}` : item.usdImpact} PTS
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className={item.xauImpact >= 0 ? 'text-amber-400' : 'text-rose-400'}>
                      {item.xauImpact > 0 ? `+${item.xauImpact}` : item.xauImpact} PTS
                    </span>
                  </td>
                  <td className="p-3 text-center font-bold">
                    <span className={item.btcImpact >= 0 ? 'text-sky-400' : 'text-rose-400'}>
                      {item.btcImpact > 0 ? `+${item.btcImpact}` : item.btcImpact} PTS
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 text-[11px] leading-snug">
                    {item.transmission}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
