'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { names } from '@/data/asma-ul-husna';
import './asma.css';

export default function AsmaExperience() {
  return (
    <main className="asma-page simple-asma-page">
      <header className="asma-header">
        <div className="header-inner">
          <Link href="/" className="brand-link"><span className="brand-mark">ن</span><span>Imaan</span></Link>
          <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to your practice</Link>
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
