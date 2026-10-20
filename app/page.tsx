"use client";
import React, { useState, useEffect } from "react";
import { TasbeehItem } from "@/types/tasbeeh";
import { getStoredTasbeehs, saveStoredTasbeehs } from "@/utils/storage";
import CreateTasbeehModal from "@/components/CreateTasbeehModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ActiveCounter from "@/components/ActiveCounter";
import TasbeehCard from "@/components/TasbeehCard";
import { useTheme } from "@/components/ThemeProvider";
import { Plus, BookOpen, MoonStar, Sparkles, Sun, Moon } from "lucide-react";

const ACTIVE_TASBEEH_STORAGE_KEY = "tasbeeh-active-id-v1";

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [tasbeehs, setTasbeehs] = useState<TasbeehItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deletingItem, setDeletingItem] = useState<TasbeehItem | null>(null);
  const [editingItem, setEditingItem] = useState<TasbeehItem | null>(null);

  // Hydrate browser-only saved settings after the initial render.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const storedTasbeehs = getStoredTasbeehs();
    setTasbeehs(storedTasbeehs);
    const savedActiveId = localStorage.getItem(ACTIVE_TASBEEH_STORAGE_KEY);
    if (
      savedActiveId &&
      storedTasbeehs.some((item) => item.id === savedActiveId)
    )
      setActiveId(savedActiveId);
    setIsLoaded(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const selectTasbeeh = (id: string) => {
    setActiveId(id);
    try {
      localStorage.setItem(ACTIVE_TASBEEH_STORAGE_KEY, id);
    } catch {
      /* The counter still works if storage is unavailable. */
    }
  };
  const leaveActiveTasbeeh = () => {
    setActiveId(null);
    try {
      localStorage.removeItem(ACTIVE_TASBEEH_STORAGE_KEY);
    } catch {
      /* The dashboard remains available if storage is unavailable. */
    }
  };
  const persist = (updated: TasbeehItem[]) => {
    setTasbeehs(updated);
    saveStoredTasbeehs(updated);
  };
  const handleCreate = (title: string, goal: number) => {
    const newItem: TasbeehItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title,
      count: 0,
      goal,
      createdAt: new Date().toISOString(),
    };
    persist([newItem, ...tasbeehs]);
    selectTasbeeh(newItem.id);
  };
  const handleUpdateCount = (id: string, count: number) =>
    persist(
      tasbeehs.map((item) =>
        item.id === id
          ? { ...item, count: Math.min(count, item.goal ?? 1000) }
          : item,
      ),
    );
  const handleUpdateGoal = (id: string, goal: number) => {
    persist(
      tasbeehs.map((item) => (item.id === id ? { ...item, goal } : item)),
    );
    setEditingItem(null);
  };
  const handleReset = (id: string) =>
    persist(
      tasbeehs.map((item) => (item.id === id ? { ...item, count: 0 } : item)),
    );
  const handleDeleteRequest = (item: TasbeehItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingItem(item);
  };
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    persist(tasbeehs.filter((item) => item.id !== deletingItem.id));
    if (activeId === deletingItem.id) leaveActiveTasbeeh();
    setDeletingItem(null);
  };

  if (!isLoaded)
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f3] text-emerald-800">
        <div className="animate-pulse">Preparing your quiet space…</div>
      </main>
    );
  const activeTasbeeh = tasbeehs.find((item) => item.id === activeId);
  if (activeTasbeeh)
    return (
      <ActiveCounter
        tasbeeh={activeTasbeeh}
        theme={theme}
        onToggleTheme={toggleTheme}
        onUpdateCount={handleUpdateCount}
        onReset={handleReset}
        onBack={leaveActiveTasbeeh}
      />
    );

  const totalCount = tasbeehs.reduce((sum, item) => sum + item.count, 0);
  const completeCount = tasbeehs.filter(
    (item) => item.count >= (item.goal ?? 1000),
  ).length;
  return (
    <main className="min-h-screen bg-[#f7f8f3] text-stone-900">
      <header className="border-b border-stone-200/80 bg-[#fbfcf8]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
          <a href="#home" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-800 text-white">
              <MoonStar size={20} />
            </span>
            <span className="text-lg font-semibold tracking-tight">Imaan</span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/asma-ul-husna"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-800 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
            >
              <BookOpen size={16} />
              <span>Learn the 99 Names</span>
            </a>
            <span className="hidden items-center gap-2 text-sm text-stone-500 lg:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> A little
              remembrance, every day
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              aria-pressed={theme === "dark"}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-semibold text-stone-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <span
                className="grid h-5 w-5 place-items-center"
                aria-hidden="true"
              >
                {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
              </span>
              <span className="hidden sm:inline">
                {theme === "light" ? "Dark mode" : "Light mode"}
              </span>
            </button>
          </div>
        </div>
      </header>
      <div
        id="home"
        className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14"
      >
        <section className="relative overflow-hidden rounded-[2rem] bg-[#153c30] px-7 py-9 text-white sm:px-11 sm:py-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-56 w-56 rounded-full border border-white/10" />
          <div className="relative max-w-xl">
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-emerald-200">
              <Sparkles size={16} /> YOUR PERSONAL PRACTICE
            </p>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
              Make space for what matters.
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-6 text-emerald-100/75 sm:text-base">
              Set a gentle intention, settle into your rhythm, and watch each
              recitation bring you closer to your goal.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#e7c77c] px-5 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-[#f0d894]"
            >
              <Plus size={18} /> Begin a recitation
            </button>
          </div>
          <div className="relative mt-10 grid max-w-lg grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:absolute sm:bottom-10 sm:right-10 sm:mt-0 sm:w-[380px] sm:border-0 sm:pt-0">
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {tasbeehs.length}
              </p>
              <p className="mt-1 text-xs text-emerald-100/65">Practices</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {totalCount.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-emerald-100/65">Recitations</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tabular-nums">
                {completeCount}
              </p>
              <p className="mt-1 text-xs text-emerald-100/65">Goals reached</p>
            </div>
          </div>
        </section>
        <section className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[.18em] text-emerald-800">
                Your intentions
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Recitations
              </h2>
            </div>
            {tasbeehs.length > 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50"
              >
                <Plus size={16} /> Add new
              </button>
            )}
          </div>
          {tasbeehs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
                <BookOpen size={25} />
              </span>
              <h3 className="mt-5 text-lg font-semibold">
                Start with an intention
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
                Create a recitation, choose a goal that feels right, and begin
                whenever you’re ready.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-5 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Create your first recitation
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {tasbeehs.map((item) => (
                <TasbeehCard
                  key={item.id}
                  item={item}
                  onSelect={selectTasbeeh}
                  onDeleteRequest={handleDeleteRequest}
                  onEditGoal={setEditingItem}
                />
              ))}
            </div>
          )}
        </section>
        <footer className="mt-12 border-t border-stone-200 pt-5 text-center text-xs text-stone-400">
          A quiet moment, at your own pace.
        </footer>
        <CreateTasbeehModal
          key={editingItem?.id ?? (isModalOpen ? "create-open" : "closed")}
          isOpen={isModalOpen || !!editingItem}
          editingItem={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onCreate={handleCreate}
          onUpdateGoal={handleUpdateGoal}
        />
        <DeleteConfirmModal
          isOpen={!!deletingItem}
          itemTitle={deletingItem?.title || ""}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </main>
  );
}
