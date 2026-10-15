"use client";
import React, { useState, useEffect } from "react";
import { TasbeehItem } from "@/types/tasbeeh";
import { getStoredTasbeehs, saveStoredTasbeehs } from "@/utils/storage";
import CreateTasbeehModal from "@/components/CreateTasbeehModal";
import ActiveCounter from "@/components/ActiveCounter";
import TasbeehCard from "@/components/TasbeehCard";
import { Plus, BookOpen, Moon } from "lucide-react";

export default function Home() {
  const [tasbeehs, setTasbeehs] = useState<TasbeehItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

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
    setActiveId(newItem.id); // Automatically open the new tasbeeh
  };

  const handleUpdateCount = (id: string, newCount: number) => {
    const updated = tasbeehs.map((item) =>
      item.id === id ? { ...item, count: newCount } : item,
    );
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
  };

  const handleReset = (id: string) => {
    const updated = tasbeehs.map((item) =>
      item.id === id ? { ...item, count: 0 } : item,
    );
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this tasbeeh folder?")) {
      const updated = tasbeehs.filter((item) => item.id !== id);
      setTasbeehs(updated);
      saveStoredTasbeehs(updated);
      if (activeId === id) setActiveId(null);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-medium">
        Loading Ibadat App...
      </div>
    );
  }

  // If user selected a tasbeeh to recite, show active counter screen
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
    <main className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-emerald-500/20">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Moon size={20} />
              <span>Digital Tasbeeh & Ibadat Counter</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white">
              Your Recitation Folders
            </h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20"
          >
            <Plus size={20} />
            <span>New Tasbeeh</span>
          </button>
        </div>

        {/* Tasbeeh Cards Grid */}
        {tasbeehs.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-emerald-500/20">
            <BookOpen className="mx-auto text-emerald-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-white mb-2">
              No Tasbeeh Folders Found
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Create your first tasbeeh to start counting.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
            >
              Add Tasbeeh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasbeehs.map((item) => (
              <TasbeehCard
                key={item.id}
                item={item}
                onSelect={setActiveId}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Modal */}
        <CreateTasbeehModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreate}
        />
      </div>
    </main>
  );
}
