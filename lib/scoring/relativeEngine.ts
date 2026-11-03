import { MacroScoringEngine } from './engine';

export interface RelativePairScore {
  pair: string;
  baseCurrency: string;
  quoteCurrency: string;
  baseScore: number;
  quoteScore: number;
  rawDifference: number;
  normalizedRelativeScore: number; // [-100 to +100]
  classification: string;
}

export class RelativeCurrencyEngine {
  /**
   * Calculates the Forex relative macro score for any pair (e.g. EUR/USD, USD/JPY)
   * Prevents over-scaling by applying normalizing division and clamping.
   */
  public static calculatePairBias(
    pair: string,
    baseCurrency: string,
    quoteCurrency: string,
    baseScore: number,
    quoteScore: number
  ): RelativePairScore {
    const rawDifference = baseScore - quoteScore;
    
    // Normalize raw difference to clamp [-100, +100]
    const normalizedRelativeScore = Math.round(
      Math.max(-100, Math.min(100, rawDifference / 2))
    );

    return {
      pair,
      baseCurrency,
      quoteCurrency,
      baseScore,
      quoteScore,
      rawDifference,
      normalizedRelativeScore,
      classification: MacroScoringEngine.getClassification(normalizedRelativeScore)
    };
  }
}