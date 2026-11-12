p = '/root/usd-macro-intelligence/app/forex-pairs/page.tsx'
with open(p, 'r') as f:
    code = f.read()

old_section = """  const currencies = [
    { code: 'USD', name: 'US Dollar', score: dynamicUsdScore, stance: 'HAWKISH HOLD', yield10y: '4.34%', driver: 'Strong Growth & Policy Stance' },
    { code: 'EUR', name: 'Euro', score: -20, stance: 'NEUTRAL / CUTS', yield10y: '2.25%', driver: 'Stagnant Manufacturing & ECB Rate Cuts' },
    { code: 'GBP', name: 'British Pound', score: 15, stance: 'BALANCED', yield10y: '3.95%', driver: 'Sticky Services Inflation' },
    { code: 'JPY', name: 'Japanese Yen', score: -65, stance: 'SLIGHT HAWKISH', yield10y: '0.92%', driver: 'Wide Yield Differentials & BOJ Inertia' },
    { code: 'AUD', name: 'Australian Dollar', score: 10, stance: 'NEUTRAL', yield10y: '4.10%', driver: 'China Headwinds vs Local Inflation' },
    { code: 'CAD', name: 'Canadian Dollar', score: -15, stance: 'DOVISH CUTS', yield10y: '3.15%', driver: 'Oil Price Neutrality & BOC Rate Cuts' },
    { code: 'CHF', name: 'Swiss Franc', score: -30, stance: 'DOVISH', yield10y: '0.45%', driver: 'SNB Rate Cuts & Safe-Haven Outflows' },
  ];"""

new_section = """  const currencies = [
    { code: 'USD', name: 'US Dollar', score: dynamicUsdScore, stance: 'HAWKISH HOLD', yield10y: '4.34%', driver: '3.75%-4.00% Fed Rate & Dec Hike Risk' },
    { code: 'AUD', name: 'Australian Dollar', score: 24, stance: 'HAWKISH HIKE', yield10y: '4.95%', driver: 'RBA Hiked to 4.85% on Nov 3' },
    { code: 'GBP', name: 'British Pound', score: 18, stance: 'HAWKISH HIKE', yield10y: '4.45%', driver: 'BoE Hiked to 4.00% on Nov 5' },
    { code: 'CAD', name: 'Canadian Dollar', score: -8, stance: 'CAUTIOUS HIKE', yield10y: '3.35%', driver: 'BoC Hiked to 2.50% vs USD Drag' },
    { code: 'EUR', name: 'Euro', score: -14, stance: 'HAWKISH HOLD', yield10y: '2.65%', driver: '2.50% ECB Rate & Energy Inflation' },
    { code: 'CHF', name: 'Swiss Franc', score: -28, stance: 'NEUTRAL HOLD', yield10y: '0.47%', driver: '0.00% SNB Rate & Wide Yield Spread' },
    { code: 'JPY', name: 'Japanese Yen', score: -35, stance: 'GRADUAL HIKE', yield10y: '1.35%', driver: '1.25% BoJ Rate & Dec Hike Pricing' },
  ];"""

old_pairs = """  const pairs = [
    { pair: 'EUR/USD', netScore: -20 - dynamicUsdScore, spot: getSpotRate('EUR/USD'), strategy: 'Sell rallies into H1/H4 supply zones' },
    { pair: 'GBP/USD', netScore: 15 - dynamicUsdScore, spot: getSpotRate('GBP/USD'), strategy: 'Look for short continuation setups' },
    { pair: 'USD/JPY', netScore: dynamicUsdScore - (-65), spot: getSpotRate('USD/JPY'), strategy: 'Buy pullbacks into 10Y yield support' },
    { pair: 'AUD/USD', netScore: 10 - dynamicUsdScore, spot: getSpotRate('AUD/USD'), strategy: 'Sell key structural resistance' },
    { pair: 'USD/CAD', netScore: dynamicUsdScore - (-15), spot: getSpotRate('USD/CAD'), strategy: 'Hold long positions above swing lows' },
    { pair: 'USD/CHF', netScore: dynamicUsdScore - (-30), spot: getSpotRate('USD/CHF'), strategy: 'Buy dips aligned with yield differential' },
    { pair: 'EUR/GBP', netScore: -20 - 15, spot: getSpotRate('EUR/GBP'), strategy: 'Fade breakout attempts into resistance' },
    { pair: 'GBP/JPY', netScore: 15 - (-65), spot: getSpotRate('GBP/JPY'), strategy: 'Buy dips; yield differential tailwind' },
  ].map((p) => ({ ...p, bias: getBiasLabel(p.netScore) }));"""

new_pairs = """  const pairs = [
    { pair: 'EUR/USD', netScore: -14 - dynamicUsdScore, spot: getSpotRate('EUR/USD'), strategy: 'Sell rallies into H1/H4 supply zones' },
    { pair: 'GBP/USD', netScore: 18 - dynamicUsdScore, spot: getSpotRate('GBP/USD'), strategy: 'Fade rallies; BoE hike offset by USD strength' },
    { pair: 'USD/JPY', netScore: dynamicUsdScore - (-35), spot: getSpotRate('USD/JPY'), strategy: 'Buy pullbacks into 10Y yield support' },
    { pair: 'AUD/USD', netScore: 24 - dynamicUsdScore, spot: getSpotRate('AUD/USD'), strategy: 'Range trade; RBA 4.85% carry cushions USD drag' },
    { pair: 'USD/CAD', netScore: dynamicUsdScore - (-8), spot: getSpotRate('USD/CAD'), strategy: 'Buy dips above H4 demand zones' },
    { pair: 'USD/CHF', netScore: dynamicUsdScore - (-28), spot: getSpotRate('USD/CHF'), strategy: 'Buy dips aligned with 430+ bps rate spread' },
    { pair: 'EUR/GBP', netScore: -14 - 18, spot: getSpotRate('EUR/GBP'), strategy: 'Sell rallies; BoE 4.00% vs ECB 2.50% spread' },
    { pair: 'GBP/JPY', netScore: 18 - (-35), spot: getSpotRate('GBP/JPY'), strategy: 'Buy dips; BoE hike widens carry advantage' },
  ].map((p) => ({ ...p, bias: getBiasLabel(p.netScore) }));"""

if old_section in code and old_pairs in code:
    code = code.replace(old_section, new_section).replace(old_pairs, new_pairs)
    with open(p, 'w') as f:
        f.write(code)
    print('Updated app/forex-pairs/page.tsx successfully.')
else:
    print('Warning: Could not match target sections in app/forex-pairs/page.tsx.')
