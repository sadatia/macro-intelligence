🏛️ Global Macro Intelligence Terminal

Institutional-grade macroeconomic intelligence platform delivering real-time directional bias, quantitative scoring, intermarket analysis, and policymaker impact assessment across USD, Gold, Silver, Bitcoin, Equities, and Major FX Markets.

https://img.shields.io/badge/Status-Production-green https://img.shields.io/badge/Next.js-14-black https://img.shields.io/badge/TypeScript-5.x-blue https://img.shields.io/badge/PostgreSQL-Database-blue https://img.shields.io/badge/Prisma-ORM-orange

Overview

Global Macro Intelligence Terminal is a professional market intelligence and decision-support platform designed to transform macroeconomic data into actionable trading insights.

The system combines:

8-Factor USD Macro Scoring Engine
FRED Economic Data Integration
52-Week CFTC Commitment of Traders (COT) Analytics
Central Bank Policy Monitoring
Economic Surprise Modeling
Intermarket Asset Correlation Frameworks
Executive Policy & Sentiment Transmission Analysis

The platform continuously evaluates macroeconomic conditions and generates directional bias scores across major financial markets.

Key Capabilities

✅ Quantitative Macro Scoring

✅ Real-Time Economic Data Analysis

✅ Institutional Market Sentiment Monitoring

✅ CFTC Positioning Analytics

✅ Central Bank Policy Tracking

✅ Economic Calendar Impact Assessment

✅ Cross-Asset Intermarket Intelligence

✅ Professional Bloomberg-Style Dashboard Interface

📊 Platform Modules
🏛️ USD Macro Dashboard (/)

Core macroeconomic intelligence engine powered by an 8-factor weighted scoring framework.

Metrics Evaluated
GDP Growth Momentum
10-Year Real Yield Trends
Inflation Dynamics
Labor Market Strength
Federal Reserve Policy Stance
Yield Curve Signals
Financial Conditions Index
DXY Confirmation Signals
Output
Composite Macro Score (-100 to +100)
USD Directional Bias
Real Yield Environment
Financial Conditions Assessment
🥇 Gold Intelligence Terminal (/xauusd)

Intermarket gold valuation framework designed to evaluate the macro drivers affecting precious metals.

Factors
10-Year TIPS Real Yields
Yield Curve Structure
Inflation Expectations
Dollar Strength
CFTC Non-Commercial Positioning
Output
Gold Bullish/Bearish Bias
Institutional Positioning Outlook
Real Yield Sensitivity Analysis
🥈 Silver Intelligence Terminal (/xagusd)

Hybrid model that evaluates silver's dual role as:

Industrial Metal
Monetary Asset
Factors
Global Manufacturing Activity
Photovoltaic Demand Trends
Inflation Expectations
Real Rates
Speculative Positioning
₿ Bitcoin Intelligence Terminal (/btc)

Macro liquidity framework focused on digital assets.

Tracks
Global Risk Appetite
Real Interest Rates
Liquidity Conditions
Federal Reserve Expectations
Institutional Crypto Positioning
Output
Bitcoin Risk-On/Risk-Off Signals
Liquidity Cycle Assessment
Macro Currency Hedge Signals
📈 S&P 500 Intelligence Terminal (/spx)

Institutional equity valuation framework.

Factors
Real Interest Rates
Corporate Credit Spreads
Financial Conditions
USD Strength
Risk Appetite Environment
Output
Equity Market Bias
Valuation Compression Risk
Macro Risk Regime
💱 Forex Majors Matrix (/forex-pairs)

G5 currency strength model covering:

EUR/USD
GBP/USD
USD/JPY
USD/CAD
AUD/USD
Features
Relative Macro Strength
Interest Rate Differentials
Central Bank Divergence
Directional Bias Scoring
🏦 Central Bank Policy Terminal (/central-banks)

Comprehensive monitoring dashboard for:

Federal Reserve
ECB
Bank of England
Bank of Japan
Bank of Canada
Reserve Bank of Australia
Features
Policy Rates
Next Meeting Dates
Rate Expectations
Forward Guidance Analysis
📢 Policy & Sentiment Tracker (/policy-tracker)

Measures market impact from executive actions and policy announcements.

Categories
Trade & Tariffs
Fiscal Policy
Digital Assets
Energy Policy
Monetary Pressure
Output
Market Sentiment Impact Scores
Risk Asset Sensitivity
Inflationary/Deflationary Impulse Assessment
📅 Economic Event Radar (/calendar)

Advanced economic calendar featuring:

