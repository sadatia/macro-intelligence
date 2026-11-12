import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

const POLICY_VECTORS = [
  {
    category: 'TRADE & TARIFFS',
    statement: 'Reciprocal tariff enforcement on strategic industrial imports and bilateral trade deficit reviews.',
    usdImpact: 35,
    xauImpact: 40,
    btcImpact: -10,
    transmission: 'Supports USD via terms-of-trade shifts while keeping import-driven inflation expectations elevated.',
  },
  {
    category: 'MONETARY POLICY',
    statement: 'Executive commentary favoring lower borrowing costs and domestic credit expansion ahead of December FOMC.',
    usdImpact: -30,
    xauImpact: 45,
    btcImpact: 35,
    transmission: 'Pressures front-end real yield premiums and strengthens non-yielding store-of-value demand.',
  },
  {
    category: 'DIGITAL ASSETS',
    statement: 'U.S. Strategic Digital Asset Reserve implementation and CFTC/SEC market-structure clarity initiatives.',
    usdImpact: -10,
    xauImpact: 15,
    btcImpact: 80,
    transmission: 'Reduces institutional custody friction and reinforces sovereign/corporate BTC treasury allocation.',
  },
  {
    category: 'ENERGY & DEREGULATION',
    statement: 'Accelerated federal LNG export permits and domestic upstream drilling lease expansions.',
    usdImpact: 20,
    xauImpact: -15,
    btcImpact: 15,
    transmission: 'Caps WTI energy-driven headline CPI spikes while boosting U.S. trade balance and industrial margins.',
  },
  {
    category: 'FISCAL & TAX POLICY',
    statement: 'Corporate tax rate extensions and domestic manufacturing capital-expensing incentives.',
    usdImpact: 25,
    xauImpact: 30,
    btcImpact: 20,
    transmission: 'Sustains U.S. nominal GDP growth exceptionalism alongside elevated Treasury debt-supply issuance.',
  },
];

export async function GET() {
  try {
    // Prune older rows beyond the latest 15 to prevent unbounded table growth
    const existing = await prisma.trumpComment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    if (existing.length > 5) {
      const keepIds = new Set<string>();
      const seenCategories = new Set<string>();
      for (const row of existing) {
        if (!seenCategories.has(row.category)) {
          seenCategories.add(row.category);
          keepIds.add(row.id);
        }
      }
      await prisma.trumpComment.deleteMany({
        where: { id: { notIn: Array.from(keepIds) } },
      });
    }

    let upserted = 0;
    for (const item of POLICY_VECTORS) {
      const found = await prisma.trumpComment.findFirst({
        where: { category: item.category },
      });

      if (found) {
        await prisma.trumpComment.update({
          where: { id: found.id },
          data: {
            statement: item.statement,
            usdImpact: item.usdImpact,
            xauImpact: item.xauImpact,
            btcImpact: item.btcImpact,
            transmission: item.transmission,
            publishedAt: new Date(),
          },
        });
      } else {
        await prisma.trumpComment.create({
          data: {
            ...item,
            publishedAt: new Date(),
          },
        });
      }
      upserted++;
    }

    return NextResponse.json({ success: true, activeVectors: upserted });
  } catch (error) {
    console.error('Trump Tracker cron error:', error);
    return NextResponse.json({ error: 'Failed to update Trump Tracker data' }, { status: 500 });
  }
}
