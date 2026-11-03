'use client';

import { useState, useEffect } from 'react';

interface EventCountdownProps {
  targetDate: string;
  eventName: string;
}

export default function EventCountdown({ targetDate }: EventCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculateTimeLeft() {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 px-5 py-3 rounded-xl shadow-inner font-mono">
      <div className="text-center">
        <span className="text-2xl font-bold text-emerald-400 block">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase">Days</span>
      </div>
      <span className="text-slate-700 text-lg font-bold">:</span>
      <div className="text-center">
        <span className="text-2xl font-bold text-emerald-400 block">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase">Hours</span>
      </div>
      <span className="text-slate-700 text-lg font-bold">:</span>
      <div className="text-center">
        <span className="text-2xl font-bold text-emerald-400 block">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase">Mins</span>
      </div>
      <span className="text-slate-700 text-lg font-bold">:</span>
      <div className="text-center">
        <span className="text-2xl font-bold text-amber-400 block animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[9px] text-slate-500 font-bold uppercase">Secs</span>
      </div>
    </div>
  );
}
