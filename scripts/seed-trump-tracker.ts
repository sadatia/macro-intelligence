import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTrumpTracker() {
  console.log('Seeding Trump Policy & Sentiment Tracker data...');

  const comments = [
    {
      category: 'TRADE & TARIFFS',
      statement: 'Universal 10-20% baseline tariffs on foreign imports & 60% reciprocal tariff levies on Chinese trade flows.',
      usdImpact: 35,
      xauImpact: 45,
      btcImpact: -10,
      transmission: 'Drives inflation expectations higher, keeping bond yields elevated & fueling stagflation hedge gold demand.',
    },
    {
      category: 'MONETARY POLICY',
      statement: 'Direct presidential jawboning for aggressive Federal Reserve rate cuts & questioning central bank independence.',
      usdImpact: -40,
      xauImpact: 50,
      btcImpact: 35,
      transmission: 'Erodes USD yield buffer while accelerating non-yielding store-of-value assets and crypto liquidity.',
    },
    {
      category: 'DIGITAL ASSETS',
      statement: 'Executive proposal for U.S. Strategic Bitcoin Reserve & appointing crypto-friendly SEC and CFTC leadership.',
      usdImpact: -15,
      xauImpact: 20,
      btcImpact: 85,
      transmission: 'Eliminates regulatory friction and creates direct sovereign treasury accumulation vectors for Bitcoin.',
    },
    {
      category: 'ENERGY DOMINANCE',
      statement: 'Fast-tracking domestic oil/gas leases & rolling back green energy subsidies (Drill Baby Drill policy).',
      usdImpact: 20,
      xauImpact: -25,
      btcImpact: 15,
      transmission: 'Dampens headline energy CPI while lowering operational power costs for U.S. industrial and BTC mining infrastructure.',
    },
    {
      category: 'FISCAL DEBASEMENT',
      statement: 'Extension of 2017 Tax Cuts & Jobs Act alongside lowering corporate tax rates to 15% for domestic producers.',
      usdImpact: -25,
      xauImpact: 40,
      btcImpact: 30,
      transmission: 'Expands federal fiscal deficit, accelerating long-term debt monetization and hard-asset capital reallocation.',
    },
  ];

  for (const item of comments) {
    const existing = await prisma.trumpComment.findFirst({
      where: { statement: item.statement },
    });

    if (!existing) {
      await prisma.trumpComment.create({
        data: item,
      });
    }
  }

  console.log('Successfully updated Trump Policy Tracker database entries.');
  await prisma.$disconnect();
}

seedTrumpTracker().catch(async (err) => {
  console.error('Seeding error:', err);
  await prisma.$disconnect();
});
