p = '/root/usd-macro-intelligence/app/xauusd/page.tsx'
with open(p, 'r') as f:
    code = f.read()

# 1. Clean literal $XAU/USD$ strings
code = code.replace('$XAU/USD$', 'XAU/USD')

# 2. Moderate USD multiplier from -2 to -1.4 so Real Yields & USD stay balanced
code = code.replace('* -2', '* -1.4').replace('*-2', '*-1.4')

# 3. Add weight percentages to factor labels for visual math transparency
code = code.replace('10Y REAL INTEREST YIELDS', '10Y REAL INTEREST YIELDS [30%]')
code = code.replace('YIELD CURVE SLOPE 10Y-2Y', 'YIELD CURVE SLOPE 10Y-2Y [15%]')
code = code.replace('BROAD USD MACRO SCORE', 'BROAD USD MACRO SCORE [25%]')
code = code.replace('INFLATION EXPECTATIONS', 'INFLATION EXPECTATIONS [20%]')
code = code.replace('FINANCIAL STRESS', 'FINANCIAL STRESS [10%]')

with open(p, 'w') as f:
    f.write(code)
print('Gold model weights and UI labels refined.')
