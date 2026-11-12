import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncCentralBanks() {
  console.log('Syncing Central Bank Policy Matrix (November 2026)...');

  const banks = [
    {
      code: 'FED',
      name: 'Federal Reserve (FOMC)',
      rate: '3.75% - 4.00%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-09T19:00:00Z'),
    },
    {
      code: 'RBA',
      name: 'Reserve Bank of Australia',
      rate: '4.85%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-08T03:30:00Z'),
    },
    {
      code: 'BOE',
      name: 'Bank of England (MPC)',
      rate: '4.00%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-17T12:00:00Z'),
    },
    {
      code: 'ECB',
      name: 'European Central Bank',
      rate: '2.50%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-17T13:15:00Z'),
    },
    {
      code: 'BOC',
      name: 'Bank of Canada',
      rate: '2.50%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-09T14:45:00Z'),
    },
    {
      code: 'BOJ',
      name: 'Bank of Japan',
      rate: '1.25%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-12-18T03:00:00Z'),
    },
    {
      code: 'SNB',
      name: 'Swiss National Bank',
      rate: '0.00%',
      stance: 'NEUTRAL',
      nextDecision: new Date('2026-12-10T08:30:00Z'),
    },
  ];

  for (const b of banks) {
    const existing = await prisma.centralBank.findFirst({
      where: { code: b.code },
    });

    if (existing) {
      await prisma.centralBank.update({
        where: { id: existing.id },
        data: {
          name: b.name,
          rate: b.rate,
          stance: b.stance,
          nextDecision: b.nextDecision,
        },
      });
    } else {
      await prisma.centralBank.create({ data: b });
    }
  }

  console.log('Successfully synced 7 central bank policy records.');
  await prisma.$disconnect();
}

syncCentralBanks().catch(async (err) => {
  console.error('Central Bank sync error:', err);
  await prisma.$disconnect();
});
