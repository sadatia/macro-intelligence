import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================================================
// QUANTITATIVE FACTOR WEIGHT DISTRIBUTION (SUM = 1.00 / 100%)
// ============================================================================
const WEIGHTS = {
  gdpGrowth: 0.20,          // GDP Growth Momentum (20%)
  realYield: 0.15,          // 10Y Real Yield Vector (15%)
  cpiInflation: 0.15,       // Inflation Pressure / CPI (15%)
  laborMarket: 0.15,        // Labor Market Strength / NFP (15%)
  fedPolicy: 0.10,          // Fed Policy & SOFR Expectations (10%)
  yieldDifferentials: 0.10, // Yield Rate Spreads 10Y-2Y (10%)
  creditStress: 0.10,       // Credit Stress & High-Yield NFCI (10%)
  dxyConfirmation: 0.05,    // Market Confirmation / REER Index (5%)
};

async function calculateMacroScore() {
  console.log(`[${new Date().toISOString()}] Recalculating Quantitative 8-Factor USD Macro Score...`);

  // Fetch recent economic indicator releases
  const releases = await prisma.economicRelease.findMany({
    orderBy: { releaseDate: 'desc' },
    include: { indicator: true },
  });

  const getLatestActual = (code: string, fallback: number): number => {
    const found = releases.find((r) => r.indicator?.code === code);
    return found?.actual ?? fallback;
  };

  // 1. Raw Indicator Ingestion
  const gdpVal = getLatestActual('us_gdp_quarterly', 32563);
  const cpiVal = getLatestActual('us_cpi_index', 334.13);
  const nfpVal = getLatestActual('us_nfp_employment', 159044);
  const realYieldVal = getLatestActual('us_real_yield_10y', 2.63);
  const yieldSpreadVal = getLatestActual('us_yield_spread_10y2y', 0.44);
  const sofrVal = getLatestActual('us_sofr_rate', 3.87);
  const nfciVal = getLatestActual('us_nfci_index', -0.494);
  const reerVal = getLatestActual('us_broad_reer', 121.38);

  // 2. Factor Score Calculations (-100 to +100 Scale)
  const scoreGdp = Math.min(100, Math.max(-100, Math.round(((gdpVal - 32000) / 1000) * 100)));
  const scoreCpi = Math.min(100, Math.max(-100, Math.round((cpiVal - 330) * 20)));
  const scoreLabor = Math.min(100, Math.max(-100, Math.round(((nfpVal - 150000) / 20000) * 50)));
  const scoreRealYield = Math.min(100, Math.max(-100, Math.round((realYieldVal - 2.0) * 60)));
  const scoreYieldSpread = Math.min(100, Math.max(-100, Math.round(yieldSpreadVal * 100)));
  const scoreFedPolicy = Math.min(100, Math.max(-100, Math.round((sofrVal - 3.5) * 40)));
  const scoreCreditStress = Math.min(100, Math.max(-100, Math.round((-nfciVal) * 100)));
  const scoreDxy = Math.min(100, Math.max(-100, Math.round((reerVal - 118) * 25)));

  // 3. Weighted Score Aggregation
  const weightedTotal = Math.round(
    scoreGdp * WEIGHTS.gdpGrowth +
    scoreRealYield * WEIGHTS.realYield +
    scoreCpi * WEIGHTS.cpiInflation +
    scoreLabor * WEIGHTS.laborMarket +
    scoreFedPolicy * WEIGHTS.fedPolicy +
    scoreYieldSpread * WEIGHTS.yieldDifferentials +
    scoreCreditStress * WEIGHTS.creditStress +
    scoreDxy * WEIGHTS.dxyConfirmation
  );

  const finalScore = Math.min(100, Math.max(-100, weightedTotal));

  let stance = 'NEUTRAL';
  if (finalScore >= 20) stance = 'HAWKISH BULLISH';
  else if (finalScore <= -20) stance = 'DOVISH BEARISH';

  console.log(`[USD Engine Output] Score: ${finalScore >= 0 ? '+' : ''}${finalScore} PTS (${stance})`);

  // 4. Save to PostgreSQL Database
  await prisma.currencyMacroScore.create({
    data: {
      currencyCode: 'USD',
      totalScore: finalScore,
    } as any,
  });

  console.log('Successfully saved updated CurrencyMacroScore record to database.');
}

calculateMacroScore()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('Error calculating macro score:', e);
    await prisma.$disconnect();
  });
