import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const FRED_API_KEY = process.env.FRED_API_KEY;

// Mapping central banks to official FRED Policy Rate Series IDs & Scheduled 2026/2027 Meetings
const CENTRAL_BANK_CONFIG: Record<
  string,
  { name: string; fredSeries: string; defaultRate: string; stance: string; schedule: string[] }
> = {
  USD: {
    name: 'Federal Reserve (Fed)',
    fredSeries: 'DFEDTARU', // Fed Funds Target Range Upper Limit
    defaultRate: '4.75%',
    stance: 'HAWKISH',
    schedule: ['2026-11-05', '2026-12-17', '2027-01-28', '2027-03-18'],
  },
  EUR: {
    name: 'European Central Bank (ECB)',
    fredSeries: 'ECBDFR', // ECB Deposit Facility Rate
    defaultRate: '3.25%',
    stance: 'NEUTRAL',
    schedule: ['2026-10-22', '2026-12-10', '2027-01-21', '2027-03-11'],
  },
  GBP: {
    name: 'Bank of England (BoE)',
    fredSeries: 'BOERATE', // UK Base Rate
    defaultRate: '4.75%',
    stance: 'HAWKISH',
    schedule: ['2026-11-05', '2026-12-17', '2027-02-04', '2027-03-18'],
  },
  JPY: {
    name: 'Bank of Japan (BoJ)',
    fredSeries: 'INTDSRJPM193N', // Japan Discount/Policy Rate
    defaultRate: '0.25%',
    stance: 'DOVISH',
    schedule: ['2026-10-31', '2026-12-18', '2027-01-22', '2027-03-19'],
  },
  CAD: {
    name: 'Bank of Canada (BoC)',
    fredSeries: 'INTDSRCAM193N',
    defaultRate: '3.75%',
    stance: 'NEUTRAL',
    schedule: ['2026-10-28', '2026-12-09', '2027-01-27', '2027-03-10'],
  },
  AUD: {
    name: 'Reserve Bank of Australia (RBA)',
    fredSeries: 'INTDSRAUM193N',
    defaultRate: '4.35%',
    stance: 'NEUTRAL',
    schedule: ['2026-11-03', '2026-12-08', '2027-02-02', '2027-03-16'],
  },
  CHF: {
    name: 'Swiss National Bank (SNB)',
    fredSeries: 'INTDSRCHM193N',
    defaultRate: '1.00%',
    stance: 'DOVISH',
    schedule: ['2026-12-10', '2027-03-18', '2027-06-17', '2027-09-23'],
  },
  NZD: {
    name: 'Reserve Bank of NZ (RBNZ)',
    fredSeries: 'INTDSRNZM193N',
    defaultRate: '4.75%',
    stance: 'DOVISH',
    schedule: ['2026-11-25', '2027-02-17', '2027-04-14', '2027-05-26'],
  },
};

async function fetchFredLatestValue(seriesId: string): Promise<string | null> {
  if (!FRED_API_KEY) return null;
  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&limit=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.observations && data.observations.length > 0) {
      const val = parseFloat(data.observations[0].value);
      if (!isNaN(val)) return `${val.toFixed(2)}%`;
    }
    return null;
  } catch (err) {
    return null;
  }
}

function getNextDecisionDate(schedule: string[]): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (const dateStr of schedule) {
    const meetingDate = new Date(dateStr);
    if (meetingDate >= today) {
      return meetingDate;
    }
  }
  // Default to 30 days out if schedule exhausted
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
}

async function ingestCentralBanks() {
  console.log(`[${new Date().toISOString()}] Ingesting Central Bank Policy Rates & Schedules...`);

  for (const [code, cfg] of Object.entries(CENTRAL_BANK_CONFIG)) {
    const liveRate = await fetchFredLatestValue(cfg.fredSeries);
    const rateToUse = liveRate || cfg.defaultRate;
    const nextDecision = getNextDecisionDate(cfg.schedule);

    const existing = await prisma.centralBank.findFirst({
      where: { code },
    });

    if (existing) {
      await prisma.centralBank.update({
        where: { id: existing.id },
        data: {
          rate: rateToUse,
          nextDecision,
          stance: cfg.stance,
          name: cfg.name,
        },
      });
    } else {
      await prisma.centralBank.create({
        data: {
          code,
          name: cfg.name,
          rate: rateToUse,
          stance: cfg.stance,
          nextDecision,
        },
      });
    }
  }

  console.log('[Central Banks Success] Policy rates and next meeting schedules updated.');
}

ingestCentralBanks()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error ingesting central bank data:', e);
    await prisma.$disconnect();
  });
