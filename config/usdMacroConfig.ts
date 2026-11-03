export interface MacroFactorConfig {
  code: string;
  name: string;
  weight: number; // Configured weight in percentage (sum = 100)
  defaultSigma: number;
}

export const USD_MACRO_CONFIG = {
  factors: {
    growth: {
      code: 'us_gdp',
      name: 'GDP Growth Momentum',
      weight: 15,
      defaultSigma: 0.5,
    },
    inflation: {
      code: 'us_cpi',
      name: 'Inflation Pressure (CPI)',
      weight: 10,
      defaultSigma: 0.3,
    },
    labor: {
      code: 'us_nfp',
      name: 'Labor Market Strength',
      weight: 15,
      defaultSigma: 25.0,
    },
    fedPolicy: {
      code: 'us_fed_effr',
      name: 'Fed Policy & Expectations',
      weight: 20,
      defaultSigma: 0.25,
    },
    rateDiff: {
      code: 'us_rate_diff_2y',
      name: 'Yield Rate Differentials',
      weight: 15,
      defaultSigma: 0.2,
    },
    realYields: {
      code: 'us_real_yield_10y',
      name: '10Y Real Yield Vector',
      weight: 10,
      defaultSigma: 0.15,
    },
    riskCredit: {
      code: 'us_nfci',
      name: 'Credit Stress & Risk Regime',
      weight: 5,
      defaultSigma: 0.1,
    },
    market: {
      code: 'us_dxy_trend',
      name: 'Market Confirmation (DXY)',
      weight: 10,
      defaultSigma: 10.0,
    },
  } as Record<string, MacroFactorConfig>,
  classifications: {
    STRONG_BULLISH: { min: 70, max: 100, label: 'STRONG BULLISH' },
    BULLISH: { min: 35, max: 69, label: 'BULLISH' },
    MILD_BULLISH: { min: 15, max: 34, label: 'MILD BULLISH' },
    NEUTRAL: { min: -14, max: 14, label: 'NEUTRAL' },
    MILD_BEARISH: { min: -34, max: -15, label: 'MILD BEARISH' },
    BEARISH: { min: -69, max: -35, label: 'BEARISH' },
    STRONG_BEARISH: { min: -100, max: -70, label: 'STRONG BEARISH' },
  },
};
