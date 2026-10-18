'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Plus, Sparkles, Target, X } from 'lucide-react';

interface CreateTasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, goal: number) => void;
}

export default function CreateTasbeehModal({ isOpen, onClose, onCreate }: CreateTasbeehModalProps) {
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('100');
  const titleInput = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const parsedGoal = Number(goal);
  const validGoal = Number.isSafeInteger(parsedGoal) && parsedGoal > 0;

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    titleInput.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled])') ?? [];
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      previousFocus.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || !validGoal) return;
    onCreate(cleanTitle, parsedGoal);
    setTitle('');
    setGoal('100');
    onClose();
  };

  const handleGoalKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.'].includes(event.key)) event.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="create-title" className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-stone-200 bg-[#fbfcf8] p-6 text-stone-900 shadow-[0_24px_80px_-24px_rgba(20,40,30,.38)] outline-none sm:p-7">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-emerald-800" />
        <div className="mb-6 flex items-start justify-between gap-3"><div className="flex gap-3"><span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-800"><Sparkles size={20} /></span><div><h2 id="create-title" className="text-xl font-semibold tracking-tight">New recitation</h2><p className="mt-1 text-sm text-stone-500">Set an intention for your practice.</p></div></div><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"><X size={18} aria-hidden="true" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label htmlFor="recitation-title" className="mb-2 block text-sm font-semibold text-stone-700">Recitation name</label><input ref={titleInput} id="recitation-title" type="text" autoComplete="off" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Astaghfar or Durood" required maxLength={60} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" /></div>
          <div><label htmlFor="recitation-goal" className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-700"><Target size={15} aria-hidden="true" className="text-emerald-800" /> Recitation goal</label><input id="recitation-goal" type="number" inputMode="numeric" min="1" max={Number.MAX_SAFE_INTEGER} step="1" required value={goal} onKeyDown={handleGoalKeyDown} onChange={(event) => setGoal(event.target.value)} aria-describedby="goal-help" aria-invalid={goal !== '' && !validGoal} className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-700 focus:ring-4 focus:ring-emerald-700/10" /><p id="goal-help" className="mt-2 text-xs text-stone-500">Choose a whole number that feels right for you.</p></div>
          <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700">Cancel</button><button type="submit" disabled={!title.trim() || !validGoal} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><Plus size={17} aria-hidden="true" /> Create recitation</button></div>
        </form>
      </section>
    </div>
  );
}
