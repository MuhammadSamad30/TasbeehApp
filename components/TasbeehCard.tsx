'use client';
import React from 'react';
import { TasbeehItem } from '@/types/tasbeeh';
import { Trash2, ChevronRight, Hash, Play } from 'lucide-react';

interface TasbeehCardProps {
  item: TasbeehItem;
  onSelect: (id: string) => void;
  onDeleteRequest: (item: TasbeehItem, e: React.MouseEvent) => void;
}

export default function TasbeehCard({ item, onSelect, onDeleteRequest }: TasbeehCardProps) {
  return (
    <div
      onClick={() => onSelect(item.id)}
      className="group relative bg-gradient-to-b from-slate-900/90 to-slate-900/40 hover:from-slate-900 hover:to-slate-800/80 border border-emerald-500/20 hover:border-emerald-400/50 rounded-3xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-950/50 flex flex-col justify-between hover:-translate-y-1.5 overflow-hidden"
    >
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all duration-500 pointer-events-none" />

      <div>
        {/* Header inside Card */}
        <div className="flex items-start justify-between mb-4">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wider border border-emerald-500/20">
            <Hash size={12} />
            Folder
          </span>
          <button
            onClick={(e) => onDeleteRequest(item, e)}
            className="text-slate-500 hover:text-rose-400 transition p-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
            title="Delete Tasbeeh"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-emerald-50 group-hover:text-emerald-300 transition line-clamp-2 leading-snug">
          {item.title}
        </h2>
      </div>

      {/* Bottom Counter & Action */}
      <div className="flex items-end justify-between pt-6 mt-6 border-t border-emerald-500/10">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-slate-400 block mb-1 font-medium">
            Total Count
          </span>
          <span className="text-4xl font-black text-white group-hover:text-emerald-200 transition font-mono">
            {item.count.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 group-hover:bg-emerald-400 text-emerald-400 group-hover:text-slate-950 font-bold text-xs transition-all duration-300 border border-emerald-500/20 group-hover:border-emerald-400">
          <span>Start Reciting</span>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}