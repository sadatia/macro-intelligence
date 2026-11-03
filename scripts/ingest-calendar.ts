import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ingestCalendar() {
  console.log(`[${new Date().toISOString()}] Clearing stale calendar events and syncing upcoming catalysts...`);

  // 1. Clear stale upcoming event queue
  await prisma.calendarEvent.deleteMany({});

  // 2. Schedule actual upcoming Q4 2026 events (CPI from Oct 14 is already published)
  const upcomingEvents = [
    {
      currency: 'USD',
      title: 'U.S. Advance Retail Sales MoM',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-10-16T12:30:00Z'),
      affected: 'USD, Gold ($XAU), Equity Index Futures, BTC',
      forecast: '0.4%',
      previous: '0.1%',
    },
    {
      currency: 'EUR',
      title: 'ECB Interest Rate Decision & Policy Statement',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-10-22T12:15:00Z'),
      affected: 'EUR/USD, EUR/GBP, European Sovereign Bonds',
      forecast: '3.25%',
      previous: '3.50%',
    },
    {
      currency: 'CAD',
      title: 'Bank of Canada Rate Decision & Monetary Report',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-10-28T13:45:00Z'),
      affected: 'USD/CAD, CAD Crosses, WTI Crude',
      forecast: '3.75%',
      previous: '4.25%',
    },
    {
      currency: 'USD',
      title: 'FOMC Federal Reserve Policy Rate Statement',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-05T19:00:00Z'),
      affected: 'Global Asset Classes (USD, Yields, Gold, BTC)',
      forecast: '4.75%',
      previous: '5.00%',
    },
    {
      currency: 'USD',
      title: 'U.S. Consumer Price Index (October Data Release)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-10T13:30:00Z'),
      affected: 'USD, Gold ($XAU), Forex Majors, BTC',
      forecast: '3.6%',
      previous: '3.7%',
    },
  ];

  for (const evt of upcomingEvents) {
    await prisma.calendarEvent.create({
      data: evt,
    });
  }

  console.log('[Calendar Sync Success] Calendar queue updated with clean upcoming catalysts.');
}

ingestCalendar()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error syncing calendar:', e);
    await prisma.$disconnect();
  });
