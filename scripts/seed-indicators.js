const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Starting DB Seed for Macro Intelligence Engine...');

  // 1. Upsert USD currency without invalid fields
  await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {
      region: 'United States',
      centralBank: 'Federal Reserve',
      timezone: 'America/New_York',
    },
    create: {
      code: 'USD',
      name: 'United States Dollar',
      region: 'United States',
      centralBank: 'Federal Reserve',
      timezone: 'America/New_York',
    },
  });

  // 2. Define exact 8 indicators required by config/usdMacroConfig.ts
  const indicators = [
    { code: 'us_gdp', name: 'GDP Growth Momentum', sigma: 0.5, actual: 2.8, forecast: 2.6, weight: 0.15, direction: 'POSITIVE', source: 'BEA', period: 'Q3 2026' },
    { code: 'us_cpi', name: 'Inflation Pressure (CPI)', sigma: 0.3, actual: 2.9, forecast: 2.7, weight: 0.10, direction: 'POSITIVE', source: 'BLS', period: 'AUG 2026' },
    { code: 'us_nfp', name: 'Labor Market Strength (NFP)', sigma: 25.0, actual: 162, forecast: 150, weight: 0.15, direction: 'POSITIVE', source: 'BLS', period: 'AUG 2026' },
    { code: 'us_fed_effr', name: 'Fed Policy Stance (EFFR)', sigma: 0.25, actual: 5.33, forecast: 5.33, weight: 0.20, direction: 'POSITIVE', source: 'Federal Reserve', period: 'CURRENT' },
    { code: 'us_rate_diff_2y', name: '2Y Yield Differential', sigma: 0.2, actual: 1.15, forecast: 1.0, weight: 0.15, direction: 'POSITIVE', source: 'FRED', period: 'DAILY' },
    { code: 'us_real_yield_10y', name: '10Y Real Yield Vector', sigma: 0.15, actual: 2.42, forecast: 2.20, weight: 0.10, direction: 'POSITIVE', source: 'U.S. Treasury', period: 'DAILY' },
    { code: 'us_nfci', name: 'Chicago Fed NFCI', sigma: 0.1, actual: -0.558, forecast: -0.50, weight: 0.05, direction: 'NEGATIVE', source: 'Chicago Fed', period: 'WEEKLY' },
    { code: 'us_dxy_trend', name: 'Market Confirmation (DXY)', sigma: 10.0, actual: 12.5, forecast: 0.0, weight: 0.10, direction: 'POSITIVE', source: 'Market Data', period: 'DAILY' },
  ];

  for (const ind of indicators) {
    // Create or update indicator
    await prisma.indicator.upsert({
      where: { code: ind.code },
      update: {
        historicalSigma: ind.sigma,
        weight: ind.weight,
        direction: ind.direction,
        primarySource: ind.source,
      },
      create: {
        code: ind.code,
        name: ind.name,
        historicalSigma: ind.sigma,
        category: 'MACRO',
        weight: ind.weight,
        direction: ind.direction,
        primarySource: ind.source,
        currency: {
          connect: { code: 'USD' }
        }
      },
    });

    // Create economic release
    await prisma.economicRelease.create({
      data: {
        indicator: {
          connect: { code: ind.code }
        },
        currency: {
          connect: { code: 'USD' }
        },
        actual: ind.actual,
        forecast: ind.forecast,
        previous: ind.forecast,
        period: ind.period,
        source: ind.source,
        releaseDate: new Date(),
        unit: 'PTS',
      },
    });
  }

  console.log('✓ Successfully seeded all 8 macro indicators & economic releases!');
}

seed()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
