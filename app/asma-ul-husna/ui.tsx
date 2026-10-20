'use client';
/* eslint-disable @next/next/no-html-link-for-pages -- Full document navigation lets the service worker serve cached routes offline. */

import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { names } from '@/data/asma-ul-husna';
import { useTheme } from '@/components/ThemeProvider';
import './asma.css';

export default function AsmaExperience() {
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="asma-page simple-asma-page">
      <header className="asma-header">
        <div className="header-inner">
          <a href="/" className="brand-link"><span className="brand-mark">ن</span><span>Imaan</span></a>
          <div className="simple-asma-header-actions">
            <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} aria-pressed={theme === 'dark'} className="simple-asma-theme-toggle">
              {theme === 'light' ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}
              <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>
            <a href="/" className="back-link"><ArrowLeft size={16} /> Back to your practice</a>
          </div>
        </div>
      </header>
      <div className="simple-asma-shell">
        <section className="simple-asma-heading">
          <p lang="ar" dir="rtl" className="simple-asma-arabic">أسماء الله الحسنى</p>
          <h1>Asma-ul-Husna</h1>
          <p>The 99 Beautiful Names of Allah</p>
        </section>
        <ol className="simple-asma-list">
          {names.map((name) => (
            <li className="simple-asma-card" key={name.id}>
              <span className="simple-asma-number">{String(name.number).padStart(2, '0')}</span>
              <p lang="ar" dir="rtl" className="simple-asma-name">{name.arabic}</p>
              <h2>{name.transliteration}</h2>
              <p className="simple-asma-meaning">{name.meaning}</p>
            </li>
          ))}
        </ol>
        <footer className="simple-asma-footer">Take your time and read at your own pace.</footer>
      </div>
    </main>
  );
}
