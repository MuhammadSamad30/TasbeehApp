'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  itemTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ isOpen, itemTitle, onClose, onConfirm }: DeleteConfirmModalProps) {
  const dialogRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      if (event.key !== 'Tab') return;
      const controls = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? [];
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/35 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} tabIndex={-1} role="alertdialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description" className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-stone-200 bg-[#fbfcf8] p-6 text-stone-900 shadow-[0_24px_80px_-24px_rgba(20,40,30,.38)] outline-none sm:p-7">
        <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-rose-50 text-rose-700"><AlertTriangle size={20} /></span><div><h2 id="delete-title" className="text-xl font-semibold tracking-tight">Delete recitation?</h2><p className="mt-1 text-sm text-stone-500">This action can&apos;t be undone.</p></div></div><button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-xl p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700"><X size={18} aria-hidden="true" /></button></div>
        <p id="delete-description" className="my-6 rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-600">You&apos;re about to remove <span className="break-words font-semibold text-stone-900">{itemTitle}</span> and its saved count.</p>
        <div className="flex flex-col-reverse gap-2 border-t border-stone-100 pt-5 sm:flex-row sm:justify-end"><button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-700">Keep recitation</button><button type="button" onClick={onConfirm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"><Trash2 size={16} aria-hidden="true" /> Delete</button></div>
      </section>
    </div>
  );
}
