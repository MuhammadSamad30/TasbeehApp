'use client';
import React from 'react';
import { TasbeehItem } from '@/types/tasbeeh';
import { Trash2, ChevronRight, Hash } from 'lucide-react';

interface TasbeehCardProps {
  item: TasbeehItem;
  onSelect: (id: string) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export default function TasbeehCard({ item, onSelect, onDelete }: TasbeehCardProps) {
  return (
    <div
      onClick={() => onSelect(item.id)}
      className="group relative bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/20 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-emerald-950/40 flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Top Header inside Card */}
        <div className="flex items-start justify-between mb-4">
          <span className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
            <Hash size={12} />
            Folder
          </span>
          <button
            onClick={(e) => onDelete(item.id, e)}
            className="text-slate-500 hover:text-rose-400 transition p-1.5 rounded-lg hover:bg-rose-500/10"
            title="Delete Tasbeeh Folder"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-emerald-100 mb-1 group-hover:text-emerald-400 transition line-clamp-2">
          {item.title}
        </h2>
      </div>

      {/* Bottom Counter & Action */}
      <div className="flex items-end justify-between pt-6 mt-4 border-t border-white/5">
        <div>
          <span className="text-xs text-slate-400 block mb-0.5">Total Count</span>
          <span className="text-3xl font-black text-white group-hover:text-emerald-300 transition">
            {item.count}
          </span>
        </div>
        
        <div className="flex items-center gap-1 text-emerald-400 font-semibold text-sm group-hover:translate-x-1 transition-transform">
          <span>Start Reciting</span>
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
}