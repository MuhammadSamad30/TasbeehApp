'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { TasbeehItem } from '@/types/tasbeeh';
import { ArrowLeft, RotateCcw, Plus, Hand, Target, Moon, Sun } from 'lucide-react';

interface ActiveCounterProps {
  tasbeeh: TasbeehItem;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onUpdateCount: (id: string, count: number) => void;
  onReset: (id: string) => void;
  onBack: () => void;
}

export default function ActiveCounter({ tasbeeh, theme, onToggleTheme, onUpdateCount, onReset, onBack }: ActiveCounterProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const goal = Math.max(1, tasbeeh.goal ?? 1000);
  const count = Math.max(0, tasbeeh.count);
  const progress = Math.min((count / goal) * 100, 100);
  const complete = count >= goal;

  const handleIncrement = useCallback(() => {
    if (count >= goal) return;
    onUpdateCount(tasbeeh.id, count + 1);
    setIsAnimating(true);
    if (animationTimeout.current) clearTimeout(animationTimeout.current);
    animationTimeout.current = setTimeout(() => setIsAnimating(false), 150);
  }, [count, goal, onUpdateCount, tasbeeh.id]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const isTyping = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if (isTyping || event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
      if (event.key !== 'Enter') return;
      if (target.closest('button, a, [role="button"]')) return;
      event.preventDefault();
      handleIncrement();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleIncrement]);

  useEffect(() => () => {
    if (animationTimeout.current) clearTimeout(animationTimeout.current);
  }, []);

  return (
    <main className="min-h-screen select-none bg-[#f7f8f3] px-5 py-6 text-stone-900 sm:px-8 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col">
        <header className="flex items-center justify-between gap-4">
          <button type="button" onClick={onBack} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"><ArrowLeft size={17} aria-hidden="true" /> Dashboard</button>
          <div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 sm:flex"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-500" /> Recitation session</span><button type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">{theme === 'light' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}</button></div>
        </header>
        <section className="my-auto flex flex-col items-center py-8 text-center sm:py-12">
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner" aria-hidden="true"><Moon size={21} /></div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[.2em] text-emerald-800">A moment of remembrance</p>
          <h1 className="max-w-xl break-words text-3xl font-semibold tracking-tight sm:text-4xl">{tasbeeh.title}</h1>
          <div className="mt-7 w-full max-w-md rounded-2xl border border-stone-200 bg-white px-5 py-4 text-left shadow-sm sm:px-6">
            <div className="flex items-end justify-between gap-3"><div><p className="flex items-center gap-1.5 text-xs font-medium text-stone-500"><Target size={14} aria-hidden="true" /> Today&apos;s goal</p><p className="mt-1 text-sm font-semibold text-stone-800">{count.toLocaleString()} <span className="font-normal text-stone-400">of {goal.toLocaleString()}</span></p></div><span className="text-sm font-semibold text-emerald-800">{complete ? 'Complete' : `${Math.round(progress)}%`}</span></div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-stone-100" role="progressbar" aria-label={`${tasbeeh.title} goal progress`} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(count, goal)}><div className="h-full rounded-full bg-emerald-600 transition-all duration-300" style={{ width: `${progress}%` }} /></div>
            <p className="mt-2 text-xs text-stone-500" aria-live="polite">{complete ? 'Beautiful work. Create a new recitation to keep counting.' : `${(goal - count).toLocaleString()} repetitions to reach your intention`}</p>
          </div>
          <button type="button" onClick={handleIncrement} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!event.repeat) handleIncrement(); } }} disabled={complete} aria-label={complete ? 'Goal complete; create a new recitation to continue' : 'Add one recitation'} className={`group relative mt-7 grid h-64 w-64 touch-manipulation place-items-center rounded-full border-[10px] border-white bg-[#153c30] text-white shadow-[0_18px_60px_-18px_rgba(21,60,48,.42)] ring-1 ring-emerald-900/10 transition duration-150 hover:shadow-[0_22px_70px_-18px_rgba(21,60,48,.5)] focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-emerald-700 active:scale-[.97] motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-80 sm:h-72 sm:w-72 ${isAnimating ? 'scale-[.97]' : 'hover:scale-[1.015]'}`}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-full border border-white/15" />
            <span aria-live="polite" aria-atomic="true" className="flex flex-col items-center"><Hand size={20} aria-hidden="true" className="mb-3 text-emerald-200/80 transition group-hover:-translate-y-1" /><span className="text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl">{count.toLocaleString()}</span><span className="mt-2 text-[10px] font-semibold uppercase tracking-[.22em] text-emerald-100/75">Tap to count</span></span>
          </button>
          <p className="mt-5 text-xs text-stone-400">{complete ? 'Goal complete. Create a new recitation to continue.' : <>Tap once for each recitation, or press <kbd className="rounded-md border border-stone-200 bg-white px-1.5 py-0.5 font-mono text-stone-600">Enter</kbd></>}</p>
        </section>
        <footer className="flex items-center justify-center gap-3">
          <button type="button" onClick={() => onReset(tasbeeh.id)} disabled={count === 0 || complete} className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-600 transition hover:border-rose-200 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700 disabled:cursor-not-allowed disabled:opacity-50"><RotateCcw size={16} aria-hidden="true" /> Reset</button>
          <button type="button" onClick={handleIncrement} disabled={complete} className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} aria-hidden="true" /> Count</button>
        </footer>
      </div>
    </main>
  );
}
