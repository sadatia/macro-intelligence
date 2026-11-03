'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/' },
    { name: 'Gold', href: '/xauusd' },
    { name: 'Silver', href: '/xagusd' },
    { name: 'BTC', href: '/btc' },
    { name: 'S&P 500', href: '/spx' },
    { name: 'Forex Pairs', href: '/forex-pairs' },
    { name: 'Central Banks', href: '/central-banks' },
    { name: 'Trump Tracker', href: '/trump-tracker' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Guide', href: '/guide' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#06080d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-3 h-3 rounded-sm bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <span className="text-base font-bold tracking-widest text-white group-hover:text-emerald-400 transition">
              USD MACRO
            </span>
          </Link>
          <div className="flex items-center gap-2 bg-[#0b0f19] px-2.5 py-1 rounded-full border border-slate-800 text-[10px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-400 tracking-wider">OPERATIONAL</span>
          </div>
        </div>

        <nav className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
