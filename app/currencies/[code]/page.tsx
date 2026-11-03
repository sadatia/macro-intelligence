import React from 'react';
import { CurrencyDetailView } from '@/components/CurrencyDetailView';

const CURRENCY_PROFILES: Record<string, any> = {
  USD: {
    name: 'United States Dollar',
    centralBank: 'Federal Reserve',
    score: 72,
    classification: 'BULLISH',
    confidence: 'HIGH',
    categoryScores: { growth: 68, inflation: 74, labor: 81, policy: 76, activity: 58 },
    indicators: [
      { name: 'Non-Farm Payrolls', category: 'labor', weight: 8, direction: 'HIGHER_IS_BULLISH', latestValue: '215K', score: 5 },
      { name: 'CPI Inflation YoY', category: 'inflation', weight: 8, direction: 'HIGHER_IS_BULLISH', latestValue: '2.9%', score: 4 },
      { name: 'GDP Growth QoQ', category: 'growth', weight: 8, direction: 'HIGHER_IS_BULLISH', latestValue: '2.8%', score: 4 },
      { name: 'Federal Funds Rate', category: 'policy', weight: 10, direction: 'HAWKISH_IS_BULLISH', latestValue: '5.25%', score: 4 },
      { name: 'Unemployment Rate', category: 'labor', weight: 6, direction: 'LOWER_IS_BULLISH', latestValue: '3.9%', score: 5 },
      { name: 'Manufacturing PMI', category: 'activity', weight: 5, direction: 'HIGHER_IS_BULLISH', latestValue: '48.2', score: -2 },
    ],
  },
  EUR: {
    name: 'Euro Area Euro',
    centralBank: 'European Central Bank',
    score: 18,
    classification: 'NEUTRAL',
    confidence: 'MEDIUM',
    categoryScores: { growth: 12, inflation: 25, labor: 18, policy: 0, activity: 10 },
    indicators: [
      { name: 'GDP Growth QoQ', category: 'growth', weight: 8, direction: 'HIGHER_IS_BULLISH', latestValue: '0.3%', score: 1 },
      { name: 'CPI YoY Flash', category: 'inflation', weight: 8, direction: 'HIGHER_IS_BULLISH', latestValue: '2.4%', score: 2 },
      { name: 'Unemployment Rate', category: 'labor', weight: 6, direction: 'LOWER_IS_BULLISH', latestValue: '6.4%', score: 1 },
      { name: 'ECB Deposit Rate', category: 'policy', weight: 10, direction: 'HAWKISH_IS_BULLISH', latestValue: '3.75%', score: 0 },
    ],
  },
};

export default function CurrencyPage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  const profile = CURRENCY_PROFILES[code] || {
    name: `${code} Region`,
    centralBank: 'Central Bank',
    score: 0,
    classification: 'NEUTRAL',
    confidence: 'LOW',
    categoryScores: { growth: 0, inflation: 0, labor: 0, policy: 0, activity: 0 },
    indicators: [],
  };

  return (
    <main className="p-8">
      <CurrencyDetailView
        currencyCode={code}
        currencyName={profile.name}
        centralBank={profile.centralBank}
        macroScore={profile.score}
        classification={profile.classification}
        confidence={profile.confidence}
        categoryScores={profile.categoryScores}
        indicators={profile.indicators}
      />
    </main>
  );
}
