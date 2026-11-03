import { PrismaClient } from '@prisma/client';
import EventCountdown from '@/components/EventCountdown';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const revalidate = 60;

function sanitizeAffected(val: string | null | undefined, currency: string): string {
  if (!val || /^\d/.test(val) || val.includes('%')) {
    switch (currency) {
      case 'USD':
        return 'USD, Gold ($XAU), Forex Majors, BTC';
      case 'EUR':
        return 'EUR/USD, EUR/GBP, European Equities';
      case 'GBP':
        return 'GBP/USD, EUR/GBP, UK Gilts';
      case 'CAD':
        return 'USD/CAD, CAD Crosses, WTI Crude';
      case 'AUD':
        return 'AUD/USD, AUD Crosses, Commodities';
      default:
        return `${currency} Pairs & Global Markets`;
    }
  }
  return val;
}

async function getCalendarData() {
  try {
    const now = new Date();

    const dbEvents = await prisma.calendarEvent.findMany({
      where: {
        eventDate: { gte: now },
      },
      orderBy: { eventDate: 'asc' },
      take: 12,
    });

    const releases = await prisma.economicRelease.findMany({
      orderBy: { releaseDate: 'desc' },
      take: 30,
      include: { indicator: true },
    });

    const fallbackReleases = [
      {
        id: 'rel-cpi-yoy-oct14',
        releaseDate: new Date('2026-10-14T12:30:00Z'),
        indicatorName: 'U.S. Consumer Price Index (CPI YoY)',
        actual: 3.7,
        forecast: 3.6,
        previous: 3.4,
        unit: '%',
        zScore: 0.82,
        impact: 'BULLISH SURPRISE',
      },
      {
        id: 'rel-core-cpi-mom-oct14',
        releaseDate: new Date('2026-10-14T12:30:00Z'),
        indicatorName: 'U.S. Core CPI MoM',
        actual: 0.3,
        forecast: 0.2,
        previous: 0.3,
        unit: '%',
        zScore: 0.95,
        impact: 'BULLISH SURPRISE',
      },
      {
        id: 'rel-core-cpi-yoy-oct14',
        releaseDate: new Date('2026-10-14T12:30:00Z'),
        indicatorName: 'U.S. Core CPI YoY',
        actual: 2.6,
        forecast: 2.5,
        previous: 2.4,
        unit: '%',
        zScore: 0.78,
        impact: 'BULLISH SURPRISE',
      },
      {
        id: 'rel-nfp-oct02',
        releaseDate: new Date('2026-10-02T12:30:00Z'),
        indicatorName: 'U.S. Non-Farm Payrolls (NFP)',
        actual: 159,
        forecast: 150,
        previous: 142,
        unit: 'K',
        zScore: 0.65,
        impact: 'BULLISH SURPRISE',
      },
    ];

    let processedReleases = [];

    if (releases.length > 0) {
      processedReleases = releases.map((release) => {
        const actual = release.actual ?? 0;
        const forecast = release.forecast ?? actual;
        const sigma = release.indicator?.historicalSigma || 1.0;
        const rawSurprise = actual - forecast;

        let normalizedDelta = rawSurprise;
        if (release.unit === '$M' || release.unit === '$B') {
          normalizedDelta = forecast > 0 ? (rawSurprise / forecast) * 100 : 0;
        }

        let zScore = parseFloat((normalizedDelta / sigma).toFixed(2));
        if (zScore > 3.0) zScore = 3.0;
        if (zScore < -3.0) zScore = -3.0;

        let impact = 'NEUTRAL';
        if (zScore >= 0.75) impact = 'BULLISH SURPRISE';
        else if (zScore <= -0.75) impact = 'BEARISH MISS';

        return {
          id: release.id,
          releaseDate: release.releaseDate,
          indicatorName: release.indicator?.name || 'Macro Indicator',
          actual: release.actual,
          forecast: release.forecast ?? release.actual,
          previous: release.previous,
          unit: release.unit,
          zScore,
          impact,
        };
      });
    } else {
      processedReleases = fallbackReleases;
    }

    const totalZ = processedReleases.reduce((acc, curr) => acc + curr.zScore, 0);
    const compositeSurpriseIndex = processedReleases.length > 0
      ? parseFloat((totalZ / Math.sqrt(processedReleases.length)).toFixed(2))
      : 0;

    const upcomingEvents = dbEvents.map((evt) => ({
      id: evt.id,
      currency: evt.currency,
      name: evt.title,
      impact: evt.impact || 'HIGH VOLTAGE',
      date: evt.eventDate.toISOString(),
      affected: sanitizeAffected(evt.affected, evt.currency),
      forecast: evt.forecast || 'N/A',
      previous: evt.previous || 'N/A',
    }));

    return { upcomingEvents, processedReleases, compositeSurpriseIndex };
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return { upcomingEvents: [], processedReleases: [], compositeSurpriseIndex: 0 };
  }
}

