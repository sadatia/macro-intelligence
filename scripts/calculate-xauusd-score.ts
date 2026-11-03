import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function calculateXauusdScore() {
  console.log(`[${new Date().toISOString()}] Calculating 5-Factor XAU/USD Macro Score...`);

  try {
    const realYield = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_real_yield_10y' } },
      orderBy: { releaseDate: 'desc' },
    });
    const yieldCurve = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_yield_curve' } },
      orderBy: { releaseDate: 'desc' },
    });
    const breakeven = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_10y_breakeven' } },
      orderBy: { releaseDate: 'desc' },
    });
    const nfci = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_chicago_nfci' } },
      orderBy: { releaseDate: 'desc' },
    });
    const usdRecord = await prisma.currencyMacroScore.findFirst({
      where: { currencyCode: 'USD' },
      orderBy: { createdAt: 'desc' },
    });

    const ry = realYield?.actual ?? 2.42;
    const yc = yieldCurve?.actual ?? 0.41;
    const be = breakeven?.actual ?? 2.29;
    const stress = nfci?.actual ?? -0.558;
    const usd = usdRecord?.totalScore ?? 22;

    const realYieldScore = Math.min(100, Math.max(-100, Math.round((2.0 - ry) * 50)));
    const yieldCurveScore = Math.min(100, Math.max(-100, Math.round(yc * 80)));
    const usdScore = Math.min(100, Math.max(-100, Math.round(-usd * 2)));
    const inflationScore = Math.min(100, Math.max(-100, Math.round((be - 2.0) * 80)));
    const stressScore = Math.min(100, Math.max(-100, Math.round((stress + 0.5) * 100)));

    const finalScore = Math.round(
      realYieldScore * 0.30 +
      yieldCurveScore * 0.20 +
      usdScore * 0.20 +
      inflationScore * 0.15 +
      stressScore * 0.15
    );

    let classification = 'NEUTRAL';
    if (finalScore >= 25) classification = 'BULLISH ACCUMULATION';
    else if (finalScore <= -25) classification = 'BEARISH DISTRIBUTION';

    console.log(`[XAU/USD Engine Output] Score: ${finalScore} (${classification})`);
    console.log(`Factors -> RealYield: ${realYieldScore}, CurveSlope: ${yieldCurveScore}, USD: ${usdScore}, Inflation: ${inflationScore}, Stress: ${stressScore}`);

  } catch (err) {
    console.error('Error calculating XAU/USD macro score:', err);
  } finally {
    await prisma.$disconnect();
  }
}

calculateXauusdScore();
