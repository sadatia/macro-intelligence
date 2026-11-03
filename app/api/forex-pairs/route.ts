import { NextResponse } from 'next/server';
import { RelativeCurrencyEngine } from '@/lib/scoring/relativeEngine';

const CURRENCY_SCORES: Record<string, number> = {
  USD: 72, CHF: 61, GBP: 45, CAD: 31, EUR: 18, AUD: -12, NZD: -25, JPY: -41,
};

export async function GET() {
  const pairs = [
    { name: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { name: 'GBP/USD', base: 'GBP', quote: 'USD' },
    { name: 'USD/JPY', base: 'USD', quote: 'JPY' },
    { name: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { name: 'AUD/USD', base: 'AUD', quote: 'USD' },
    { name: 'USD/CHF', base: 'USD', quote: 'CHF' },
    { name: 'NZD/USD', base: 'NZD', quote: 'USD' },
  ];

  const results = pairs.map((p) =>
    RelativeCurrencyEngine.calculatePairBias(
      p.name,
      p.base,
      p.quote,
      CURRENCY_SCORES[p.base] || 0,
      CURRENCY_SCORES[p.quote] || 0
    )
  );

  return NextResponse.json({
    status: 'success',
    data: results,
  });
}
