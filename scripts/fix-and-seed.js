const { PrismaClient, IndicatorDirection } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('--- STARTING COMPLIANT DATABASE SEEDING ---');
  console.log('Detected IndicatorDirection Enum values:', IndicatorDirection);

  // Determine available enum keys (fallback to first available enum value if POSITIVE/BULLISH isn't exact)
  const posVal = IndicatorDirection?.POSITIVE || IndicatorDirection?.BULLISH || IndicatorDirection?.DIRECT || Object.values(IndicatorDirection || {})[0];
  const negVal = IndicatorDirection?.NEGATIVE || IndicatorDirection?.BEARISH || IndicatorDirection?.INVERSE || Object.values(IndicatorDirection || {})[0];

  // 1. Ensure USD Currency Record
  let usd;
  try {
    usd = await prisma.currency.upsert({
      where: { code: 'USD' },
      update: { region: 'United States', centralBank: 'Federal Reserve', timezone: 'America/New_York' },
      create: { code: 'USD', name: 'United States Dollar', region: 'United States', centralBank: 'Federal Reserve', timezone: 'America/New_York' },
    });
  } catch (err) {
    usd = await prisma.currency.findFirst({ where: { code: 'USD' } });
  }

  // 2. Clear old test releases
  await prisma.economicRelease.deleteMany({}).catch(() => {});

  // 3. Define the 8 exact factors required by config/usdMacroConfig.ts
  const factors = [
    { code: 'us_gdp', name: 'GDP Growth Momentum', sigma: 0.5, actual: 2.8, forecast: 2.6, weight: 15, direction: posVal, source: 'BEA', period: 'Q3 2026' },
    { code: 'us_cpi', name: 'Inflation Pressure (CPI)', sigma: 0.3, actual: 2.9, forecast: 2.7, weight: 10, direction: posVal, source: 'BLS', period: 'AUG 2026' },
    { code: 'us_nfp', name: 'Labor Market Strength (NFP)', sigma: 25.0, actual: 162, forecast: 150, weight: 15, direction: posVal, source: 'BLS', period: 'AUG 2026' },
    { code: 'us_fed_effr', name: 'Fed Policy Stance (EFFR)', sigma: 0.25, actual: 5.33, forecast: 5.33, weight: 20, direction: posVal, source: 'Federal Reserve', period: 'CURRENT' },
    { code: 'us_rate_diff_2y', name: '2Y Yield Differential', sigma: 0.2, actual: 1.15, forecast: 1.0, weight: 15, direction: posVal, source: 'FRED', period: 'DAILY' },
    { code: 'us_real_yield_10y', name: '10Y Real Yield Vector', sigma: 0.15, actual: 2.42, forecast: 2.20, weight: 10, direction: posVal, source: 'U.S. Treasury', period: 'DAILY' },
    { code: 'us_nfci', name: 'Chicago Fed NFCI', sigma: 0.1, actual: -0.558, forecast: -0.50, weight: 5, direction: negVal, source: 'Chicago Fed', period: 'WEEKLY' },
    { code: 'us_dxy_trend', name: 'Market Confirmation (DXY)', sigma: 10.0, actual: 12.5, forecast: 0.0, weight: 10, direction: posVal, source: 'Market Data', period: 'DAILY' }
  ];

  for (const item of factors) {
    const indicator = await prisma.indicator.upsert({
      where: { code: item.code },
      update: { historicalSigma: item.sigma, weight: item.weight, direction: item.direction, primarySource: item.source },
      create: {
        code: item.code,
        name: item.name,
        historicalSigma: item.sigma,
        category: 'MACRO',
        weight: item.weight,
        direction: item.direction,
        primarySource: item.source,
        currency: { connect: { code: 'USD' } }
      }
    });

    await prisma.economicRelease.create({
      data: {
        actual: item.actual,
        forecast: item.forecast,
        previous: item.forecast,
        period: item.period,
        source: item.source,
        unit: 'PTS',
        releaseDate: new Date(),
        indicator: { connect: { id: indicator.id } },
        currency: { connect: { code: 'USD' } }
      }
    });

    console.log(`✓ Synchronized indicator: ${item.code}`);
  }

  console.log('--- ALL 8 MACRO INDICATORS SEEDED SUCCESSFULLY ---');
}

run()
  .catch((err) => {
    console.error('Fatal Seed Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
