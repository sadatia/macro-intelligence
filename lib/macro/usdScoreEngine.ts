import { USD_MACRO_CONFIG } from '@/config/usdMacroConfig';

export interface EconomicDataPoint {
  code: string;
  name: string;
  actual: number | null;
  forecast: number | null;
  previous: number | null;
  releaseDate: Date | string | null;
  unit?: string;
  sigma?: number;
}

export interface FactorScoreResult {
  code: string;
  name: string;
  rawScore: number;          // -100 to +100
  configuredWeight: number;  // Initial %
  activeWeight: number;      // Adjusted %
  contribution: number;      // Points contributed to final
  status: string;
  isAvailable: boolean;
}

export interface EngineCalculationOutput {
  structuralFundamentalScore: number;
  marketConfirmationScore: number;
  finalUsdBiasScore: number;
  classification: string;
  confidenceScore: number;    // 0 to 100%
  confidenceLevel: 'VERY LOW' | 'LOW' | 'MEDIUM' | 'HIGH';
  dataCoveragePercentage: number;
  isDivergent: boolean;
  divergenceNotice?: string;
  factorBreakdown: Record<string, FactorScoreResult>;
  weeklyBias: {
    bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    score: number;
    keyDriver: string;
    riskFactor: string;
  };
  goldImpact: {
    bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
    pressureScore: number;
    reasoning: string;
  };
}

export function calculateUsdEngineScore(releases: EconomicDataPoint[]): EngineCalculationOutput {
  const dataMap = new Map<string, EconomicDataPoint>();
  releases.forEach((r) => dataMap.set(r.code, r));

  const factors = USD_MACRO_CONFIG.factors;
  const factorResults: Record<string, FactorScoreResult> = {};

  let totalAvailableConfiguredWeight = 0;

  // 1. Calculate individual factor raw scores & availability
  Object.keys(factors).forEach((key) => {
    const factorCfg = factors[key as keyof typeof factors];
    const data = dataMap.get(factorCfg.code);

    let rawScore = 0;
    let isAvailable = false;
    let status = 'MISSING DATA';

    if (data && data.actual !== null && data.actual !== undefined) {
      isAvailable = true;
      totalAvailableConfiguredWeight += factorCfg.weight;

      const forecast = data.forecast ?? data.previous ?? data.actual;
      const sigma = data.sigma || factorCfg.defaultSigma || 1.0;
      const surpriseZ = Math.min(3.0, Math.max(-3.0, (data.actual - forecast) / sigma));

      // Calculate score based on normalized surprise and momentum
      rawScore = Math.min(100, Math.max(-100, Math.round(surpriseZ * 33.33)));

      if (rawScore >= 35) status = 'STRONG HAWKISH';
      else if (rawScore >= 15) status = 'HAWKISH';
      else if (rawScore <= -35) status = 'STRONG DOVISH';
      else if (rawScore <= -15) status = 'DOVISH';
      else status = 'NEUTRAL / BALANCED';
    }

    factorResults[key] = {
      code: factorCfg.code,
      name: factorCfg.name,
      rawScore,
      configuredWeight: factorCfg.weight,
      activeWeight: 0,
      contribution: 0,
      status,
      isAvailable,
    };
  });

  // 2. Dynamic Weight Redistribution for missing metrics
  let structuralScore = 0;
  let marketScore = 0;

  Object.keys(factorResults).forEach((key) => {
    const item = factorResults[key];
    if (item.isAvailable && totalAvailableConfiguredWeight > 0) {
      item.activeWeight = parseFloat(((item.configuredWeight / totalAvailableConfiguredWeight) * 100).toFixed(2));
      item.contribution = parseFloat(((item.rawScore * item.activeWeight) / 100).toFixed(2));

      if (key === 'market') {
        marketScore = item.rawScore;
      } else {
        structuralScore += item.contribution;
      }
    }
  });

  structuralScore = Math.min(100, Math.max(-100, Math.round(structuralScore)));

  // 3. Combine Structural (70%) + Market Confirmation (30%)
  const finalUsdBiasScore = Math.min(100, Math.max(-100, Math.round(structuralScore * 0.70 + marketScore * 0.30)));

  // 4. Macro/Market Divergence Detection
  const isDivergent = (structuralScore > 20 && marketScore < -15) || (structuralScore < -20 && marketScore > 15);
  const divergenceNotice = isDivergent
    ? `Macro fundamentals (${structuralScore > 0 ? '+' : ''}${structuralScore}) conflict with market price action (${marketScore > 0 ? '+' : ''}${marketScore}).`
    : undefined;

  // 5. Data Coverage & Confidence Engine
  const dataCoveragePercentage = Math.round((totalAvailableConfiguredWeight / 100) * 100);
  let confidenceScore = Math.round(dataCoveragePercentage * 0.8);
  if (isDivergent) confidenceScore = Math.max(20, confidenceScore - 25);

  let confidenceLevel: 'VERY LOW' | 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (confidenceScore >= 80) confidenceLevel = 'HIGH';
  else if (confidenceScore >= 60) confidenceLevel = 'MEDIUM';
  else if (confidenceScore >= 40) confidenceLevel = 'LOW';
  else confidenceLevel = 'VERY LOW';

  // 6. Classification
  let classification = 'NEUTRAL';
  if (finalUsdBiasScore >= 70) classification = 'STRONG BULLISH';
  else if (finalUsdBiasScore >= 35) classification = 'BULLISH';
  else if (finalUsdBiasScore >= 15) classification = 'MILD BULLISH';
  else if (finalUsdBiasScore <= -70) classification = 'STRONG BEARISH';
  else if (finalUsdBiasScore <= -35) classification = 'BEARISH';
  else if (finalUsdBiasScore <= -15) classification = 'MILD BEARISH';

  // 7. Derived Gold Pressure
  const goldPressureScore = Math.round(-1 * finalUsdBiasScore);
  const goldBias = goldPressureScore >= 20 ? 'BULLISH' : goldPressureScore <= -20 ? 'BEARISH' : 'NEUTRAL';

  return {
    structuralFundamentalScore: structuralScore,
    marketConfirmationScore: marketScore,
    finalUsdBiasScore,
    classification,
    confidenceScore,
    confidenceLevel,
    dataCoveragePercentage,
    isDivergent,
    divergenceNotice,
    factorBreakdown: factorResults,
    weeklyBias: {
      bias: finalUsdBiasScore >= 15 ? 'BULLISH' : finalUsdBiasScore <= -15 ? 'BEARISH' : 'NEUTRAL',
      score: finalUsdBiasScore,
      keyDriver: 'Fed Expectations & Rate Differentials',
      riskFactor: isDivergent ? 'Macro/Market Price Action Divergence' : 'Upcoming CPI/FOMC Volatility',
    },
    goldImpact: {
      bias: goldBias,
      pressureScore: goldPressureScore,
      reasoning: `USD final score (${finalUsdBiasScore}) creates inverse monetary pressure on Gold ($XAU).`,
    },
  };
}