Consensus Estimates
Previous Results
Volatility Ranking
Surprise Detection
Supported Economies
United States
Eurozone
United Kingdom
Japan
Canada
Australia
🎯 Institutional Execution Guide (/guide)

Framework for converting macro conviction into actionable trade execution.

Workflow
Assess Macro Score
Confirm Intermarket Alignment
Identify Technical Structure
Execute Risk-Managed Trade Setup
🧮 8-Factor USD Macro Scoring Engine

The platform's core analytical framework evaluates macroeconomic conditions using weighted economic indicators.

Factor	Weight	Economic SeriesGDP Growth Momentum	20%	GDP
10Y Real Yield Vector	15%	DFII10
Inflation Pressure	15%	CPIAUCSL
Labor Market Strength	15%	PAYEMS
Fed Policy Expectations	10%	SOFR
Yield Curve Structure	10%	T10Y2Y
Financial Conditions	10%	NFCI
DXY Confirmation	5%	RBUSBIS
Score Interpretation
Score Range	Market View+75 to +100	Strongly USD Bullish
+25 to +74	Moderately USD Bullish
-24 to +24	Neutral
-25 to -74	Moderately USD Bearish
-75 to -100	Strongly USD Bearish
🛠 Technology Stack
Frontend
Next.js 14
React Server Components
TypeScript
Tailwind CSS
Backend
Node.js
Prisma ORM
PostgreSQL
Market Data Sources
Federal Reserve Economic Data (FRED)
CFTC Commitment of Traders Reports
Economic Calendar Feeds
Interest Rate Data Sources
Operations
PM2 Process Management
Linux Cron Automation
Automated Data Synchronization Scripts
📂 Project Structure
Plain Text
app/
├── page.tsx
├── xauusd/page.tsx
├── xagusd/page.tsx
├── btc/page.tsx
├── spx/page.tsx
├── forex-pairs/page.tsx
├── central-banks/page.tsx
├── policy-tracker/page.tsx
├── calendar/page.tsx
└── guide/page.tsx
 
components/
├── Navbar.tsx
├── BiasGauge.tsx
└── EventCountdown.tsx
 
prisma/
└── schema.prisma
 
scripts/
├── ingest-live-data.ts
├── calculate-macro-score.ts
├── ingest-12m-cot.ts
├── ingest-calendar.ts
├── seed-policy-tracker.ts
└── auto-sync.sh
🚀 Quick Start
Prerequisites
Node.js 18+
PostgreSQL
PM2

Install PM2:

Shell
npm install -g pm2
Clone Repository
Shell
git clone https://github.com/sadatia/macro-intelligence.git
 
cd macro-intelligence
 
npm install
Environment Variables

Create a .env file:

Shell
env isn’t fully supported. Syntax highlighting is based on Shell.
DATABASE_URL="postgresql://username:password@localhost:5432/macro_intelligence?schema=public"
 
FRED_API_KEY="your_fred_api_key"
 
NODE_ENV="production"
Database Setup
Shell
npx prisma db push
 
npx prisma generate
Initial Data Ingestion
Shell
npx tsx --env-file=.env scripts/ingest-live-data.ts
 
npx tsx --env-file=.env scripts/calculate-macro-score.ts
 
npx tsx --env-file=.env scripts/ingest-12m-cot.ts
 
npx tsx --env-file=.env scripts/ingest-calendar.ts
 
npx tsx --env-file=.env scripts/seed-policy-tracker.ts
Development Server
Shell
npm run dev

Application:

Plain Text
http://localhost:3000
Production Deployment

Build Application

Shell
npm run build

Start with PM2

Shell
pm2 start npm --name "macro-intelligence" -- start
 
pm2 save
🔄 Automated Data Synchronization

Schedule automatic refresh every 15 minutes.

Shell
crontab -e

Add:

Shell
cron isn’t fully supported. Syntax highlighting is based on Shell.
*/15 * * * * /root/macro-intelligence/scripts/auto-sync.sh > /dev/null 2>&1
📈 Intended Users
Macro Traders
Forex Traders
Precious Metals Traders
Bitcoin Investors
Hedge Funds
Proprietary Trading Firms
Financial Analysts
Economic Researchers
🔒 Disclaimer

This platform is designed for educational and informational purposes only.

It does not constitute investment advice, financial advice, or a recommendation to buy or sell any financial instrument. Users are solely responsible for their own trading and investment decisions.

👨‍💻 Author

Md. Ashik E Sadatia

Senior IT Engineer | Solutions Architect | Macro Market Researcher

📧 sadat.post@gmail.com

🔗 GitHub: https://github.com/sadatia

Vision

Transform macroeconomic complexity into clear, quantitative, and actionable market intelligence.