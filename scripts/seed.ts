import { PrismaClient, IndicatorDirection } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Seeding USD Currency and Macro Indicator definitions...');

  // 1. Seed Base USD Currency
  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'US Dollar',
      region: 'North America',
      centralBank: 'Federal Reserve',
      timezone: 'America/New_York',
    },
  });

  console.log(`Base Currency initialized: ${usd.code}`);

  // 2. Define Macro Indicators
  const indicators = [
    {
      code: 'us_nfp',
      name: 'U.S. Non-Farm Payrolls',
      category: 'Labor',
      weight: 0.20,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/PAYEMS',
      historicalSigma: 25.0,
    },
    {
      code: 'us_cpi',
      name: 'U.S. Consumer Price Index (CPI)',
      category: 'Inflation',
      weight: 0.25,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/CPIAUCSL',
      historicalSigma: 0.2,
    },
    {
      code: 'us_gdp',
      name: 'U.S. Gross Domestic Product',
      category: 'Growth',
      weight: 0.25,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/GDP',
      historicalSigma: 0.5,
    },
    {
      code: 'us_retail_sales',
      name: 'U.S. Advance Retail Sales',
      category: 'Activity',
      weight: 0.10,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/RSXFS',
      historicalSigma: 0.4,
    },
    {
      code: 'us_unemployment',
      name: 'U.S. Unemployment Rate',
      category: 'Labor',
      weight: 0.15,
      direction: IndicatorDirection.LOWER_IS_BULLISH,
      primarySource: 'FRED/UNRATE',
      historicalSigma: 0.2,
    },
    {
      code: 'us_real_yield_10y',
      name: '10-Year Treasury Real Yield',
      category: 'Policy',
      weight: 0.35,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/DFII10',
      historicalSigma: 0.15,
    },
    {
      code: 'us_yield_curve',
      name: '10Y-2Y Treasury Yield Spread',
      category: 'Policy',
      weight: 0.20,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/T10Y2Y',
      historicalSigma: 0.10,
    },
    {
      code: 'us_sofr',
      name: 'Secured Overnight Financing Rate',
      category: 'Policy',
      weight: 0.10,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/SOFR',
      historicalSigma: 0.05,
    },
    {
      code: 'us_credit_spread',
      name: 'BofA US High Yield Option-Adjusted Spread',
      category: 'Activity',
      weight: 0.15,
      direction: IndicatorDirection.LOWER_IS_BULLISH,
      primarySource: 'FRED/BAMLH0A0HYM2',
      historicalSigma: 0.25,
    },
    {
      code: 'us_wti_oil',
      name: 'Crude Oil Spot Price (WTI)',
      category: 'Inflation',
      weight: 0.10,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/DCOILWTICO',
      historicalSigma: 3.5,
    },
    {
      code: 'us_2y_yield',
      name: '2-Year Treasury Constant Maturity Rate',
      category: 'Policy',
      weight: 0.15,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/DGS2',
      historicalSigma: 0.12,
    },
    {
      code: 'us_10y_breakeven',
      name: '10-Year Breakeven Inflation Rate',
      category: 'Inflation',
      weight: 0.15,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/T10YIEM',
      historicalSigma: 0.10,
    },
    {
      code: 'us_reverse_repo',
      name: 'Overnight Reverse Repurchase Agreements',
      category: 'Activity',
      weight: 0.10,
      direction: IndicatorDirection.LOWER_IS_BULLISH,
      primarySource: 'FRED/RRPONTSYD',
      historicalSigma: 25.0,
    },
    {
      code: 'us_fed_assets',
      name: 'Federal Reserve Total Assets',
      category: 'Policy',
      weight: 0.15,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/WALCL',
      historicalSigma: 15000.0,
    },
    {
      code: 'us_chicago_nfci',
      name: 'Chicago Fed National Financial Conditions Index',
      category: 'Activity',
      weight: 0.15,
      direction: IndicatorDirection.LOWER_IS_BULLISH,
      primarySource: 'FRED/NFCI',
      historicalSigma: 0.10,
    },
    {
      code: 'us_broad_usd_index',
      name: 'Broad Real Effective Exchange Rate for United States',
      category: 'Activity',
      weight: 0.20,
      direction: IndicatorDirection.HIGHER_IS_BULLISH,
      primarySource: 'FRED/DTWEXBGS',
      historicalSigma: 1.2,
    },
  ];

  for (const ind of indicators) {
    await prisma.indicator.upsert({
      where: { code: ind.code },
      update: {
        name: ind.name,
        category: ind.category,
        weight: ind.weight,
        direction: ind.direction,
        primarySource: ind.primarySource,
        historicalSigma: ind.historicalSigma,
      },
      create: {
        code: ind.code,
        currencyCode: 'USD',
        name: ind.name,
        category: ind.category,
        weight: ind.weight,
        direction: ind.direction,
        primarySource: ind.primarySource,
        historicalSigma: ind.historicalSigma,
      },
    });
  }

  console.log(`Successfully seeded ${indicators.length} macro indicators.`);
  await prisma.$disconnect();
}

seedDatabase().catch((e) => {
  console.error('Seed error:', e);
  process.exit(1);
});
