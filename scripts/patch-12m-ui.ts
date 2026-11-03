import fs from 'fs';

const pages = [
  '/root/usd-macro-intelligence/app/btc/page.tsx',
  '/root/usd-macro-intelligence/app/xauusd/page.tsx',
  '/root/usd-macro-intelligence/app/xagusd/page.tsx',
];

const labels12M = `['Nov \\'25', 'Dec \\'25', 'Jan \\'26', 'Feb \\'26', 'Mar \\'26', 'Apr \\'26', 'May \\'26', 'Jun \\'26', 'Jul \\'26', 'Aug \\'26', 'Sep \\'26', 'Oct \\'26']`;

for (const p of pages) {
  if (fs.existsSync(p)) {
    let code = fs.readFileSync(p, 'utf8');

    // Overwrite static arrays with 12-month labels
    code = code.replace(
      /\[\s*'(?:May\vert{}Jun\vert{}Jul\vert{}Aug\vert{}Sep\vert{}Oct)\s+W\d'.*?\]/g,
      labels12M
    );

    code = code.replace(
      /labels:\s*\[.*?\]/g,
      `labels: ${labels12M}`
    );

    fs.writeFileSync(p, code);
    console.log(`Updated 12-Month timeline in ${p}`);
  }
}