export function runMacroDiagnostics(): boolean {
  console.log('[DIAGNOSTICS] Starting USD Quantitative Macro Diagnostics...');
  const mockReleases: EconomicDataPoint[] = [
    { code: 'us_gdp', name: 'GDP YoY', actual: 2.8, forecast: 2.6, previous: 2.5, releaseDate: new Date() },
    { code: 'us_cpi', name: 'CPI YoY', actual: 2.9, forecast: 2.9, previous: 3.0, releaseDate: new Date() },
    { code: 'us_nfp', name: 'NFP Jobs', actual: 162, forecast: 150, previous: 140, releaseDate: new Date() },
    { code: 'us_fed_effr', name: 'EFFR Rate', actual: 5.33, forecast: 5.33, previous: 5.33, releaseDate: new Date() },
    { code: 'us_rate_diff_2y', name: 'Yield Diff', actual: 1.15, forecast: 1.10, previous: 1.05, releaseDate: new Date() },
    { code: 'us_real_yield_10y', name: 'Real Yield', actual: 2.10, forecast: 2.05, previous: 2.00, releaseDate: new Date() },
    { code: 'us_nfci', name: 'NFCI Stress', actual: -0.52, forecast: -0.50, previous: -0.48, releaseDate: new Date() },
    { code: 'us_dxy_trend', name: 'DXY Trend', actual: -15, forecast: 0, previous: 5, releaseDate: new Date() },
  ];

  const result = calculateUsdEngineScore(mockReleases);
  const isValid =
    !isNaN(result.finalUsdBiasScore) &&
    result.finalUsdBiasScore >= -100 &&
    result.finalUsdBiasScore <= 100 &&
    result.dataCoveragePercentage === 100;

  console.log(`[DIAGNOSTICS] Verification Complete. Result: ${isValid ? 'PASS' : 'FAIL'}`);
  return isValid;
}
