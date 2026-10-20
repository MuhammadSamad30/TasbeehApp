'use client';

import { Check, ArrowUpRight, Target, Trash2, Pencil } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { TasbeehItem } from '@/types/tasbeeh';

interface TasbeehCardProps {
  item: TasbeehItem;
  onSelect: (id: string) => void;
  onDeleteRequest: (item: TasbeehItem, event: MouseEvent<HTMLButtonElement>) => void;
  onEditGoal: (item: TasbeehItem) => void;
}

export default function TasbeehCard({ item, onSelect, onDeleteRequest, onEditGoal }: TasbeehCardProps) {
  const goal = Math.max(1, item.goal ?? 1000);
  const count = Math.max(0, item.count);
  const progress = Math.min((count / goal) * 100, 100);
  const complete = count >= goal;

  return (
    <article className="group rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(46,70,54,.28)] transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg sm:p-6">
      <header className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600" /> Recitation
        </span>
        <div className="flex items-center gap-1"><button type="button" onClick={() => onEditGoal(item)} className="rounded-xl p-2 text-stone-400 transition hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700" title="Edit goal" aria-label={`Edit goal for ${item.title}`}><Pencil size={16} aria-hidden="true" /></button><button type="button" onClick={(event) => onDeleteRequest(item, event)} className="rounded-xl p-2 text-stone-400 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700" title="Delete recitation" aria-label={`Delete ${item.title}`}><Trash2 size={17} aria-hidden="true" /></button></div>
      </header>
      <h2 className="mt-5 break-words text-xl font-semibold tracking-tight text-stone-900">{item.title}</h2>
      <div className="mt-6 flex items-end justify-between gap-3">
        <div><p className="text-xs font-medium text-stone-500">Your progress</p><p className="mt-1 text-3xl font-semibold tabular-nums text-stone-900">{count.toLocaleString()}<span className="ml-1 text-base font-normal text-stone-400">/ {goal.toLocaleString()}</span></p></div>
        <span className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${complete ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'}`}>
          {complete ? <><Check size={13} className="mr-1 inline" aria-hidden="true" /> Goal reached</> : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-stone-100" role="progressbar" aria-label={`${item.title} goal progress`} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(count, goal)}>
        <div className="h-full rounded-full bg-emerald-700 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <footer className="mt-5 flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
        <span className="flex items-center gap-1.5 text-xs text-stone-500 sm:text-sm"><Target size={15} aria-hidden="true" /> Daily intention</span>
        <button type="button" onClick={() => onSelect(item.id)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 group-hover:gap-2">Continue <ArrowUpRight size={15} aria-hidden="true" /></button>
      </footer>
    </article>
  );
}
