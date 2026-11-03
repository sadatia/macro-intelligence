'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();

      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setLastSynced(timeStr);
      
      // Refresh page components with fresh DB data
      router.refresh();
    } catch (err: any) {
      console.error('Manual sync error:', err);
      // Soft refresh page anyway in case background sync completed
      router.refresh();
      setLastSynced('Updated');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSync}
        disabled={loading}
        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
          loading
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400 cursor-not-allowed'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50'
        }`}
      >
        <svg
          className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : 'text-emerald-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {loading ? 'SYNCING...' : '⚡ SYNC MACRO DATA'}
      </button>

      {lastSynced && (
        <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
          Last: <strong className="text-emerald-400">{lastSynced}</strong>
        </span>
      )}
    </div>
  );
}
