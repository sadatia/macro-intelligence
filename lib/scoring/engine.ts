export type Direction = 'HIGHER_IS_BULLISH' | 'LOWER_IS_BULLISH' | 'HAWKISH_IS_BULLISH' | 'DOVISH_IS_BULLISH';

export interface IndicatorData {
  id: string;
  name: string;
  category: 'growth' | 'inflation' | 'labor' | 'policy' | 'activity';
  weight: number;
  direction: Direction;
  actual: number;
  forecast: number | null;
  previous: number;
  revisedPrevious?: number | null;
  historicalSigma: number;
  historicalTrend?: number[];
}

export interface IndicatorScoreResult {
  indicatorId: string;
  rawSurprise: number | null;
  normalizedSurpriseSigma: number | null;
  surpriseScore: number;
  revisionAdjustment: number;
  trendAdjustment: number;
  finalScore: number;
}

export class MacroScoringEngine {
  public static calculateIndicatorScore(data: IndicatorData): IndicatorScoreResult {
    let surpriseScore = 0;
    let normalizedSigma: number | null = null;
    let rawSurprise: number | null = null;

    if (data.forecast !== null && data.historicalSigma > 0) {
      rawSurprise = data.actual - data.forecast;
      
      if (data.direction === 'LOWER_IS_BULLISH' || data.direction === 'DOVISH_IS_BULLISH') {
        rawSurprise = -rawSurprise;
      }

      // Round to 4 decimal places to prevent floating-point inaccuracies (e.g. 1.9999999999999998)
      normalizedSigma = Math.round((rawSurprise / data.historicalSigma) * 10000) / 10000;

      if (normalizedSigma >= 2.0) surpriseScore = 5;
      else if (normalizedSigma >= 1.0) surpriseScore = 4;
      else if (normalizedSigma >= 0.5) surpriseScore = 3;
      else if (normalizedSigma >= 0.2) surpriseScore = 1;
      else if (normalizedSigma > -0.2) surpriseScore = 0;
      else if (normalizedSigma > -0.5) surpriseScore = -1;
      else if (normalizedSigma > -1.0) surpriseScore = -3;
      else if (normalizedSigma > -2.0) surpriseScore = -4;
      else surpriseScore = -5;
    }

    let revisionAdjustment = 0;
    if (data.revisedPrevious !== undefined && data.revisedPrevious !== null) {
      const revision = data.revisedPrevious - data.previous;
      const directionalRevision = (data.direction === 'LOWER_IS_BULLISH' || data.direction === 'DOVISH_IS_BULLISH') 
        ? -revision 
        : revision;

      if (data.historicalSigma > 0) {
        const revSigma = Math.round((directionalRevision / data.historicalSigma) * 10000) / 10000;
        if (revSigma >= 0.5) revisionAdjustment = 1.0;
        else if (revSigma <= -0.5) revisionAdjustment = -1.0;
      }
    }

    let trendAdjustment = 0;
    if (data.historicalTrend && data.historicalTrend.length >= 3) {
      const recent = data.historicalTrend.slice(-3);
      const isImproving = recent[2] > recent[1] && recent[1] > recent[0];
      const isDeteriorating = recent[2] < recent[1] && recent[1] < recent[0];

      if (data.direction === 'HIGHER_IS_BULLISH' || data.direction === 'HAWKISH_IS_BULLISH') {
        if (isImproving) trendAdjustment = 0.5;
        if (isDeteriorating) trendAdjustment = -0.5;
      } else {
        if (isImproving) trendAdjustment = -0.5;
        if (isDeteriorating) trendAdjustment = 0.5;
      }
    }

    const unclamped = surpriseScore + revisionAdjustment + trendAdjustment;
    const finalScore = Math.max(-5, Math.min(5, unclamped));

    return {
      indicatorId: data.id,
      rawSurprise,
      normalizedSurpriseSigma: normalizedSigma,
      surpriseScore,
      revisionAdjustment,
      trendAdjustment,
      finalScore
    };
  }

  public static getClassification(score: number): string {
    if (score >= 75) return 'STRONG BULLISH';
    if (score >= 50) return 'BULLISH';
    if (score >= 25) return 'MILD BULLISH';
    if (score >= -24) return 'NEUTRAL';
    if (score >= -49) return 'MILD BEARISH';
    if (score >= -74) return 'BEARISH';
    return 'STRONG BEARISH';
  }
}
