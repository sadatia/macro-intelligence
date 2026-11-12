p = '/root/usd-macro-intelligence/app/btc/page.tsx'
with open(p, 'r') as f:
    code = f.read()

old_block = """    const usdMacroScore = usdMacroScoreRecord?.totalScore ?? 22;
    const realYieldVal = realYield?.actual ?? 2.42;
    const usdIndexVal = usdIndex?.actual ?? 118.75;

    // Quantitative BTC Macro Factor Scores (-100 to +100)
    const globalM2Score = 40;         // +40 Pts (Global M2 YoY Impulse)
    const realYieldsScore = Math.min(100, Math.max(-100, Math.round((2.0 - realYieldVal) * 40)));
    const exchangeOutflowsScore = 25; // +25 Pts (Exchange Reserves Drain Rate)
    const usdHeadwindScore = Math.min(100, Math.max(-100, Math.round(-usdMacroScore * 1.5)));"""

new_block = """    const [fedAssets, reverseRepo, nfci, creditSpread] = await Promise.all([
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_fed_assets' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_reverse_repo' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_chicago_nfci' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_credit_spread' } },
        orderBy: { releaseDate: 'desc' },
      }),
    ]);

    const usdMacroScore = usdMacroScoreRecord?.totalScore ?? 33;
    const realYieldVal = realYield?.actual ?? 2.66;
    const usdIndexVal = usdIndex?.actual ?? 121.88;
    const fedAssetsVal = fedAssets?.actual ?? 6748145; // Millions USD (WALCL)
    const reverseRepoVal = reverseRepo?.actual ?? 0.152; // Billions USD (RRPONTSYD)
    const nfciVal = nfci?.actual ?? -0.459;
    const creditSpreadVal = creditSpread?.actual ?? 3.15;

    // Fed Net Liquidity in Trillions: WALCL ($T) - RRP ($T) vs $6.65T equilibrium
    const netLiquidityTrillions = (fedAssetsVal / 1_000_000) - (reverseRepoVal / 1_000);

    // Quantitative BTC Macro Factor Scores (-100 to +100)
    const globalM2Score = Math.min(100, Math.max(-100, Math.round((netLiquidityTrillions - 6.65) * 80)));
    const realYieldsScore = Math.min(100, Math.max(-100, Math.round((2.0 - realYieldVal) * 40)));
    const exchangeOutflowsScore = Math.min(
      100,
      Math.max(-100, Math.round((-nfciVal * 35) + ((4.0 - creditSpreadVal) * 10)))
    );
    const usdHeadwindScore = Math.min(100, Math.max(-100, Math.round(-usdMacroScore * 1.5)));"""

if old_block in code:
    code = code.replace(old_block, new_block)
    with open(p, 'w') as f:
        f.write(code)
    print('Successfully wired live FRED liquidity series into app/btc/page.tsx.')
else:
    print('Warning: Target block not found; inspect lines 20-45 of app/btc/page.tsx.')
