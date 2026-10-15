'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import { useCms } from '../lib/cms';

function validateEmail(v: string): string | null {
  if (!v.trim()) return 'Please enter your email address.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return 'Please enter a valid email address.';
  return null;
}

export function NewsletterForm() {
  const { project: PROJECT } = useCms();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    setError(err);
    if (err) return;
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="border border-ivory/20 bg-ivory/10 px-5 py-4 text-sm leading-relaxed text-ivory">
        <p className="font-semibold">Thank you — you’re on the list.</p>
        <p className="mt-1 opacity-70">
          Demo only: no email was sent or stored. Call us directly for project updates.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Project updates signup">
      <label htmlFor="newsletter-email" className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory/60">
        Project updates &amp; new releases
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(null);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'newsletter-error' : undefined}
          className="field-dark flex-1"
        />
        <button type="submit" className="btn bg-gold px-6 py-3.5 text-navy-deep hover:bg-gold-light">
          Notify me
        </button>
      </div>
      {error ? (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm text-red-200">
          {error}
        </p>
      ) : (
        <p className="mt-2 text-[13px] text-ivory/65">Demo only — or call {PROJECT.phones[0].display} for instant updates.</p>
      )}
    </form>
  );
}

export default function Footer() {
  const { project: PROJECT } = useCms();
  return (
    <footer className="bg-navy-deep text-ivory" aria-label="Footer">
      <div className="gold-rule" aria-hidden />
      <div className="mx-auto max-w-shell px-5 pb-10 pt-16 md:px-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr]">
          <div>
            <p className="flex items-center gap-3">
              <span aria-hidden className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold font-display text-[15px] font-semibold text-navy-deep">
                SA
              </span>
              <span className="leading-none">
                <span className="block font-display text-[19px] font-semibold tracking-[0.08em]">SHRI AARADHYA SAI</span>
                <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Property · The Name of Trust</span>
              </span>
            </p>
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-ivory/65">
              RERA-approved premium residential plots at {PROJECT.location}. {PROJECT.heroOffer} —{' '}
              {PROJECT.invite}
            </p>
            <div className="mt-6 space-y-2">
              {PROJECT.phones.map((p) => (
                <a key={p.display} href={p.href} className="flex items-center gap-2 text-lg font-bold text-gold-light hover:text-ivory">
                  <Phone size={17} aria-hidden /> {p.display}
                </a>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={PROJECT.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-ivory/25 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory/80 transition hover:border-gold hover:text-gold-light"
              >
                IG — Instagram <ArrowUpRight size={13} aria-hidden />
              </a>
              <a
                href={PROJECT.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 border border-ivory/25 px-4 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory/80 transition hover:border-gold hover:text-gold-light"
              >
                <MapPin size={13} aria-hidden /> Live location
              </a>
            </div>
          </div>

          <nav aria-label="Explore">
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-ivory/65">Explore</p>
            <ul className="mt-5 space-y-3 text-[15px]">
              {[
                ['/plots', 'Plots & sizes'],
                ['/gallery', 'Gallery'],
                ['/location', 'Location'],
                ['/about', 'About SASP'],
                ['/contact', 'Contact'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link href={to} className="u-link text-ivory/80 hover:text-ivory">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-ivory/65">Project</p>
            <address className="mt-5 space-y-3 text-[15px] not-italic leading-relaxed text-ivory/80">
              <p className="flex items-start gap-2">
                <MapPin size={16} aria-hidden className="mt-1 shrink-0 text-gold" />
                <span>
                  Surya Greens, Santer,
                  <br />
                  Kishanganj – Mhow (MP)
                </span>
              </p>
              <p>
                Marketed by:
                <br />
                <strong className="text-ivory">{PROJECT.marketer}</strong>
                <br />
                <span className="text-ivory/60">{PROJECT.marketerTagline} · {PROJECT.marketerSince}</span>
              </p>
              <p className="text-ivory/65">RERA No. {PROJECT.reraNo}</p>
            </address>
          </div>

          <div>
            <NewsletterForm />
            <Link href="/contact" className="btn btn-outline-light mt-6 w-full sm:w-auto">
              Contact us <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </div>

        {/* blessing emblem — portrait + name above the SASP mark */}
        <div className="mt-14 flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-3 rounded-full border border-dashed border-gold/50"
            />
            <div aria-hidden className="absolute -inset-3 rounded-full bg-gold/15 blur-xl" />
            <div className="relative h-44 w-44 overflow-hidden rounded-full ring-2 ring-gold md:h-56 md:w-56">
              <img
                src="/images/vector-illustration-sai-baba-gold-matte-gradient-saibaba-portrait-245937046.jpg"
                alt="Sai Baba blessing — Shri Aaradhya Sai Property emblem"
                loading="lazy"
                decoding="async"
                className="h-full w-full scale-[1.4] object-cover [object-position:center_15%]"
              />
            </div>
            <span
              aria-hidden
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-navy-deep px-3 text-sm text-gold"
            >
              ✦
            </span>
          </div>
          <p className="mt-6 font-display text-2xl tracking-[0.08em] text-ivory md:text-3xl">
            SHRI AARADHYA SAI
          </p>
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
            Property · The Name of Trust · Since 2010
          </p>
          <div className="mt-4 flex items-center gap-3" aria-hidden>
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" />
            <span className="text-xs text-gold">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" />
          </div>
        </div>

        <div aria-hidden className="mt-10 select-none overflow-hidden">
          <p className="text-outline-gold whitespace-nowrap text-center font-display text-[clamp(3.5rem,14vw,11rem)] font-semibold leading-none tracking-[0.06em]">
            SASP
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-ivory/12 pt-7 text-[13px] text-ivory/65 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {PROJECT.marketer} · Surya Greens. Content as per official project brochure.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={PROJECT.instagramUrl} target="_blank" rel="noreferrer" className="u-link hover:text-ivory">
              Instagram
            </a>
            <a href={PROJECT.mapUrl} target="_blank" rel="noreferrer" className="u-link hover:text-ivory">
              Live map
            </a>
            <Link href="/about" className="u-link hover:text-ivory">
              Legality
            </Link>
            <Link href="/location" className="u-link hover:text-ivory">
              Location
            </Link>
            <a href="/sitemap.xml" className="u-link hover:text-ivory">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
