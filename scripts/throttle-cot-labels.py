p = '/root/usd-macro-intelligence/components/GoldCotCharts.tsx'
with open(p, 'r') as f:
    code = f.read()

code = code.replace('<g key={d.period}>', '<g key={`${d.period}-${idx}`}>')

old_label = """                  <text x={x} y={chart3Height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
                    {d.period}
                  </text>"""

new_label = """                  {(oiData.length <= 16 || idx % 4 === 0 || idx === oiData.length - 1) && (
                    <text x={x} y={chart3Height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
                      {d.period}
                    </text>
                  )}"""

if old_label in code:
    code = code.replace(old_label, new_label)
    with open(p, 'w') as f:
        f.write(code)
    print('Throttled X-axis labels in components/GoldCotCharts.tsx successfully.')
else:
    print('Warning: X-axis label block did not match verbatim.')
