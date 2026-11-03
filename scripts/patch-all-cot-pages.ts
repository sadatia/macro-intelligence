import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

function formatWeekLabel(date: Date): string {
  const monthStr = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const weekNum = Math.ceil(day / 7);
  return `${monthStr} W${weekNum}`;
}

const pages = [
  { path: '/root/usd-macro-intelligence/app/btc/page.tsx', asset: 'BTC' },
  { path: '/root/usd-macro-intelligence/app/xauusd/page.tsx', asset: 'GOLD' },
  { path: '/root/usd-macro-intelligence/app/xagusd/page.tsx', asset: 'SILVER' },
];

for (const p of pages) {
  if (fs.existsSync(p.path)) {
    let code = fs.readFileSync(p.path, 'utf8');

    // Replace hardcoded May W1 - Aug W3 array literals directly
    code = code.replace(
      /\['May W1',\s*'May W3',\s*'Jun W1',\s*'Jun W3',\s*'Jul W1',\s*'Jul W3',\s*'Aug W1',\s*'Aug W3'\]/g,
      `['Aug W1', 'Aug W3', 'Sep W1', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2', 'Oct W3']`
    );

    code = code.replace(
      /labels:\s*\['May W1',.*?\]/g,
      `labels: ['Aug W1', 'Aug W3', 'Sep W1', 'Sep W3', 'Sep W4', 'Oct W1', 'Oct W2', 'Oct W3']`
    );

    fs.writeFileSync(p.path, code);
    console.log(`Updated date labels in ${p.path}`);
  }
}
