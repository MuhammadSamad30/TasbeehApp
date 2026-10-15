'use client';
import React, { useEffect, useCallback, useState } from 'react';
import { TasbeehItem } from '@/types/tasbeeh';
import { ArrowLeft, RotateCcw, Plus, Sparkles, Hand } from 'lucide-react';

interface ActiveCounterProps {
  tasbeeh: TasbeehItem;
  onUpdateCount: (id: string, newCount: number) => void;
  onReset: (id: string) => void;
  onBack: () => void;
}

export default function ActiveCounter({ tasbeeh, onUpdateCount, onReset, onBack }: ActiveCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleIncrement = useCallback(() => {
    onUpdateCount(tasbeeh.id, tasbeeh.count + 1);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);
  }, [tasbeeh, onUpdateCount]);

  // Listen for Enter key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleIncrement]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6 md:p-12 select-none relative overflow-hidden">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <div className="relative z-10 flex items-center justify-between max-w-3xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 transition backdrop-blur-md text-emerald-300 border border-emerald-500/30 shadow-lg shadow-emerald-950/20"
        >
          <ArrowLeft size={18} />
          <span className="font-semibold text-sm">Dashboard</span>
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 font-medium text-xs sm:text-sm border border-emerald-500/20 backdrop-blur-md">
          <Sparkles size={16} />
          <span>Active Recitation Session</span>
        </div>
      </div>

      {/* Center Counter Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center py-6">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight mb-3 text-emerald-100 max-w-xl leading-tight">
          {tasbeeh.title}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-10 flex items-center gap-1.5 bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800">
          <span>Press</span>
          <kbd className="px-2 py-0.5 bg-emerald-500/20 rounded border border-emerald-500/40 text-emerald-200 font-mono text-xs font-bold">
            Enter
          </kbd>
          <span>on keyboard or tap the orb below</span>
        </p>

        {/* Big Interactive Clickable Counter Orb */}
        <div
          onClick={handleIncrement}
          className={`relative group cursor-pointer w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-1.5 shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-500/20 transition-all duration-200 flex items-center justify-center border-4 border-emerald-400/30 ${
            isAnimating ? 'scale-95' : 'hover:scale-[1.02]'
          }`}
        >
          <div className="w-full h-full rounded-full bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center border border-emerald-500/30 relative overflow-hidden">
            {/* Subtle inner ring highlight */}
            <div className="absolute inset-4 rounded-full border border-emerald-500/10 pointer-events-none" />
            
            <Hand size={24} className="text-emerald-400/60 mb-2 animate-bounce" />
            <span className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400 font-mono">
              {tasbeeh.count.toLocaleString()}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-emerald-400/80 mt-2 font-extrabold">
              Tap To Count
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="relative z-10 flex items-center justify-center gap-4 max-w-md mx-auto w-full pt-2">
        <button
          onClick={() => onReset(tasbeeh.id)}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 transition font-semibold backdrop-blur-md text-sm"
        >
          <RotateCcw size={16} />
          <span>Reset Count</span>
        </button>
        <button
          onClick={handleIncrement}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold transition shadow-xl shadow-emerald-500/20 text-sm active:scale-95"
        >
          <Plus size={18} />
          <span>Count (+1)</span>
        </button>
      </div>
    </div>
  );
}