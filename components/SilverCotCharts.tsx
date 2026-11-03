'use client';

import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

// Silver 4-Month Weekly Trend Data (OI vs Speculator Net Longs)
const silverOiNetData = [
  { week: 'May W1', openInterest: 138, netLong: 42 },
  { week: 'May W3', openInterest: 141, netLong: 44 },
  { week: 'Jun W1', openInterest: 139, netLong: 41 },
  { week: 'Jun W3', openInterest: 145, netLong: 48 },
  { week: 'Jul W1', openInterest: 152, netLong: 52 },
  { week: 'Jul W3', openInterest: 148, netLong: 49 },
  { week: 'Aug W1', openInterest: 155, netLong: 54 },
  { week: 'Aug W3', openInterest: 142, netLong: 48 },
];

// Silver Weekly CFTC Non-Commercial Contract Changes
const silverCotChangesData = [
  { date: 'Jul 11', longChange: 1.8, shortChange: -0.9 },
  { date: 'Jul 18', longChange: -0.5, shortChange: 1.2 },
  { date: 'Jul 25', longChange: 3.2, shortChange: -0.4 },
  { date: 'Aug 01', longChange: 1.1, shortChange: 0.3 },
  { date: 'Aug 08', longChange: -2.1, shortChange: 1.8 },
  { date: 'Aug 15', longChange: 2.9, shortChange: -1.1 },
  { date: 'Aug 22', longChange: 0.8, shortChange: -0.5 },
  { date: 'Aug 29', longChange: 1.4, shortChange: -0.2 },
];

export function SilverCotCharts() {
  return (
    <div className="space-y-8 font-sans">
      {/* SECTION 3: SILVER OI VS NET POSITION CHART */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
              <span className="h-2 w-2 bg-slate-300 rounded-full"></span>
              3. OI VS NET POSITION - CONVICTION OVERLAY (SILVER 4-MONTH TREND)
            </h2>
            <p className="text-xs text-slate-400">
              Silver Open Interest (Bar Chart, '000 Contracts) vs Speculator Net Longs (Line Chart, '000 Contracts)
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 font-bold">
            INDUSTRIAL RANGE CONSOLIDATION
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={silverOiNetData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="week" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="left" stroke="#94a3b8" tick={{ fontSize: 11 }} domain={[100, 200]} />
              <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} domain={[30, 80]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar yAxisId="left" dataKey="openInterest" name="Silver Open Interest (OI)" fill="#64748b" opacity={0.6} radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="netLong" name="Speculator Net Longs" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 4: SILVER CFTC COT CHANGES BAR CHART */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="text-lg font-bold text-emerald-400 font-mono flex items-center gap-2">
              <span className="h-2 w-2 bg-emerald-400 rounded-full"></span>
              4. HISTORICAL SPECULATOR POSITIONING (CFTC COT NON-COMMERCIAL)
            </h2>
            <p className="text-xs text-slate-400">
              Weekly Contract Changes: Non-Commercial Longs Added vs Shorts Added ('000 Contracts)
            </p>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-slate-800 px-3 py-1 rounded border border-slate-700">
            CFTC Friday Reporting Window
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={silverCotChangesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="longChange" name="Longs Added/Closed" fill="#34d399" radius={[4, 4, 0, 0]} />
              <Bar dataKey="shortChange" name="Shorts Added/Closed" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
