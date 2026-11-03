import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTrumpComments() {
  console.log('Seeding Policy Statements for Trump Tracker...');

  const records = [
    {
      category: 'TRADE & TARIFFS',
      statement: 'Reciprocal 10% universal tariffs on foreign imports & 60% tariff levies targeted at Chinese trade flows.',
      usdImpact: 35,
      xauImpact: 45,
      btcImpact: -10,
      transmission: 'Drives inflation expectations higher, keeping bond yields elevated & fueling stagflation gold demand.',
    },
    {
      category: 'MONETARY POLICY',
      statement: 'Direct jawboning for lower Federal Reserve interest rates & demanding presidential oversight on rate decisions.',
      usdImpact: -40,
      xauImpact: 50,
      btcImpact: 35,
      transmission: 'Erodes currency yield differentials while boosting non-yielding store-of-value assets and crypto liquidity.',
    },
    {
      category: 'DIGITAL ASSETS',
      statement: 'Proposal for U.S. Strategic Bitcoin Reserve and appointing crypto-friendly regulators to SEC & CFTC.',
      usdImpact: -15,
      xauImpact: 20,
      btcImpact: 85,
      transmission: 'Eliminates regulatory overhang and creates direct sovereign demand vectors for Bitcoin.',
    },
    {
      category: 'FISCAL DEFICIT',
      statement: 'Extension of 2017 Tax Cuts and Jobs Act (TCJA) combined with deregulation executive orders.',
      usdImpact: 20,
      xauImpact: 35,
      btcImpact: 25,
      transmission: 'Expands U.S. national debt issuance while spurring domestic corporate growth & liquidity sentiment.',
    },
  ];

  for (const item of records) {
    await prisma.trumpComment.create({
      data: item,
    });
  }

  console.log(`Successfully inserted ${records.length} policy statements.`);
  await prisma.$disconnect();
}

seedTrumpComments();
