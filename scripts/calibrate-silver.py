p = '/root/usd-macro-intelligence/app/xagusd/page.tsx'
with open(p, 'r') as f:
    code = f.read()

# 1. Clean any remaining literal $XAG/USD$ strings
code = code.replace('$XAG/USD$', 'XAG/USD')

# 2. Bind COT query to the 52-week SILVER database records
code = code.replace("where: { assetCode: 'XAG' }", "where: { assetCode: { in: ['SILVER', 'XAG'] } }")
code = code.replace("take: 8,", "take: 52,")

# 3. Calibrate high-beta Silver multipliers & realistic GDP baseline (32800)
old_math = """    const realYieldScore = Math.min(100, Math.max(-100, Math.round((2.0 - realYieldVal) * 50)));
    const industrialScore = Math.min(100, Math.max(-100, Math.round(((gdpVal - 30000) / 1000) * 15)));
    const usdScore = Math.min(100, Math.max(-100, Math.round(-usdMacroScore * 2)));
    const inflationScore = Math.min(100, Math.max(-100, Math.round((breakevenVal - 2.0) * 80)));

    const totalScore = Math.round(
      realYieldScore * 0.30 + industrialScore * 0.30 + usdScore * 0.20 + inflationScore * 0.20
    );"""

new_math = """    const realYieldScore = Math.min(100, Math.max(-100, Math.round((2.0 - realYieldVal) * 65)));
    const industrialScore = Math.min(100, Math.max(-100, Math.round(((gdpVal - 32800) / 1000) * 25)));
    const usdScore = Math.min(100, Math.max(-100, Math.round(-usdMacroScore * 2.2)));
    const inflationScore = Math.min(100, Math.max(-100, Math.round((breakevenVal - 2.0) * 80)));

    const totalScore = Math.round(
      realYieldScore * 0.35 + usdScore * 0.30 + inflationScore * 0.20 + industrialScore * 0.15
    );"""

if old_math in code:
    code = code.replace(old_math, new_math)
    print('Updated Silver high-beta math successfully.')
else:
    print('Warning: Math block did not match verbatim; check indentation.')

with open(p, 'w') as f:
    f.write(code)
