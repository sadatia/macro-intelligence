'use client';

import React from 'react';

export interface ProviderItem {
  name: string;
  sourceType: string;
  status: 'ONLINE' | 'WARNING' | 'OFFLINE';
  latencyMs: number;
  lastSync: string;
  recordsIngested: number;
}

const PROVIDERS: ProviderItem[] = [
  { name: 'Federal Reserve FRED', sourceType: 'Official API', status: 'ONLINE', latencyMs: 142, lastSync: '10 mins ago', recordsIngested: 1420 },
  { name: 'Bureau of Labor Statistics (BLS)', sourceType: 'Official API', status: 'ONLINE', latencyMs: 210, lastSync: '25 mins ago', recordsIngested: 850 },
  { name: 'Bureau of Economic Analysis (BEA)', sourceType: 'Official API', status: 'ONLINE', latencyMs: 185, lastSync: '1 hour ago', recordsIngested: 430 },
  { name: 'ECB Data Portal', sourceType: 'SDMX REST API', status: 'ONLINE', latencyMs: 310, lastSync: '15 mins ago', recordsIngested: 960 },
  { name: 'Bank of Canada Valet API', sourceType: 'JSON API', status: 'ONLINE', latencyMs: 120, lastSync: '5 mins ago', recordsIngested: 310 },
  { name: 'Bank of Japan Statistics', sourceType: 'Official Download', status: 'WARNING', latencyMs: 890, lastSync: '4 hours ago', recordsIngested: 210 },
  { name: 'Consensus Forecast Adapter', sourceType: 'Calendar Fallback', status: 'ONLINE', latencyMs: 195, lastSync: '30 mins ago', recordsIngested: 150 },
];

export const ProviderHealthStatus: React.FC = () => {
  return (
    <div className="w-full max-w-6xl mx-auto bg-slate-950 p-6 rounded-xl border border-slate-800 font-mono shadow-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-200 tracking-wider uppercase">
          Data Pipeline & Provider Health
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-Time API Connection Latency and Data Quality Monitors
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
              <th className="p-3">PROVIDER NAME</th>
              <th className="p-3">SOURCE TYPE</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">LATENCY</th>
              <th className="p-3">LAST SYNC</th>
              <th className="p-3 text-right">RECORDS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {PROVIDERS.map((prov) => (
              <tr key={prov.name} className="hover:bg-slate-900/40 transition-colors">
                <td className="p-3 font-bold text-slate-200">{prov.name}</td>
                <td className="p-3 text-slate-400">{prov.sourceType}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                      prov.status === 'ONLINE'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {prov.status}
                  </span>
                </td>
                <td className="p-3 text-slate-300">{prov.latencyMs} ms</td>
                <td className="p-3 text-slate-400">{prov.lastSync}</td>
                <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                  {prov.recordsIngested}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
