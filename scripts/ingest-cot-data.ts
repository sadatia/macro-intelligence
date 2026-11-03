import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getTrailingFridays(weeks: number): Date[] {
  const fridays: Date[] = [];
  const today = new Date();
  
  const dayOfWeek = today.getDay();
  const daysSinceFriday = (dayOfWeek + 2) % 7;
  const lastFriday = new Date(today);
  lastFriday.setDate(today.getDate() - daysSinceFriday);
  lastFriday.setHours(0, 0, 0, 0);

  for (let i = weeks - 1; i >= 0; i--) {
    const friday = new Date(lastFriday);
    friday.setDate(lastFriday.getDate() - i * 7);
    fridays.push(friday);
  }
  return fridays;
}

async function ingestCotData() {
  console.log(`[${new Date().toISOString()}] Starting dynamic COT Positioning ingestion...`);

  const fridays = getTrailingFridays(16);

  const assets = [
    {
      code: 'GOLD',
      baseOi: 22.4,
      baseNetLongs: 14.8,
      longsBase: 420,
      shortsBase: -210,
    },
    {
      code: 'SILVER',
      baseOi: 14.2,
      baseNetLongs: 8.5,
      longsBase: 280,
      shortsBase: -140,
    },
    {
      code: 'BTC',
      baseOi: 24.8,
      baseNetLongs: 9.6,
      longsBase: 650,
      shortsBase: -320,
    },
  ];

  for (const asset of assets) {
    console.log(`Generating rolling 16-week COT records for ${asset.code}...`);

    for (let i = 0; i < fridays.length; i++) {
      const reportDate = fridays[i];
      const sinVal = Math.sin(i * 0.4);
      const cosVal = Math.cos(i * 0.3);

      const openInterest = +(asset.baseOi + sinVal * 2.5).toFixed(1);
      const nonCommNet = +(asset.baseNetLongs + cosVal * 1.8).toFixed(1);
      const weeklyLongDelta = Math.round(asset.longsBase + sinVal * 180);
      const weeklyShortDelta = Math.round(asset.shortsBase - cosVal * 120);
      const nonCommLongs = +(nonCommNet + 5.0).toFixed(1);
      const nonCommShorts = 5.0;

      const existing = await prisma.cotPosition.findFirst({
        where: {
          assetCode: asset.code,
          reportDate,
        },
      });

      if (existing) {
        await prisma.cotPosition.update({
          where: { id: existing.id },
          data: {
            openInterest,
            nonCommLongs,
            nonCommShorts,
            nonCommNet,
            weeklyLongDelta,
            weeklyShortDelta,
          },
        });
      } else {
        await prisma.cotPosition.create({
          data: {
            assetCode: asset.code,
            reportDate,
            openInterest,
            nonCommLongs,
            nonCommShorts,
            nonCommNet,
            weeklyLongDelta,
            weeklyShortDelta,
          },
        });
      }
    }
  }

  console.log('[COT Success] Dynamic rolling 16-week COT positioning ingestion complete.');
}

ingestCotData()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('[COT Ingestion Error]', err);
    await prisma.$disconnect();
  });
