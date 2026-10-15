'use client';
import React, { useEffect, useCallback } from 'react';
import { TasbeehItem } from '@/types/tasbeeh';
import { ArrowLeft, RotateCcw, Plus, Sparkles } from 'lucide-react';

interface ActiveCounterProps {
  tasbeeh: TasbeehItem;
  onUpdateCount: (id: string, newCount: number) => void;
  onReset: (id: string) => void;
  onBack: () => void;
}

export default function ActiveCounter({ tasbeeh, onUpdateCount, onReset, onBack }: ActiveCounterProps) {
  const handleIncrement = useCallback(() => {
    onUpdateCount(tasbeeh.id, tasbeeh.count + 1);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-teal-950 text-white flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Top Navigation */}
      <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition backdrop-blur-md text-emerald-200 border border-emerald-500/30"
        >
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm md:text-base">
          <Sparkles size={18} />
          <span>Ibadat Counter Session</span>
        </div>
      </div>

      {/* Center Counter Display */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 text-xs md:text-sm font-semibold tracking-wider border border-emerald-500/30 mb-4 uppercase">
          Active Tasbeeh Folder
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 text-emerald-100">
          {tasbeeh.title}
        </h1>
        <p className="text-emerald-300/70 text-xs md:text-sm mb-10">
          Press <kbd className="px-2 py-1 bg-white/10 rounded border border-emerald-500/30 text-emerald-200 font-mono text-xs">Enter</kbd> on your keyboard or tap the counter circle below
        </p>

        {/* Big Interactive Clickable Counter */}
        <div
          onClick={handleIncrement}
          className="relative group cursor-pointer w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 p-2 shadow-2xl shadow-emerald-900/60 hover:scale-105 active:scale-95 transition-transform duration-150 flex items-center justify-center border-4 border-emerald-400/30"
        >
          <div className="w-full h-full rounded-full bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center border border-emerald-500/30">
            <span className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400">
              {tasbeeh.count}
            </span>
            <span className="text-xs uppercase tracking-widest text-emerald-400/70 mt-2 font-bold">
              Tap to Count
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex items-center justify-center gap-4 max-w-md mx-auto w-full pb-4">
        <button
          onClick={() => onReset(tasbeeh.id)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 transition font-medium backdrop-blur-md text-sm"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
        <button
          onClick={handleIncrement}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 text-sm"
        >
          <Plus size={18} />
          <span>Count (+1)</span>
        </button>
      </div>
    </div>
  );
}