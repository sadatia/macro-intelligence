# 1. Wire live FRED indicators & clean $SPX / $US500$ in app/spx/page.tsx
p_spx = '/root/usd-macro-intelligence/app/spx/page.tsx'
with open(p_spx, 'r') as f:
    spx = f.read()

spx = spx.replace('$SPX / $US500$', 'SPX / US500').replace('$SPX', 'SPX')

old_spx_math = """    const usdRecord = await prisma.currencyMacroScore.findFirst({
      where: { currencyCode: 'USD' },
      orderBy: { createdAt: 'desc' },
    });

    const realYield = await prisma.economicRelease.findFirst({
      where: { indicator: { code: 'us_real_yield_10y' } },
      orderBy: { releaseDate: 'desc' },
    });

    const ryVal = realYield?.actual ?? 2.63;
    const usdScore = usdRecord?.totalScore ?? 33;

    // Equity Multi-Factor Transmission Model
    const realYieldImpact = Math.round(-ryVal * 15); // High real yields compress P/E multiples
    const growthImpact = 45; // GDP expansion supports corporate earnings
    const usdImpact = Math.round(-usdScore * 0.4); // Strong USD headwinds S&P 500 international revenue
    const creditImpact = 35; // Unstressed credit markets provide liquidity tailwinds"""

new_spx_math = """    const [usdRecord, realYield, gdpRelease, creditRelease, nfciRelease] = await Promise.all([
      prisma.currencyMacroScore.findFirst({
        where: { currencyCode: 'USD' },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_real_yield_10y' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_gdp' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_credit_spread' } },
        orderBy: { releaseDate: 'desc' },
      }),
      prisma.economicRelease.findFirst({
        where: { indicator: { code: 'us_chicago_nfci' } },
        orderBy: { releaseDate: 'desc' },
      }),
    ]);

    const ryVal = realYield?.actual ?? 2.66;
    const usdScore = usdRecord?.totalScore ?? 33;
    const gdpVal = gdpRelease?.actual ?? 33010;
    const hySpreadVal = creditRelease?.actual ?? 3.15;
    const nfciVal = nfciRelease?.actual ?? -0.459;

    // Equity Multi-Factor Transmission Model (Live FRED Driven)
    const realYieldImpact = Math.round(-ryVal * 15); // High real yields compress P/E multiples
    const growthImpact = Math.min(60, Math.max(-60, Math.round(((gdpVal - 32400) / 1000) * 50)));
    const usdImpact = Math.round(-usdScore * 0.45); // Strong USD headwinds S&P 500 international revenue
    const creditImpact = Math.min(
      50,
      Math.max(-60, Math.round((4.0 - hySpreadVal) * 20 + -nfciVal * 30))
    );"""

assert old_spx_math in spx, 'Target SPX block not found'
with open(p_spx, 'w') as f:
    f.write(spx.replace(old_spx_math, new_spx_math))

# 2. Clean literal $XAU in app/calendar/page.tsx
p_cal = '/root/usd-macro-intelligence/app/calendar/page.tsx'
with open(p_cal, 'r') as f:
    cal = f.read()
with open(p_cal, 'w') as f:
    f.write(cal.replace('$XAU', 'XAU'))

print('Updated app/spx/page.tsx and app/calendar/page.tsx successfully.')
