import re

p = '/root/usd-macro-intelligence/app/xagusd/page.tsx'
with open(p, 'r') as f:
    code = f.read()

code_new = re.sub(
    r'Math\.round\(r\.openInterest\s*/\s*1000\)',
    'r.openInterest > 1000 ? +(r.openInterest / 1000).toFixed(1) : +r.openInterest.toFixed(1)',
    code
)
code_new = re.sub(
    r'Math\.round\(r\.nonCommNet\s*/\s*1000\)',
    'Math.abs(r.nonCommNet) > 1000 ? +(r.nonCommNet / 1000).toFixed(1) : +r.nonCommNet.toFixed(1)',
    code_new
)

assert code_new != code, 'Target expressions not found in app/xagusd/page.tsx'
with open(p, 'w') as f:
    f.write(code_new)

print("Normalized Silver COT '000 contract units successfully.")
