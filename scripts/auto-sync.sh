#!/bin/bash

export PATH=$PATH:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd /root/usd-macro-intelligence || exit

LOG_FILE="/root/usd-macro-intelligence/cron-sync.log"

echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] Starting automated background macro sync..." >> "$LOG_FILE"

# 1. Ingest FRED Indicators
npx tsx --env-file=.env scripts/ingest-live-data.ts >> "$LOG_FILE" 2>&1

# 2. Recalculate 8-Factor USD Score
npx tsx --env-file=.env scripts/calculate-macro-score.ts >> "$LOG_FILE" 2>&1

# 3. Ingest G5 Economic Calendar Events
npx tsx --env-file=.env scripts/ingest-calendar.ts >> "$LOG_FILE" 2>&1

# 4. Ingest Central Bank Policy Rates & Schedules
npx tsx --env-file=.env scripts/ingest-central-banks.ts >> "$LOG_FILE" 2>&1

# 5. Sync 12-Month COT Positioning (Gold, Silver, BTC)
npx tsx --env-file=.env scripts/ingest-12m-cot.ts >> "$LOG_FILE" 2>&1

echo "[$(date -u +'%Y-%m-%d %H:%M:%S UTC')] Background macro sync complete." >> "$LOG_FILE"

# Log rotation: keep last 2000 lines
tail -n 2000 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
