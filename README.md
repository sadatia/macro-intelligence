# 🏛️ USD Macro Intelligence Terminal

An institutional-grade, high-frequency macroeconomic intelligence platform engineered to calculate real-time directional probability vectors across major asset classes (**USD, Gold, Silver, BTC, and S&P 500**).

The system pairs a **Quantitative 8-Factor USD Macro Scoring Engine** backed by direct **St. Louis Fed (FRED)** integrations with a **52-week trailing CFTC Commitment of Traders (COT)** pipeline, dynamic G5 calendar surprise vector calculations, and executive policy transmission modeling.

---

## 📸 Terminal Features & Asset Modules

- **Main USD Macro Dashboard (`/`)**: Calculates composite fundamental bias ($[-100, +100]$ PTS) from 8 weighted economic factors alongside real-time SOFR benchmark rates, 10Y real yields (`DFII10`), and credit stress indicators.
- **Gold Macro Intelligence ($XAU/USD$) (`/xauusd`)**: 5-Factor Intermarket Transmission Model evaluating 10Y TIPS real yield drag, yield curve slope (`T10Y2Y`), breakeven inflation expectations (`T10YIE`), and 12-month trailing COT non-commercial speculator positioning.
- **Silver Macro Intelligence ($XAG/USD$) (`/xagusd`)**: Hybrid model balancing industrial manufacturing demand (photovoltaic/green energy GDP vectors) against monetary real rate sensitivity.
- **Bitcoin Macro Intelligence ($BTC/USD$) (`/btc`)**: Macro store-of-value and global liquidity model tracking digital asset COT positioning and central bank rate expectations.
- **S&P 500 Macro Intelligence ($SPX$) (`/spx`)**: Risk-appetite transmission model evaluating equity multiple compression against TIPS discount rates, corporate credit spreads (BofA High Yield), and USD revenue drag.
- **Forex Majors Matrix (`/forex-pairs`)**: G5 currency pair directional bias vectors (EUR/USD, GBP/USD, USD/JPY, USD/CAD, AUD/USD).
- **Central Bank Policy Terminal (`/central-banks`)**: G5 policy rates, target rate probabilities, and meeting schedules.
- **Trump Policy & Sentiment Tracker (`/trump-tracker`)**: Executive order and policy statement impulse gauges across Trade/Tariffs, Monetary Pressure, Digital Assets, Energy, and Fiscal Expansion.
- **Dynamic Economic Calendar (`/calendar`)**: G5 high-voltage event radar with automated Z-score surprise index ($\sigma$) calculations.
- **Institutional Execution Guide (`/guide`)**: 4-step execution framework mapping macro scores into technical H1/H4 order block entries.

---

## 📊 Quantitative 8-Factor USD Engine

The core score engine (`scripts/calculate-macro-score.ts`) evaluates FRED economic series through a customizable factor weight distribution ($[-100, +100]$ PTS total scale):

| Macro Factor | Weight | FRED Series / Indicator Code | Focus & Metric Target |
| :--- | :---: | :--- | :--- |
| **GDP Growth Momentum** | **20%** | `us_gdp_quarterly` | Real output expansion vs baseline potential |
| **10Y Real Yield Vector** | **15%** | `us_real_yield_10y` (`DFII10`) | TIPS real interest rate holding cost |
| **Inflation Pressure (CPI)** | **15%** | `us_cpi_index` (`CPIAUCSL`) | Headline & Core consumer price momentum |
| **Labor Market Strength** | **15%** | `us_nfp_employment` (`PAYEMS`) | Non-Farm Payroll additions & labor tightness |
| **Fed Policy & Expectations** | **10%** | `us_sofr_rate` (`SOFR`) | Overnight secured benchmark rate & FOMC stance |
| **Yield Rate Spreads** | **10%** | `us_yield_spread_10y2y` (`T10Y2Y`) | 10Y-2Y Treasury yield curve slope |
| **Credit Stress & Risk Regime**| **10%** | `us_nfci_index` (`NFCI`) | Chicago Fed National Financial Conditions Index |
| **Market Confirmation (DXY)** | **5%** | `us_broad_reer` (`RBUSBIS`) | Broad Real Effective Exchange Rate momentum |

