-- CreateEnum
CREATE TYPE "IndicatorDirection" AS ENUM ('HIGHER_IS_BULLISH', 'LOWER_IS_BULLISH', 'HAWKISH_IS_BULLISH', 'DOVISH_IS_BULLISH');

-- CreateEnum
CREATE TYPE "PolicyStance" AS ENUM ('STRONGLY_HAWKISH', 'HAWKISH', 'NEUTRAL', 'DOVISH', 'STRONGLY_DOVISH');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('ONLINE', 'WARNING', 'OFFLINE', 'STALE');

-- CreateTable
CREATE TABLE "Currency" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "centralBank" TEXT NOT NULL,
    "timezone" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "CategoryWeight" (
    "id" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "growthWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "inflationWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "laborWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
    "policyWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.20,
    "activityWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.10,

    CONSTRAINT "CategoryWeight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indicator" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "direction" "IndicatorDirection" NOT NULL,
    "primarySource" TEXT NOT NULL,
    "historicalSigma" DOUBLE PRECISION NOT NULL DEFAULT 1.0,

    CONSTRAINT "Indicator_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EconomicRelease" (
    "id" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "actual" DOUBLE PRECISION NOT NULL,
    "forecast" DOUBLE PRECISION,
    "previous" DOUBLE PRECISION NOT NULL,
    "revisedPrevious" DOUBLE PRECISION,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "importance" TEXT NOT NULL DEFAULT 'HIGH',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EconomicRelease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrencyMacroScore" (
    "id" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "growthScore" DOUBLE PRECISION NOT NULL,
    "inflationScore" DOUBLE PRECISION NOT NULL,
    "laborScore" DOUBLE PRECISION NOT NULL,
    "policyScore" DOUBLE PRECISION NOT NULL,
    "activityScore" DOUBLE PRECISION NOT NULL,
    "totalScore" DOUBLE PRECISION NOT NULL,
    "classification" TEXT NOT NULL,
    "confidence" TEXT NOT NULL,
    "dataCoverage" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrencyMacroScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderHealth" (
    "providerName" TEXT NOT NULL,
    "status" "ProviderStatus" NOT NULL,
    "lastSuccess" TIMESTAMP(3),
    "lastFailure" TIMESTAMP(3),
    "responseTimeMs" INTEGER NOT NULL,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderHealth_pkey" PRIMARY KEY ("providerName")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoryWeight_currencyCode_key" ON "CategoryWeight"("currencyCode");

-- CreateIndex
CREATE UNIQUE INDEX "Indicator_code_key" ON "Indicator"("code");

-- CreateIndex
CREATE UNIQUE INDEX "EconomicRelease_currencyCode_indicatorId_period_releaseDate_key" ON "EconomicRelease"("currencyCode", "indicatorId", "period", "releaseDate");

-- AddForeignKey
ALTER TABLE "CategoryWeight" ADD CONSTRAINT "CategoryWeight_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indicator" ADD CONSTRAINT "Indicator_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicRelease" ADD CONSTRAINT "EconomicRelease_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EconomicRelease" ADD CONSTRAINT "EconomicRelease_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "Indicator"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrencyMacroScore" ADD CONSTRAINT "CurrencyMacroScore_currencyCode_fkey" FOREIGN KEY ("currencyCode") REFERENCES "Currency"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
