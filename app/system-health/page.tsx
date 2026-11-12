import { PrismaClient } from '@prisma/client';
import { ProviderHealthStatus, ProviderItem } from '@/components/ProviderHealthStatus';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
globalForPrisma.prisma = prisma;

export const revalidate = 60;

function formatRelativeTime(dateVal: Date | null | undefined): string {
  if (!dateVal) return 'No records';
  const diffMs = Date.now() - new Date(dateVal).getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ${mins % 60}m ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default async function SystemHealthPage() {
  const t0 = Date.now();

  const [
    releaseCount,
    latestRelease,
    cotCount,
    latestCot,
    scoreCount,
    latestScore,
    bankCount,
    latestBank,
    calendarCount,
    nextEvent,
    trumpCount,
    latestTrump,
  ] = await Promise.all([
    prisma.economicRelease.count(),
    prisma.economicRelease.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.cotPosition.count(),
    prisma.cotPosition.findFirst({ orderBy: { reportDate: 'desc' } }),
    prisma.currencyMacroScore.count(),
    prisma.currencyMacroScore.findFirst({ orderBy: { createdAt: 'desc' } }),
    prisma.centralBank.count(),
    prisma.centralBank.findFirst({ orderBy: { updatedAt: 'desc' } }),
    prisma.calendarEvent.count({ where: { eventDate: { gte: new Date() } } }),
    prisma.calendarEvent.findFirst({
      where: { eventDate: { gte: new Date() } },
      orderBy: { eventDate: 'asc' },
    }),
    prisma.trumpComment.count(),
    prisma.trumpComment.findFirst({ orderBy: { publishedAt: 'desc' } }),
  ]);

  const dbLatencyMs = Math.max(1, Date.now() - t0);

  const providers: ProviderItem[] = [
    {
      name: 'St. Louis Fed (FRED API)',
      sourceType: '15m Cron Ingestion',
      status: releaseCount > 0 ? 'ONLINE' : 'OFFLINE',
      latencyMs: dbLatencyMs,
      lastSync: formatRelativeTime(latestRelease?.createdAt),
      recordsIngested: releaseCount,
    },
    {
      name: 'CFTC Commitments of Traders (COT)',
      sourceType: '52-Week Futures Feed',
      status: cotCount > 0 ? 'ONLINE' : 'OFFLINE',
      latencyMs: dbLatencyMs,
      lastSync: latestCot?.reportDate
        ? `Report ${new Date(latestCot.reportDate).toISOString().split('T')[0]}`
        : 'No records',
      recordsIngested: cotCount,
    },
    {
      name: '8-Factor USD Scoring Engine',
      sourceType: 'Quantitative Pipeline',
      status: scoreCount > 0 ? 'ONLINE' : 'OFFLINE',
      latencyMs: dbLatencyMs,
      lastSync: formatRelativeTime(latestScore?.createdAt),
      recordsIngested: scoreCount,
    },
    {
      name: 'G7 Central Bank Policy Matrix',
      sourceType: 'Policy Rate Sync',
      status: bankCount >= 6 ? 'ONLINE' : 'WARNING',
      latencyMs: dbLatencyMs,
      lastSync: formatRelativeTime(latestBank?.updatedAt),
      recordsIngested: bankCount,
    },
    {
      name: 'G5 High-Voltage Event Radar',
      sourceType: 'Forward Catalyst Queue',
      status: calendarCount > 0 ? 'ONLINE' : 'WARNING',
      latencyMs: dbLatencyMs,
      lastSync: nextEvent
        ? `Next: ${new Date(nextEvent.eventDate).toISOString().split('T')[0]}`
        : 'Queue empty',
      recordsIngested: calendarCount,
    },
    {
      name: 'Executive Policy & Tariff Tracker',
      sourceType: 'Hourly Cron Upsert',
      status: trumpCount > 0 ? 'ONLINE' : 'OFFLINE',
      latencyMs: dbLatencyMs,
      lastSync: formatRelativeTime(latestTrump?.publishedAt),
      recordsIngested: trumpCount,
    },
  ];

  return (
    <main className="min-h-screen bg-[#06080d] text-slate-100 p-6 md:p-8">
      <ProviderHealthStatus providers={providers} dbLatencyMs={dbLatencyMs} />
    </main>
  );
}
