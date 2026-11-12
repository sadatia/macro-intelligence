#!/bin/bash
export PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

cd /root/usd-macro-intelligence || exit 1

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Starting automated macro data sync..." >> cron-sync.log

npx tsx --env-file=.env scripts/ingest-live-data.ts >> cron-sync.log 2>&1
npx tsx --env-file=.env scripts/calculate-macro-score.ts >> cron-sync.log 2>&1
npx tsx --env-file=.env scripts/ingest-12m-cot.ts >> cron-sync.log 2>&1
npx tsx --env-file=.env scripts/ingest-calendar.ts >> cron-sync.log 2>&1
npx tsx --env-file=.env scripts/sync-central-banks.ts >> cron-sync.log 2>&1

echo "[$(date -u +"%Y-%m-%dT%H:%M:%SZ")] Sync cycle complete." >> cron-sync.log