---

## 🛠️ Tech Stack & Design System

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components)
- **Language**: TypeScript (`npx tsx` execution runner)
- **Database & ORM**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Process Manager**: PM2 background runner
- **Styling**: Tailwind CSS with custom **Pro Bloomberg Terminal** dark tokens (`#06080d` canvas, monospace typography, `macro-card` frames, status badges)
- **Data Ingestion**: St. Louis Fed (FRED API), CFTC COT weekly reports, custom automated cron sync scripts

---

## 📂 Repository Structure

```text
├── app/
│   ├── page.tsx               # Main USD Macro Dashboard
│   ├── xauusd/page.tsx        # Gold ($XAU) Dashboard & 12M COT
│   ├── xagusd/page.tsx        # Silver ($XAG) Dashboard & 12M COT
│   ├── btc/page.tsx           # Bitcoin ($BTC) Dashboard & 12M COT
│   ├── spx/page.tsx           # S&P 500 ($SPX) Equity Dashboard
│   ├── forex-pairs/page.tsx   # G5 Forex Majors Matrix
│   ├── central-banks/page.tsx # Policy Rates & Schedules
│   ├── trump-tracker/page.tsx # Policy Transmission Gauges
│   ├── calendar/page.tsx      # Dynamic Economic Calendar & Z-Score
│   └── guide/page.tsx         # Institutional Execution Guide
├── components/
│   ├── Navbar.tsx             # Sticky Pro Terminal Navigation Bar
│   ├── BiasGauge.tsx          # Canvas SVG Semi-Circle Macro Gauge
│   └── EventCountdown.tsx     # High-Voltage Event Timer
├── prisma/
│   └── schema.prisma          # PostgreSQL Database Schema
├── scripts/
│   ├── ingest-live-data.ts    # FRED API Macro Data Ingestion
│   ├── calculate-macro-score.ts # 8-Factor USD Scoring Engine
│   ├── ingest-12m-cot.ts      # 52-Week CFTC COT Position Ingestion
│   ├── ingest-calendar.ts     # G5 Economic Calendar Event Seeding
│   ├── seed-trump-tracker.ts  # Executive Policy Transmission Seeding
│   └── auto-sync.sh           # Automated Background Sync Daemon
└── public/
🚀 Quick Start & Installation
1. Prerequisites
Node.js: v18.x or higher

PostgreSQL: Running instance with database credentials

PM2: Installed globally (npm install -g pm2)

2. Clone & Install Dependencies
Bash
git clone [https://github.com/sadatia/macro-intelligence.git](https://github.com/sadatia/macro-intelligence.git)
cd macro-intelligence
npm install
3. Environment Configuration
Create a .env file in the project root:

Code snippet
DATABASE_URL="postgresql://username:password@localhost:5432/usd_macro_db?schema=public"
FRED_API_KEY="your_st_louis_fed_api_key"
NODE_ENV="production"
4. Database Setup & Initial Ingestion
Bash
# Push Prisma schema to PostgreSQL
npx prisma db push
npx prisma generate

# Seed and run initial data ingestion pipeline
npx tsx --env-file=.env scripts/ingest-live-data.ts
npx tsx --env-file=.env scripts/calculate-macro-score.ts
npx tsx --env-file=.env scripts/ingest-12m-cot.ts
npx tsx --env-file=.env scripts/ingest-calendar.ts
npx tsx --env-file=.env scripts/seed-trump-tracker.ts
5. Production Build & Local Launch
Bash
# Production build
npm run build

# Start via PM2
npx pm2 start npm --name "usd-macro-intelligence" -- start
npx pm2 save
🔄 Automated Data Pipeline
The background daemon script (scripts/auto-sync.sh) maintains data freshness across all dashboard components.

To set up automatic updates every 15 minutes in crontab:

Bash
crontab -e
Add the following cron entry:

Code snippet
*/15 * * * * /root/usd-macro-intelligence/scripts/auto-sync.sh >/dev/null 2>&1
👨‍💻 Author
Md. Ashik E Sadatia

Email: sadat.post@gmail.com

GitHub: @sadatia




