import { NextResponse } from 'next/server';

const SCORES_DB = [
  { currency: 'USD', score: 72, classification: 'BULLISH', confidence: 'HIGH', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'CHF', score: 61, classification: 'BULLISH', confidence: 'HIGH', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'GBP', score: 45, classification: 'MILD BULLISH', confidence: 'MEDIUM', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'CAD', score: 31, classification: 'MILD BULLISH', confidence: 'MEDIUM', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'EUR', score: 18, classification: 'NEUTRAL', confidence: 'MEDIUM', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'AUD', score: -12, classification: 'NEUTRAL', confidence: 'LOW', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'NZD', score: -25, classification: 'MILD BEARISH', confidence: 'MEDIUM', updated_at: '2026-09-04T12:00:00Z' },
  { currency: 'JPY', score: -41, classification: 'BEARISH', confidence: 'HIGH', updated_at: '2026-09-04T12:00:00Z' },
];

export async function GET() {
  return NextResponse.json({
    status: 'success',
    data: SCORES_DB,
  });
}
