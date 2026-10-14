'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, CalendarCheck, Phone } from 'lucide-react';
import { useCms } from '../lib/cms';

const STORAGE_KEY = 'sasp-visit-offer-seen';
const DEPTH = 0.55;

export default function OfferPopup() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { project: PROJECT } = useCms();
  const reduce = useReducedMotion();

  useEffect(() => {
    setOpen(false);
    if (pathname === '/contact') return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      seen = false;
    }
    if (seen) return;

    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max > 0 && h.scrollTop / max >= DEPTH) {
        window.removeEventListener('scroll', onScroll);
        timer = setTimeout(() => {
          setOpen(true);
          try {
            window.sessionStorage.setItem(STORAGE_KEY, '1');
          } catch {
            /* ignore */
          }
        }, 800);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open ]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-deep/80 p-3 backdrop-blur-sm sm:items-center md:p-8"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 48, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Book a free site visit"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg border border-gold/40 bg-ivory p-6 shadow-card md:p-9"
          >
            <div className="gold-rule absolute inset-x-0 top-0" aria-hidden />
            <button
              type="button"
              onClick={() => setOpen(false)}
              autoFocus
              aria-label="Close offer"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center border border-navy/20 text-navy-deep transition hover:bg-navy hover:text-ivory"
            >
              ✕
            </button>
            <p className="inline-flex items-center gap-1.5 bg-gold px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.2em] text-navy-deep">
              <CalendarCheck size={13} aria-hidden /> Free site visit
            </p>
            <h3 className="mt-4 font-display text-3xl leading-[1.02] text-navy-deep md:text-4xl">
              Come, stand on your <em className="font-light italic text-gold-dark">future plot.</em>
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-ink-muted">
              This Sunday, walk the 40-ft avenue with our team — gardens, turfs, every facing.
              RERA papers in hand. Chai on us.
            </p>
            <div className="mt-6 grid gap-2.5">
              {PROJECT.phones.map((p) => (
                <a key={p.display} href={p.href} className="btn btn-primary w-full">
                  <Phone size={15} aria-hidden /> Call {p.display}
                </a>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-outline-dark w-full">
                Enquire online <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
            <p className="mt-4 text-center text-[12.5px] text-ink-faint">
              Open daily 10 AM – 6:30 PM · {PROJECT.location}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
