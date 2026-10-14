'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Cookie } from 'lucide-react';

const STORAGE_KEY = 'sasp-cookie-consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        timer = setTimeout(() => setVisible(true), 1400);
      }
    } catch {
      timer = setTimeout(() => setVisible(true), 1400);
    }
    return () => clearTimeout(timer);
  }, []);

  const choose = (value: 'accepted' | 'declined') => {
    try {
      window.localStorage.setItem(STORAGE_KEY, `${value}:${new Date().toISOString()}`);
    } catch {
      /* storage unavailable — banner simply dismisses */
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          role="region"
          aria-label="Cookie consent"
          className="fixed inset-x-3 bottom-3 z-[65] sm:inset-x-6 md:bottom-5"
        >
          <div className="mx-auto flex max-w-2xl flex-col gap-4 border border-gold/40 bg-ivory px-5 py-5 shadow-card md:flex-row md:items-center md:px-6">
            <span aria-hidden className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-mist text-navy-deep sm:inline-flex">
              <Cookie size={20} />
            </span>
            <div className="flex-1">
              <p className="font-display text-lg leading-tight text-navy-deep">A quick note on cookies</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ink-muted">
                We use basic cookies to keep the site working and remember your choice here. No
                advertising trackers, no data sold — ever.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={() => choose('declined')}
                className="u-link px-3 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted hover:text-ink"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose('accepted')}
                className="btn btn-primary px-6 py-3 text-[12px]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
