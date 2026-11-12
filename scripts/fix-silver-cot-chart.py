# 1. Fix app/xagusd/page.tsx COT query & chronological ordering
p_page = '/root/usd-macro-intelligence/app/xagusd/page.tsx'
with open(p_page, 'r') as f:
    code = f.read()

code = code.replace(
    "where: { assetCode: { in: ['SILVER', 'XAG'] } },\n        orderBy: { reportDate: 'asc' },\n        take: 52,",
    "where: { assetCode: 'SILVER', openInterest: { gt: 0 } },\n        orderBy: { reportDate: 'desc' },\n        take: 52,"
).replace(
    "where: { assetCode: { in: ['SILVER', 'XAG'] } },\n      orderBy: { reportDate: 'asc' },\n      take: 52,",
    "where: { assetCode: 'SILVER', openInterest: { gt: 0 } },\n      orderBy: { reportDate: 'desc' },\n      take: 52,"
)

if 'cotRecords.reverse()' not in code:
    code = code.replace(
        'const oiData = cotRecords.length > 0',
        'cotRecords.reverse();\n    const oiData = cotRecords.length > 0'
    )

with open(p_page, 'w') as f:
    f.write(code)

# 2. Update 4-MONTH TREND title in components/GoldCotCharts.tsx
p_chart = '/root/usd-macro-intelligence/components/GoldCotCharts.tsx'
with open(p_chart, 'r') as f:
    chart_code = f.read()

chart_code = chart_code.replace('4-MONTH TREND', '12-MONTH TREND')
with open(p_chart, 'w') as f:
    f.write(chart_code)

print('Updated Silver COT query and 12-Month header.')
