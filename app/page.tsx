'use client';
import React, { useState, useEffect } from 'react';
import { TasbeehItem } from '@/types/tasbeeh';
import { getStoredTasbeehs, saveStoredTasbeehs } from '@/utils/storage';
import CreateTasbeehModal from '@/components/CreateTasbeehModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import ActiveCounter from '@/components/ActiveCounter';
import TasbeehCard from '@/components/TasbeehCard';
import { Plus, BookOpen, Moon, Sparkles } from 'lucide-react';

export default function Home() {
  const [tasbeehs, setTasbeehs] = useState<TasbeehItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Custom Delete Modal State
  const [deletingItem, setDeletingItem] = useState<TasbeehItem | null>(null);

  useEffect(() => {
    const loaded = getStoredTasbeehs();
    setTasbeehs(loaded);
    setIsLoaded(true);
  }, []);

  const handleCreate = (title: string) => {
    const newItem: TasbeehItem = {
      id: Date.now().toString(),
      title,
      count: 0,
      createdAt: new Date().toISOString(),
    };
    const updated = [newItem, ...tasbeehs];
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
    setActiveId(newItem.id);
  };

  const handleUpdateCount = (id: string, newCount: number) => {
    const updated = tasbeehs.map((item) => (item.id === id ? { ...item, count: newCount } : item));
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
  };

  const handleReset = (id: string) => {
    const updated = tasbeehs.map((item) => (item.id === id ? { ...item, count: 0 } : item));
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
  };

  const handleDeleteRequest = (item: TasbeehItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingItem(item);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const updated = tasbeehs.filter((item) => item.id !== deletingItem.id);
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
    if (activeId === deletingItem.id) setActiveId(null);
    setDeletingItem(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-emerald-400 gap-3 font-medium">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        <span>Loading Ibadat App...</span>
      </div>
    );
  }

  const activeTasbeeh = tasbeehs.find((t) => t.id === activeId);
  if (activeTasbeeh) {
    return (
      <ActiveCounter
        tasbeeh={activeTasbeeh}
        onUpdateCount={handleUpdateCount}
        onReset={handleReset}
        onBack={() => setActiveId(null)}
      />
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12 relative overflow-hidden">
      {/* Glow Effects Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-emerald-500/15">
          <div>
            <div className="inline-flex items-center gap-2 px-3 sm py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs mb-3">
              <Moon size={14} />
              <span>Digital Tasbeeh & Ibadat Counter</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Your Recitation Folders
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold transition shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={20} />
            <span>New Tasbeeh</span>
          </button>
        </div>

        {/* Tasbeeh Cards Grid */}
        {tasbeehs.length === 0 ? (
          <div className="text-center py-24 bg-slate-900/40 rounded-3xl border border-dashed border-emerald-500/20 backdrop-blur-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Recitations Found</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Create your first tasbeeh folder like Astaghfar or Durood to start counting.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
            >
              Add Tasbeeh Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasbeehs.map((item) => (
              <TasbeehCard
                key={item.id}
                item={item}
                onSelect={setActiveId}
                onDeleteRequest={handleDeleteRequest}
              />
            ))}
          </div>
        )}

        {/* Modals */}
        <CreateTasbeehModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />

        <DeleteConfirmModal
          isOpen={!!deletingItem}
          itemTitle={deletingItem?.title || ''}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  );
}