import { MacroScoringEngine, IndicatorData } from '../lib/scoring/engine';

describe('MacroScoringEngine Unit Tests', () => {
  test('NFP Higher than forecast produces positive surprise sigma score', () => {
    const nfpData: IndicatorData = {
      id: 'us_nfp',
      name: 'Non-Farm Payrolls',
      category: 'labor',
      weight: 8,
      direction: 'HIGHER_IS_BULLISH',
      actual: 215,
      forecast: 175,
      previous: 160,
      historicalSigma: 20
    };

    const result = MacroScoringEngine.calculateIndicatorScore(nfpData);
    expect(result.rawSurprise).toBe(40);
    expect(result.normalizedSurpriseSigma).toBe(2.0);
    expect(result.surpriseScore).toBe(5);
    expect(result.finalScore).toBe(5);
  });

  test('Unemployment Rate Lower than forecast produces bullish score', () => {
    const unempData: IndicatorData = {
      id: 'us_unemployment',
      name: 'Unemployment Rate',
      category: 'labor',
      weight: 6,
      direction: 'LOWER_IS_BULLISH',
      actual: 3.9,
      forecast: 4.1,
      previous: 4.0,
      historicalSigma: 0.1
    };

    const result = MacroScoringEngine.calculateIndicatorScore(unempData);
    expect(result.surpriseScore).toBe(5);
    expect(result.finalScore).toBe(5);
  });

  test('Handles null consensus forecast without crashing or fabricating', () => {
    const noForecastData: IndicatorData = {
      id: 'custom_ind',
      name: 'Custom Indicator',
      category: 'growth',
      weight: 5,
      direction: 'HIGHER_IS_BULLISH',
      actual: 100,
      forecast: null,
      previous: 95,
      historicalSigma: 2
    };

    const result = MacroScoringEngine.calculateIndicatorScore(noForecastData);
    expect(result.rawSurprise).toBeNull();
    expect(result.surpriseScore).toBe(0);
  });
});
