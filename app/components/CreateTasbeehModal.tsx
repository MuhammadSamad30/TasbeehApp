'use client';
import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-emerald-950/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-emerald-200 flex items-center gap-2">
            <PlusCircle className="text-emerald-400" size={24} />
            Add New Zikr / Tasbeeh
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-emerald-400/80 mb-2">
              What do you want to recite? (e.g. Astaghfar, Durood)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Astaghfar - Al-Azeem"
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-emerald-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-medium transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 text-sm"
            >
              Create Tasbeeh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}