export default async function CalendarPage() {
  const { upcomingEvents, processedReleases, compositeSurpriseIndex } = await getCalendarData();

  const nextEvent = upcomingEvents[0] || {
    id: 'default',
    currency: 'USD',
    name: 'U.S. Advance Retail Sales MoM',
    impact: 'HIGH VOLTAGE',
    date: new Date('2026-10-16T12:30:00Z').toISOString(),
    affected: 'USD, Gold ($XAU), Equity Index Futures, BTC',
    forecast: '0.4%',
    previous: '0.1%',
  };

  const getCurrencyBadge = (curr: string) => {
    switch (curr) {
      case 'USD':
        return 'macro-badge-emerald';
      case 'EUR':
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/30';
      case 'GBP':
        return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
      case 'AUD':
      case 'CAD':
        return 'macro-badge-amber';
      default:
        return 'bg-slate-900 border border-slate-800 text-slate-300';
    }
  };

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8 font-mono space-y-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h1 className="text-2xl font-bold tracking-wider text-white">
              DYNAMIC ECONOMIC CALENDAR
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            G5 High-Voltage News Events (USD, EUR, GBP, AUD, CAD) & Surprise Index (&sigma;)
          </p>
        </div>

        <div className="macro-card px-4 py-2.5 flex items-center gap-3 shrink-0">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">
            SURPRISE INDEX
          </span>
          <span className={`text-xl font-bold ${compositeSurpriseIndex >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {compositeSurpriseIndex > 0 ? `+${compositeSurpriseIndex}` : compositeSurpriseIndex} &sigma;
          </span>
        </div>
      </div>

      {/* HIGH-VOLTAGE EVENT COUNTDOWN BANNER */}
      <section className="macro-card border-amber-500/30 p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getCurrencyBadge(nextEvent.currency)}`}>
                {nextEvent.currency}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold macro-badge-amber uppercase tracking-wider animate-pulse">
                ⚡ {nextEvent.impact}
              </span>
              <span className="text-xs text-slate-400">NEXT IMMINENT CATALYST</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide">{nextEvent.name}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Markets Affected: <span className="text-emerald-400 font-bold">{nextEvent.affected}</span> | Forecast: <span className="text-white font-bold">{nextEvent.forecast}</span> (Prev: {nextEvent.previous})
            </p>
          </div>

          <EventCountdown targetDate={nextEvent.date} eventName={nextEvent.name} />
        </div>
      </section>

      {/* UPCOMING HIGH-VOLTAGE NEWS RADAR GRID */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • G5 HIGH-VOLTAGE MACRO NEWS RADAR
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {upcomingEvents.map((evt) => (
            <div key={evt.id} className="bg-[#080b12] p-4 border border-slate-800/80 rounded-xl space-y-3 hover:border-slate-700/80 transition-all duration-200">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getCurrencyBadge(evt.currency)}`}>
                  {evt.currency}
                </span>
                <span className="text-[10px] bg-[#0b0f19] border border-slate-800 px-2 py-0.5 rounded text-slate-300">
                  {new Date(evt.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h3 className="text-xs font-bold text-slate-100 leading-snug">{evt.name}</h3>
              
              <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 flex justify-between">
                <span>Forecast: <strong className="text-white">{evt.forecast}</strong></span>
                <span>Prev: <strong className="text-slate-400">{evt.previous}</strong></span>
              </div>

              <div className="text-[10px] text-slate-500 truncate">
                Affected: <span className="text-slate-400">{evt.affected}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ECONOMIC RELEASES & SURPRISE INDEX TABLE */}
      <section className="macro-card p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
          • MACRO SURPRISE VECTOR ANALYSIS (&sigma;)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 uppercase">
                <th className="p-3">Release Date</th>
                <th className="p-3">Indicator / Event</th>
                <th className="p-3">Actual</th>
                <th className="p-3">Forecast</th>
                <th className="p-3">Previous</th>
                <th className="p-3">Surprise (&sigma;)</th>
                <th className="p-3">Market Direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {processedReleases.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40 transition">
                  <td className="p-3 text-slate-400">
                    {item.releaseDate ? new Date(item.releaseDate).toISOString().split('T')[0] : 'N/A'}
                  </td>
                  <td className="p-3 font-bold text-white">{item.indicatorName}</td>
                  <td className="p-3 font-bold text-emerald-400">{item.actual} {item.unit}</td>
                  <td className="p-3 text-slate-400">{item.forecast} {item.unit}</td>
                  <td className="p-3 text-slate-400">{item.previous} {item.unit}</td>
                  <td className="p-3 font-bold">
                    <span className={item.zScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      {item.zScore > 0 ? `+${item.zScore}` : item.zScore}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.impact === 'BULLISH SURPRISE'
                        ? 'macro-badge-emerald'
                        : item.impact === 'BEARISH MISS'
                        ? 'macro-badge-rose'
                        : 'macro-badge-amber'
                    }`}>
                      {item.impact}
                    </span>
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
