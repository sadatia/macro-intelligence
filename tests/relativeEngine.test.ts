import { RelativeCurrencyEngine } from '../lib/scoring/relativeEngine';

describe('RelativeCurrencyEngine Unit Tests', () => {
  test('Calculates EUR/USD relative macro score correctly', () => {
    const result = RelativeCurrencyEngine.calculatePairBias(
      'EUR/USD',
      'EUR',
      'USD',
      18, // EUR Score
      72  // USD Score
    );

    // Raw = 18 - 72 = -54 -> Normalized = -54 / 2 = -27
    expect(result.rawDifference).toBe(-54);
    expect(result.normalizedRelativeScore).toBe(-27);
    expect(result.classification).toBe('MILD BEARISH');
  });

  test('Clamps extreme relative divergence within [-100, +100]', () => {
    const result = RelativeCurrencyEngine.calculatePairBias(
      'USD/JPY',
      'USD',
      'JPY',
      95,
      -95
    );

    // Raw = 190 -> Normalized = 190 / 2 = 95
    expect(result.normalizedRelativeScore).toBe(95);
    expect(result.classification).toBe('STRONG BULLISH');
  });
});
