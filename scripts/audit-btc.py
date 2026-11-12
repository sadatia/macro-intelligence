p = '/root/usd-macro-intelligence/app/btc/page.tsx'
with open(p, 'r') as f:
    code = f.read()

# 1. Clean literal $BTC/...$ ticker strings
code = code.replace('$BTC/USD$', 'BTC/USD').replace('$BTC/$', 'BTC/USD')

# 2. Bind COT query to the 52-week BITCOIN/BTC database records
code = code.replace("where: { assetCode: 'BTC' }", "where: { assetCode: { in: ['BITCOIN', 'BTC'] } }")
code = code.replace("where: { assetCode: 'BITCOIN' }", "where: { assetCode: { in: ['BITCOIN', 'BTC'] } }")
code = code.replace("take: 8,", "take: 52,")

with open(p, 'w') as f:
    f.write(code)
print('Patched app/btc/page.tsx successfully.')
