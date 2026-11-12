import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function ingestCalendar() {
  console.log(`[${new Date().toISOString()}] Clearing stale calendar events and syncing Nov-Dec 2026 catalysts...`);

  await prisma.calendarEvent.deleteMany({});

  const upcomingEvents = [
    {
      currency: 'USD',
      title: 'U.S. Producer Price Index (PPI MoM - October)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-13T13:30:00Z'),
      affected: 'USD, Gold (XAU), 10Y Treasury Yields, SPX',
      forecast: '0.2%',
      previous: '0.2%',
    },
    {
      currency: 'USD',
      title: 'U.S. Advance Retail Sales MoM (October)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-17T13:30:00Z'),
      affected: 'USD, Gold (XAU), SPX, BTC',
      forecast: '0.3%',
      previous: '0.4%',
    },
    {
      currency: 'GBP',
      title: 'UK Consumer Price Index (CPI YoY - October)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-18T07:00:00Z'),
      affected: 'GBP/USD, EUR/GBP, UK Gilts',
      forecast: '2.6%',
      previous: '2.7%',
    },
    {
      currency: 'USD',
      title: 'FOMC Meeting Minutes (Oct 27-28 Policy Session)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-18T19:00:00Z'),
      affected: 'Global Asset Classes (USD, Yields, Gold, BTC)',
      forecast: 'Hawkish Hold',
      previous: '3.75%-4.00%',
    },
    {
      currency: 'USD',
      title: 'U.S. Core PCE Price Index & Q3 GDP (2nd Est.)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-11-25T13:30:00Z'),
      affected: 'USD, Gold (XAU), Forex Majors, SPX, BTC',
      forecast: '2.7%',
      previous: '2.7%',
    },
    {
      currency: 'USD',
      title: 'U.S. Non-Farm Payrolls (NFP) & Unemployment Rate',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-12-04T13:30:00Z'),
      affected: 'Global Asset Classes (USD, Yields, Gold, SPX)',
      forecast: '155K',
      previous: '148K',
    },
    {
      currency: 'AUD',
      title: 'RBA Interest Rate Decision & Policy Statement',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-12-08T03:30:00Z'),
      affected: 'AUD/USD, AUD/JPY, Commodities',
      forecast: '4.85%',
      previous: '4.85%',
    },
    {
      currency: 'USD',
      title: 'FOMC Federal Reserve Rate Decision & Dot Plot',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-12-09T19:00:00Z'),
      affected: 'Global Asset Classes (USD, Yields, Gold, BTC)',
      forecast: '4.00%',
      previous: '3.75%-4.00%',
    },
    {
      currency: 'USD',
      title: 'U.S. Consumer Price Index (CPI YoY - November)',
      impact: 'HIGH VOLTAGE',
      eventDate: new Date('2026-12-10T13:30:00Z'),
      affected: 'USD, Gold (XAU), Forex Majors, SPX',
      forecast: '2.8%',
      previous: '2.8%',
    },
  ];

  for (const evt of upcomingEvents) {
    await prisma.calendarEvent.create({ data: evt });
  }

  console.log(`Successfully seeded ${upcomingEvents.length} upcoming Nov-Dec 2026 calendar events.`);
}

ingestCalendar()
  .catch((err) => {
    console.error('Calendar ingestion error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
