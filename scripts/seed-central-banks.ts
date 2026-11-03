import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCentralBanks() {
  console.log('Updating Central Bank Policy Matrix with Q4 2026 schedules...');

  const centralBanks = [
    {
      code: 'USD',
      name: 'Federal Reserve (Fed)',
      rate: '4.75%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-11-05'),
    },
    {
      code: 'EUR',
      name: 'European Central Bank (ECB)',
      rate: '3.25%',
      stance: 'NEUTRAL',
      nextDecision: new Date('2026-10-22'),
    },
    {
      code: 'GBP',
      name: 'Bank of England (BoE)',
      rate: '4.75%',
      stance: 'HAWKISH',
      nextDecision: new Date('2026-11-05'),
    },
    {
      code: 'JPY',
      name: 'Bank of Japan (BoJ)',
      rate: '0.25%',
      stance: 'DOVISH',
      nextDecision: new Date('2026-10-31'),
    },
    {
      code: 'CAD',
      name: 'Bank of Canada (BoC)',
      rate: '3.75%',
      stance: 'NEUTRAL',
      nextDecision: new Date('2026-10-28'),
    },
    {
      code: 'AUD',
      name: 'Reserve Bank of Australia (RBA)',
      rate: '4.35%',
      stance: 'NEUTRAL',
      nextDecision: new Date('2026-11-03'),
    },
    {
      code: 'CHF',
      name: 'Swiss National Bank (SNB)',
      rate: '1.00%',
      stance: 'DOVISH',
      nextDecision: new Date('2026-12-10'),
    },
    {
      code: 'NZD',
      name: 'Reserve Bank of NZ (RBNZ)',
      rate: '4.75%',
      stance: 'DOVISH',
      nextDecision: new Date('2026-11-25'),
    },
  ];

  for (const item of centralBanks) {
    const existing = await prisma.centralBank.findFirst({
      where: { code: item.code },
    });

    if (existing) {
      await prisma.centralBank.update({
        where: { id: existing.id },
        data: {
          rate: item.rate,
          stance: item.stance,
          nextDecision: item.nextDecision,
          name: item.name,
        },
      });
    } else {
      await prisma.centralBank.create({
        data: item,
      });
    }
  }

  console.log('Successfully updated all 8 central bank records.');
  await prisma.$disconnect();
}

seedCentralBanks();
