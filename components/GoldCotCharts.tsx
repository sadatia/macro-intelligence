'use client';

import React from 'react';

interface OiDataItem {
  period: string;
  openInterest: number;
  netLongs: number;
}

interface CotChangeItem {
  week: string;
  longDelta: number;
  shortDelta: number;
}

interface GoldCotChartsProps {
  assetName?: string;
  themeColor?: string;
  badgeText?: string;
  oiData: OiDataItem[];
  cotChanges: CotChangeItem[];
}

export function GoldCotCharts({
  assetName = 'COMEX GOLD',
  themeColor = '#f59e0b',
  badgeText = 'INSTITUTIONAL POSITIONING',
  oiData,
  cotChanges,
}: GoldCotChartsProps) {
  // SVG Chart 3 dimensions
  const chart3Width = 800;
  const chart3Height = 220;
  const padding3 = { top: 30, right: 40, bottom: 30, left: 40 };

  const maxOi = Math.max(...oiData.map((d) => d.openInterest), 1) * 1.15;
  const maxNet = Math.max(...oiData.map((d) => d.netLongs), 1) * 1.25;

  // SVG Chart 4 dimensions (Single Bi-directional Column per Week)
  const chart4Width = 800;
  const chart4Height = 240;
  const padding4 = { top: 30, right: 40, bottom: 30, left: 40 };

  const maxDeltaVal = Math.max(
    ...cotChanges.map((d) => Math.max(Math.abs(d.longDelta), Math.abs(d.shortDelta))),
    1000
  ) * 1.2;

  const innerWidth4 = chart4Width - padding4.left - padding4.right;
  const innerHeight4 = chart4Height - padding4.top - padding4.bottom;
  const zeroY4 = padding4.top + innerHeight4 / 2;

  return (
    <div className="space-y-6 font-mono">
      {/* SECTION 3: OI VS NET POSITION */}
      <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              • 3. OI VS NET POSITION - CONVICTION OVERLAY ({assetName} 4-MONTH TREND)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {assetName} Futures Open Interest (Bar Chart, '000 Contracts) vs Speculator Net Longs (Line Chart, '000 Contracts)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300 uppercase tracking-wider w-fit">
            {badgeText}
          </span>
        </div>

        <div className="w-full overflow-x-auto pt-2">
          <svg viewBox={`0 0 ${chart3Width} ${chart3Height}`} className="w-full h-auto min-w-[600px] overflow-visible">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding3.top + (chart3Height - padding3.top - padding3.bottom) * (1 - ratio);
              const valOi = Math.round(maxOi * ratio);
              const valNet = Math.round(maxNet * ratio);
              return (
                <g key={i}>
                  <line x1={padding3.left} y1={y} x2={chart3Width - padding3.right} y2={y} stroke="#1e293b" strokeDasharray="3 3" strokeWidth="1" />
                  <text x={padding3.left - 8} y={y + 3} fill="#64748b" fontSize="10" textAnchor="end">
                    {valOi}
                  </text>
                  <text x={chart3Width - padding3.right + 8} y={y + 3} fill="#34d399" fontSize="10" textAnchor="start">
                    {valNet}
                  </text>
                </g>
              );
            })}

            {oiData.map((d, idx) => {
              const usableWidth = chart3Width - padding3.left - padding3.right;
              const colWidth = usableWidth / oiData.length;
              const x = padding3.left + idx * colWidth + colWidth / 2;
              const barWidth = Math.min(32, colWidth * 0.5);

              const barHeight = ((chart3Height - padding3.top - padding3.bottom) * d.openInterest) / maxOi;
              const barY = chart3Height - padding3.bottom - barHeight;

              const lineY = chart3Height - padding3.bottom - ((chart3Height - padding3.top - padding3.bottom) * d.netLongs) / maxNet;

              let nextLineY = lineY;
              let nextX = x;
              if (idx < oiData.length - 1) {
                const nextD = oiData[idx + 1];
                nextX = padding3.left + (idx + 1) * colWidth + colWidth / 2;
                nextLineY = chart3Height - padding3.bottom - ((chart3Height - padding3.top - padding3.bottom) * nextD.netLongs) / maxNet;
              }

              return (
                <g key={d.period}>
                  <rect
                    x={x - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={barHeight}
                    fill="#0284c7"
                    rx="2"
                    opacity="0.85"
                  />
                  {idx < oiData.length - 1 && (
                    <line x1={x} y1={lineY} x2={nextX} y2={nextLineY} stroke="#34d399" strokeWidth="2.5" />
                  )}
                  <circle cx={x} cy={lineY} r="4" fill="#34d399" stroke="#0b0e17" strokeWidth="2" />

                  <text x={x} y={chart3Height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
                    {d.period}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* SECTION 4: SINGLE BI-DIRECTIONAL CANDLE PER WEEK */}
      <div className="bg-[#0b0e17] border border-slate-800/80 rounded-xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: themeColor }}></span>
              • 4. HISTORICAL SPECULATOR POSITIONING (CFTC COT NON-COMMERCIAL)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Weekly {assetName} Contract Changes: Non-Commercial Longs Added (Above Zero) vs Shorts Added (Below Zero)
            </p>
          </div>
          <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 border border-slate-800 text-slate-300 uppercase tracking-wider w-fit">
            CFTC Friday Reporting Window
          </span>
        </div>

        {/* CHART 4 SVG */}
        <div className="w-full overflow-x-auto pt-2">
          <svg viewBox={`0 0 ${chart4Width} ${chart4Height}`} className="w-full h-auto min-w-[600px] overflow-visible">
            {/* Zero Axis Line */}
            <line
              x1={padding4.left}
              y1={zeroY4}
              x2={chart4Width - padding4.right}
              y2={zeroY4}
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Grid lines and y-axis labels */}
            {[-1, -0.5, 0, 0.5, 1].map((ratio) => {
              const y = zeroY4 - (innerHeight4 / 2) * ratio;
              const val = Math.round(maxDeltaVal * ratio);
              return (
                <g key={ratio}>
                  {ratio !== 0 && (
                    <line
                      x1={padding4.left}
                      y1={y}
                      x2={chart4Width - padding4.right}
                      y2={y}
                      stroke="#1e293b"
                      strokeDasharray="3 3"
                      strokeWidth="1"
                    />
                  )}
                  <text x={padding4.left - 8} y={y + 3} fill="#64748b" fontSize="10" textAnchor="end">
                    {val > 0 ? `+${val}` : val}
                  </text>
                </g>
              );
            })}

            {/* Single Centered Candle / Column per Week */}
            {cotChanges.map((d, idx) => {
              const colWidth = innerWidth4 / cotChanges.length;
              const x = padding4.left + idx * colWidth + colWidth / 2;
              const barWidth = Math.min(28, colWidth * 0.45);

              // Long Delta (Cyan - Above Zero)
              const longHeight = (Math.abs(d.longDelta) / maxDeltaVal) * (innerHeight4 / 2);
              const longY = zeroY4 - longHeight;

              // Short Delta (Pink - Below Zero)
              const shortHeight = (Math.abs(d.shortDelta) / maxDeltaVal) * (innerHeight4 / 2);

              return (
                <g key={d.week}>
                  {/* Long Delta Bar (Cyan - Upper Candle) */}
                  <rect
                    x={x - barWidth / 2}
                    y={longY}
                    width={barWidth}
                    height={Math.max(2, longHeight)}
                    fill="#38bdf8"
                    rx="2"
                  />

                  {/* Short Delta Bar (Pink - Lower Candle, exact same X position) */}
                  <rect
                    x={x - barWidth / 2}
                    y={zeroY4}
                    width={barWidth}
                    height={Math.max(2, shortHeight)}
                    fill="#f43f5e"
                    rx="2"
                  />

                  {/* X Axis Label */}
                  <text x={x} y={chart4Height - 8} fill="#94a3b8" fontSize="10" textAnchor="middle">
                    {d.week}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-2 text-[11px] font-mono border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#38bdf8] inline-block"></span>
            <span className="text-slate-300">Longs Added (+ Delta)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-[#f43f5e] inline-block"></span>
            <span className="text-slate-300">Shorts Added (- Delta)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
