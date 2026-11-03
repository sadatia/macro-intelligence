import { PrismaClient, IndicatorDirection } from '@prisma/client';

const prisma = new PrismaClient();

const allIndicators = [
  // Core Macro Baseline
  { code: 'us_nfp', name: 'Non-Farm Payrolls', category: 'Labor', weight: 0.10, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 50.0 },
  { code: 'us_cpi', name: 'Consumer Price Index MoM', category: 'Inflation', weight: 0.10, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 0.10 },
  { code: 'us_gdp', name: 'Gross Domestic Product', category: 'Growth', weight: 0.10, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 0.50 },
  { code: 'us_retail_sales', name: 'Advance Retail Sales', category: 'Growth', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 0.50 },
  { code: 'us_unemployment', name: 'Unemployment Rate', category: 'Labor', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.LOWER_IS_BULLISH, historicalSigma: 0.10 },
  { code: 'us_real_yield_10y', name: '10-Year Real Interest Rate', category: 'Rates', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 0.10 },
  { code: 'us_yield_curve', name: '10Y-2Y Yield Spread', category: 'Rates', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 0.10 },
  { code: 'us_sofr', name: 'SOFR Rate Benchmark', category: 'Rates', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 0.05 },
  { code: 'us_credit_spread', name: 'US High Yield Spread', category: 'Market', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.LOWER_IS_BULLISH, historicalSigma: 0.20 },
  { code: 'us_wti_oil', name: 'WTI Crude Oil', category: 'Inflation', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 2.00 },

  // Institutional Matrix Expansion Series
  { code: 'us_2y_yield', name: 'US 2-Year Treasury Yield', category: 'Rates', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 0.15 },
  { code: 'us_10y_breakeven', name: 'US 10-Year Breakeven Inflation Rate', category: 'Inflation', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.HAWKISH_IS_BULLISH, historicalSigma: 0.10 },
  { code: 'us_reverse_repo', name: 'Fed Overnight Reverse Repo Facility', category: 'Liquidity', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.LOWER_IS_BULLISH, historicalSigma: 10.0 },
  { code: 'us_fed_assets', name: 'Fed Total Assets Balance Sheet', category: 'Liquidity', weight: 0.05, primarySource: 'FRED', direction: IndicatorDirection.LOWER_IS_BULLISH, historicalSigma: 15000.0 },
  { code: 'us_chicago_nfci', name: 'Chicago Fed Financial Conditions Index', category: 'Market', weight: 0.025, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 0.05 },
  { code: 'us_broad_usd_index', name: 'Trade-Weighted Broad Dollar Index', category: 'Market', weight: 0.025, primarySource: 'FRED', direction: IndicatorDirection.HIGHER_IS_BULLISH, historicalSigma: 0.50 },
];

async function seedAllIndicators() {
  console.log('Seeding full 16-indicator USD matrix into PostgreSQL...');

  let usdCurrency = await prisma.currency.findUnique({ where: { code: 'USD' } });

  if (!usdCurrency) {
    usdCurrency = await prisma.currency.create({
      data: {
        code: 'USD',
        name: 'United States Dollar',
        region: 'US',
        centralBank: 'Federal Reserve',
        timezone: 'America/New_York',
      },
    });
  }

  for (const ind of allIndicators) {
    await prisma.indicator.upsert({
      where: { code: ind.code },
      update: {
        name: ind.name,
        category: ind.category,
        weight: ind.weight,
        primarySource: ind.primarySource,
        direction: ind.direction,
        historicalSigma: ind.historicalSigma,
        currencyCode: 'USD',
      },
      create: {
        code: ind.code,
        name: ind.name,
        category: ind.category,
        weight: ind.weight,
        primarySource: ind.primarySource,
        direction: ind.direction,
        historicalSigma: ind.historicalSigma,
        currencyCode: 'USD',
      },
    });
    console.log(`[Seed] Registered: ${ind.name} (${ind.code})`);
  }

  console.log('Successfully registered all 16 indicators in PostgreSQL!');
}

seedAllIndicators()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
