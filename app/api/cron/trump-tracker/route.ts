// app/api/cron/trump-tracker/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // 1. Fetch latest raw news or statements
    // 2. Parse sentiment & impact scores via internal scoring rules or AI
    const newEntry = await prisma.trumpComment.create({
      data: {
        category: 'TRADE & TARIFFS',
        statement: 'New proposed bilateral import tariffs on manufacturing imports.',
        usdImpact: 35,
        xauImpact: 45,
        btcImpact: -10,
        transmission: 'Drives inflation expectations higher, keeping bond yields elevated.',
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, entry: newEntry });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update Trump Tracker data' }, { status: 500 });
  }
}