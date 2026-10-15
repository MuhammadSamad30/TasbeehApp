'use client';
import React, { useState } from 'react';
import { X, Sparkles, Plus } from 'lucide-react';

interface CreateTasbeehModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string) => void;
}

export default function CreateTasbeehModal({ isOpen, onClose, onCreate }: CreateTasbeehModalProps) {
  const [title, setTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate(title.trim());
    setTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl shadow-emerald-950/50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500" />
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-extrabold text-emerald-100">New Zikr Folder</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2 rounded-xl hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400/90 mb-2">
              Recitation Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Astaghfar, Durood Shareef, Kalima..."
              autoFocus
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-emerald-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 text-sm"
            >
              <Plus size={18} />
              <span>Create Folder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}