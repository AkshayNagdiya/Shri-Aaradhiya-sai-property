'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import { ArrowDown, ArrowUpRight, BadgeCheck, MapPin, Phone } from 'lucide-react';
import { useCms } from '../lib/cms';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduce = useReducedMotion();
  const { project: PROJECT } = useCms();

  return (
    <section aria-label="Introduction" className="grain relative flex min-h-[100svh] items-stretch overflow-hidden bg-navy-deep">
      {/* backdrop with slow ken-burns drift */}
      <motion.div
        initial={reduce ? false : { scale: 1.14 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0"
        aria-hidden
      >
        <motion.img
          src="/images/main-gate.jpg"
          alt=""
          fetchPriority="high"
          animate={reduce ? undefined : { scale: [1, 1.07, 1] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-full object-cover [object-position:center_32%]"
        />
      </motion.div>
      {/* legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/35 to-navy-deep/45" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/70 via-navy-deep/20 to-transparent" aria-hidden />

      {/* side caption, desktop only */}
      <p
        aria-hidden
        className="absolute right-7 top-1/2 hidden origin-right -translate-y-1/2 rotate-90 text-[11px] font-bold uppercase tracking-[0.5em] text-ivory/50 xl:block"
      >
        Grandeur Living — Mhow · Indore
      </p>

      <div className="relative mx-auto flex w-full max-w-shell flex-col justify-end px-5 pb-10 pt-40 md:px-10 md:pb-12 md:pt-48">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="flex flex-wrap items-center gap-2"
        >
          <span className="inline-flex items-center gap-1.5 bg-gold px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-navy-deep">
            <BadgeCheck size={13} aria-hidden /> RERA Approved
          </span>
          <span className="inline-flex items-center gap-1.5 border border-ivory/30 bg-navy-deep/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-ivory backdrop-blur-sm">
            <MapPin size={13} aria-hidden /> {PROJECT.location}
          </span>
        </motion.div>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.4, ease }}
          className="mt-6 max-w-5xl font-display font-hero text-ivory"
        >
          Your Own Space
          <br />
          <em className="font-light italic text-gold-light">of Paradise.</em>
        </motion.h1>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.65 }}
          aria-hidden
          className="gold-rule mt-7 max-w-md opacity-90"
        />

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.45, ease }}
              className="mt-6 text-[12px] font-bold uppercase tracking-[0.3em] text-gold md:text-[13px]"
            >
              Shri Aaradhya Sai Property presents — Surya Greens
            </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Link href="/plots" className="btn bg-gold px-9 py-4 text-navy-deep hover:bg-gold-light">
            Explore plots <ArrowUpRight size={16} aria-hidden />
          </Link>
          <Link href="/gallery" className="btn btn-ghost">
            View renders
          </Link>
          <a
            href={PROJECT.phones[0].href}
            className="inline-flex items-center gap-2 px-2 py-3 text-[15px] font-bold text-gold-light hover:text-ivory sm:ml-2"
          >
            <Phone size={16} aria-hidden /> {PROJECT.phones[0].display}
          </a>
        </motion.div>

        {/* bottom stat bar */}
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, delay: 1.05 }}
          className="mt-12 grid grid-cols-2 gap-px border border-ivory/15 bg-ivory/15 backdrop-blur-sm md:grid-cols-4"
        >
          {[
            ['Plot sizes', '600 – 1000 sq.ft.'],
            ['Facing', 'East & West'],
            ['RERA No.', PROJECT.reraNo],
            ['Call us', PROJECT.phones[0].display],
          ].map(([k, v]) => (
            <div key={k} className="bg-navy-deep/70 px-5 py-4">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold-light/80">{k}</p>
              <p className="mt-1 font-display text-[17px] text-ivory md:text-lg">{v}</p>
            </div>
          ))}
        </motion.div>

        <div className="mt-6 flex items-center justify-between text-ivory/60">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em]">Scroll to discover</p>
          <motion.a
            href="#welcome"
            aria-label="Scroll to welcome section"
            animate={reduce ? undefined : { y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-light"
          >
            <ArrowDown size={18} aria-hidden />
          </motion.a>
          <p className="hidden text-[11px] font-semibold uppercase tracking-[0.24em] sm:block">
            {PROJECT.marketerSince} · SASP
          </p>
        </div>
      </div>
    </section>
  );
}
