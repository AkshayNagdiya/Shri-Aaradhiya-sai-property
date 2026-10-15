'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Clock,
  Footprints,
  Landmark,
  MapPin,
  Minus,
  Pause,
  Phone,
  Play,
  Plus,
  ShieldCheck,
  Star,
} from 'lucide-react';
import Hero from '../src/components/Hero';
import SectionHeading from '../src/components/SectionHeading';
import Reveal from '../src/components/Reveal';
import PlotCard from '../src/components/PlotCard';
import CountUp from '../src/components/CountUp';
import RotatingBadge from '../src/components/RotatingBadge';
import { connectivity, plotSizes } from '../src/data/project';
import { useCms } from '../src/lib/cms';
import type { Plot } from '../src/data/project';
import { usePageMeta } from '../src/lib/seo';

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ------------------------------- marquee row ------------------------------ */
function GoldMarquee() {
  const items = [
    'RERA Approved',
    '600 – 1000 sq.ft. Plots',
    'East & West Facing',
    '40-Feet Main Road',
    '6 Theme Gardens',
    'Bank Loans Available',
    'Santer · Kishanganj · Mhow',
  ];
  const row = [...items, ...items];
  return (
    <div className="marquee border-y border-gold/40 bg-navy-deep py-4" aria-hidden>
      <div className="marquee-track items-center gap-10 pr-10">
        {row.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-10 whitespace-nowrap text-[12.5px] font-extrabold uppercase tracking-[0.26em] text-gold-light">
            {t} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ guided tour ----------------------------- */
const TOUR_COPY: Record<string, string> = {
  Entrance: 'Arrival, framed — gates, avenues and boundary walls.',
  Gardens: 'Green courts for morning walks and evening sit-outs.',
  Sports: 'Open gym and net-covered turfs for play evenings.',
  'Master Plan': 'The numbered layout — light, air and wide roads.',
  Project: 'The project story, board by board.',
};

/* What to actually check at each chapter when you visit. */
const TOUR_TIPS: Record<string, string> = {
  Entrance: 'Stand at the gate at 5 pm — check avenue width, guard room and how arrival feels.',
  Gardens: 'Sit five minutes in the garden court — shade, breeze and upkeep tell the truth.',
  Sports: 'Come after 4 pm — nets, turf bounce and evening light are best judged in play hours.',
  'Master Plan': 'Ask for your plot number on the plan — check facing, road width and garden distance.',
  Project: 'Ask for the RERA file and brochure — match every claim on the boards to paper.',
};

const TOUR_CHAPTERS = ['Entrance', 'Gardens', 'Sports', 'Master Plan', 'Project'] as const;

function HorizontalTour() {
  const reduce = useReducedMotion();
  const { gallery } = useCms();
  const images = gallery;
  const total = images.length;
  const [stop, setStop] = useState(0);
  const [playing, setPlaying] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);

  const pad = (n: number) => String(n + 1).padStart(2, '0');
  const totalLabel = String(total).padStart(2, '0');
  const clamp = (i: number) => Math.min(Math.max(i, 0), total - 1);

  const goTo = (i: number) => {
    if (total === 0) return;
    setPlaying(false);
    setStop(clamp(i));
  };

  const step = (d: number) => {
    if (total === 0) return;
    setStop((s) => (s + d + total) % total);
  };

  /* Optional auto-walk — advances every few seconds, pauses on manual nav. */
  useEffect(() => {
    if (!playing || reduce || total <= 1) return;
    const t = setInterval(() => setStop((s) => (s + 1) % total), 5200);
    return () => clearInterval(t);
  }, [playing, reduce, total]);

  useEffect(() => {
    setStop((s) => Math.min(s, Math.max(0, total - 1)));
  }, [total]);

  useEffect(() => {
    stripRef.current
      ?.querySelector(`[data-i="${stop}"]`)
      ?.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
  }, [stop]);

  /* Chapters present in this gallery, in walk order. */
  const chapters = TOUR_CHAPTERS.filter((c) => images.some((g) => g.category === c));
  const jumpToChapter = (c: string) => {
    const i = images.findIndex((g) => g.category === c);
    if (i >= 0) goTo(i);
  };

  if (total === 0) return null;

  if (reduce) {
    return (
      <div className="flex flex-col gap-8 px-5 pb-10 md:px-10" role="list" aria-label="Guided tour stops">
        {images.map((g, i) => (
          <figure key={g.src} role="listitem" className="relative overflow-hidden shadow-card">
            <img src={g.src} alt={g.title} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
            <span className="absolute left-4 top-4 bg-gold px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-navy-deep">
              Stop {pad(i)}
            </span>
            <figcaption className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold-light">{g.category}</p>
              <p className="mt-1 font-display text-2xl text-ivory">{g.title}</p>
              <p className="mt-1 text-[13.5px] leading-relaxed text-ivory/70">{TOUR_COPY[g.category] ?? ''}</p>
            </figcaption>
          </figure>
        ))}
        <div className="bg-gold p-7 text-navy-deep">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-navy-deep/70">End of tour</p>
          <p className="mt-2 font-display text-3xl leading-tight">Come walk it for real.</p>
          <Link href="/gallery" className="btn mt-5 bg-navy-deep px-7 py-3.5 text-ivory">
            Open gallery <ArrowUpRight size={15} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const current = images[stop];
  const progress = (stop + 1) / total;
  const walkMin = stop * 4;
  const walkKm = (0.3 + stop * 0.18).toFixed(1);

  const onStageKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      step(1);
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <div className="px-5 md:px-10">
      {/* chapter jumps */}
      {chapters.length > 1 && (
        <div className="thin-scroll mb-6 flex items-center gap-2 overflow-x-auto pb-1" role="group" aria-label="Jump to a chapter">
          <span aria-hidden className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-[0.22em] text-ivory/45">
            Chapters
          </span>
          {chapters.map((c) => {
            const active = current.category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => jumpToChapter(c)}
                aria-current={active ? 'true' : undefined}
                className={`shrink-0 rounded-full border px-4 py-2 text-[11.5px] font-extrabold uppercase tracking-[0.14em] transition ${
                  active
                    ? 'border-gold bg-gold text-navy-deep shadow-card'
                    : 'border-ivory/25 text-ivory/70 hover:border-gold/70 hover:text-ivory'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* itinerary rail — the walk, in order */}
        <nav aria-label="Walk itinerary" className="hidden lg:block">
          <ol className="thin-scroll sticky top-28 max-h-[560px] space-y-1 overflow-y-auto pr-1">
            {images.map((g, i) => {
              const isActive = i === stop;
              const done = i < stop;
              return (
                <li key={g.src}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className={`group relative flex w-full items-center gap-3.5 overflow-hidden px-3 py-3 text-left transition ${
                      isActive ? 'bg-ivory/[0.07]' : 'hover:bg-ivory/[0.04]'
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-y-0 left-0 w-[3px] transition ${
                        isActive ? 'bg-gold' : 'bg-transparent group-hover:bg-ivory/20'
                      }`}
                    />
                    <span
                      aria-hidden
                      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center font-display text-[13px] font-bold transition ${
                        isActive
                          ? 'bg-gold text-navy-deep'
                          : done
                            ? 'bg-emerald-400/20 text-emerald-300'
                            : 'bg-ivory/10 text-ivory/60 group-hover:text-ivory'
                      }`}
                    >
                      {done && !isActive ? <Check size={15} /> : pad(i)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[14.5px] font-bold transition ${isActive ? 'text-ivory' : 'text-ivory/75 group-hover:text-ivory'}`}>
                        {g.title}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-gold-light/70">
                        {g.category} · min {i * 4}–{i * 4 + 4}
                      </span>
                    </span>
                    {isActive && (
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="mt-4 border border-gold/35 bg-gold/[0.08] p-5">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-light">End of walk</p>
            <p className="mt-1.5 font-display text-[22px] leading-snug text-ivory">Come walk it for real.</p>
            <Link href="/gallery" className="btn mt-4 bg-gold px-6 py-3 text-navy-deep hover:bg-gold-light">
              Open gallery <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
        </nav>

        {/* stage — the current stop */}
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={`Guided tour stop ${pad(stop)} of ${totalLabel}: ${current.title}`}
          tabIndex={0}
          onKeyDown={onStageKey}
          className="overflow-hidden shadow-card outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-navy sm:aspect-[16/9]">
            <AnimatePresence initial={false}>
              <motion.div
                key={stop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease }}
                className="absolute inset-0"
              >
                <img
                  src={current.src}
                  alt={current.title}
                  loading={stop < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-navy-deep/35" />

            {/* top console */}
            <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-gold px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-navy-deep">
                  Stop {pad(stop)}
                </span>
                <span className="border border-ivory/30 bg-navy-deep/55 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.2em] text-ivory backdrop-blur-sm">
                  {current.category}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span aria-live="polite" className="bg-navy-deep/55 px-3 py-1.5 font-display text-[13px] tracking-[0.2em] text-ivory backdrop-blur-sm">
                  {pad(stop)} <span aria-hidden className="text-gold">/</span> {totalLabel}
                </span>
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-pressed={playing}
                  aria-label={playing ? 'Pause auto-walk' : 'Play auto-walk'}
                  title={playing ? 'Pause auto-walk' : 'Play auto-walk'}
                  className={`inline-flex h-9 w-9 items-center justify-center backdrop-blur-sm transition ${
                    playing
                      ? 'bg-gold text-navy-deep hover:bg-gold-light'
                      : 'bg-navy-deep/55 text-ivory hover:text-gold-light'
                  }`}
                >
                  {playing ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />}
                </button>
              </div>
            </div>

            {/* bottom walk meta + progress */}
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ivory/85">
                <span className="inline-flex items-center gap-1.5">
                  <Footprints size={14} aria-hidden className="text-gold-light" /> {walkKm} km in
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} aria-hidden className="text-gold-light" /> min {walkMin}–{walkMin + 4}
                </span>
              </div>
              <div aria-hidden className="mt-2.5 h-[3px] overflow-hidden rounded-full bg-ivory/20">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-[width] duration-500"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* caption card */}
          <div className="border border-t-0 border-ivory/15 bg-white/[0.04] p-5 backdrop-blur-sm md:p-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={stop}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease }}
                aria-live="polite"
              >
                <p aria-hidden className="font-display text-[13px] font-bold tracking-[0.3em] text-gold-light/70">
                  {pad(stop)} — {current.category}
                </p>
                <h3 className="mt-2 font-display text-3xl leading-[1.05] text-ivory md:text-4xl">{current.title}</h3>
                <p className="mt-2.5 max-w-xl text-[15px] leading-relaxed text-ivory/70">
                  {TOUR_COPY[current.category] ?? ''}
                </p>
                <p className="mt-4 flex items-start gap-2.5 border border-gold/30 bg-gold/[0.09] px-4 py-3 text-[13.5px] leading-relaxed text-ivory/85">
                  <MapPin size={15} aria-hidden className="mt-0.5 shrink-0 text-gold-light" />
                  <span>
                    <strong className="font-bold text-gold-light">On site, check — </strong>
                    {TOUR_TIPS[current.category] ?? ''}
                  </span>
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous tour stop"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ivory/25 text-lg text-ivory transition hover:border-gold hover:text-gold-light"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next tour stop"
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-lg text-navy-deep transition hover:bg-gold-light"
              >
                →
              </button>
              <Link href="/gallery" className="btn btn-ghost ml-1">
                Open full gallery
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* mobile filmstrip */}
      <div
        ref={stripRef}
        role="tablist"
        aria-label="Tour filmstrip"
        className="thin-scroll mt-6 flex max-w-full items-center gap-2 overflow-x-auto pb-1 lg:hidden"
      >
        {images.map((g, i) => {
          const isActive = i === stop;
          return (
            <button
              key={g.src}
              type="button"
              role="tab"
              data-i={i}
              aria-selected={isActive}
              aria-label={`Go to stop ${pad(i)}: ${g.title}`}
              title={`${pad(i)} · ${g.title}`}
              onClick={() => goTo(i)}
              className="relative shrink-0"
            >
              <img
                src={g.src}
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className={`h-14 w-24 object-cover transition duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                }`}
              />
              {isActive && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-gold"
                />
              )}
              <span
                aria-hidden
                className={`absolute bottom-0.5 left-1 px-1 text-[9px] font-extrabold tracking-[0.14em] ${
                  isActive ? 'bg-gold text-navy-deep' : 'bg-navy-deep/70 text-ivory/80'
                }`}
              >
                {pad(i)}
              </span>
            </button>
          );
        })}
      </div>

      {/* mobile end card */}
      <div className="mt-6 bg-gold p-7 text-navy-deep lg:hidden">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-navy-deep/70">End of tour</p>
        <p className="mt-2 font-display text-3xl leading-tight">Come walk it for real.</p>
        <Link href="/gallery" className="btn mt-5 bg-navy-deep px-7 py-3.5 text-ivory">
          Open gallery <ArrowUpRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  );
}

/* ---------------------------------- faq ----------------------------------- */
const faqs = [
  {
    q: 'Where exactly is Surya Greens?',
    a: 'At Santer, Kishanganj on the Mhow–Indore road — near Krishi Ganj Colony, Mewara Hospital, Vijayant College and the Veterinary College.',
  },
  {
    q: 'What plot sizes are available?',
    a: 'Six formats from 600 to 1000 sq.ft. (15×40 up to 20×50). Every plot in the development is east & west facing.',
  },
  {
    q: 'Is the project RERA approved?',
    a: 'Yes — RERA No. P-IND-26-6829, as printed in the official brochure. We encourage every buyer to verify registration independently before booking.',
  },
  {
    q: 'Can I get a bank loan for a plot?',
    a: 'Yes. Loan facility is available from all leading banks, and the SASP team helps with documentation and coordination.',
  },
  {
    q: 'What amenities come with the project?',
    a: 'Grand entrance gate, 40-feet main road, security boundary walls with CCTV, underground electricity, 6 theme gardens, open gym, net-covered cricket and multi-sports turfs, kids play area and a project mandir.',
  },
  {
    q: 'How do I visit the site?',
    a: 'Call 77249-85563 or 91316-44787 any day between 10 AM and 6:30 PM. Visit once and experience the difference.',
  },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={f.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${i}`}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg text-navy-deep md:text-xl">{f.q}</span>
              <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center border transition ${isOpen ? 'border-navy bg-navy text-ivory' : 'border-navy/25 text-navy-deep'}`}>
                {isOpen ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
              </span>
            </button>
            <div id={`faq-panel-${i}`} hidden={!isOpen}>
              <p className="max-w-3xl pb-6 text-[15px] leading-relaxed text-ink-muted">{f.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const stories = [
  {
    n: 'Rohit Sharma',
    w: '800 sq.ft. · West facing owner',
    t: 'RERA papers on day one, loan done in a week. The visit felt honest — no pressure, just straight answers.',
  },
  {
    n: 'Anita Patidar',
    w: '1000 sq.ft. · Premium owner',
    t: 'We compared four colonies near Mhow. The gardens, wide roads and boundary walls here were simply better.',
  },
  {
    n: 'Mohd. Salim',
    w: 'Site visitor · Indore',
    t: 'Called in the morning, walked the plots by afternoon. The team showed every size and facing patiently.',
  },
];

/* ------------------------- interactive plots -------------------------- */
type FacingFilter = 'All' | 'East' | 'West';
type SortKey = 'featured' | 'size-asc' | 'size-desc';

function PlotsExplorer() {
  const { plots, project: PROJECT } = useCms();
  const [facing, setFacing] = useState<FacingFilter>('All');
  const [sort, setSort] = useState<SortKey>('featured');
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const filtered = useMemo(() => {
    const list = plots.filter((p) => facing === 'All' || p.facing === facing);
    if (sort === 'size-asc') return [...list].sort((a, b) => a.sizeSqft - b.sizeSqft);
    if (sort === 'size-desc') return [...list].sort((a, b) => b.sizeSqft - a.sizeSqft);
    return list;
  }, [facing, sort]);

  const toggleCompare = (id: string) =>
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id],
    );

  const compared: Plot[] = useMemo(() => plots.filter((p) => compareIds.includes(p.id)), [compareIds]);

  useEffect(() => {
    if (!compareOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCompareOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [compareOpen]);

  return (
    <>
      {/* controls */}
      <Reveal className="mt-8 border border-line bg-ivory-deep/50 p-4 md:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter plots by facing">
            <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Facing</span>
            {(['All', 'East', 'West'] as FacingFilter[]).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={facing === f}
                onClick={() => setFacing(f)}
                className={`px-5 py-2.5 text-[12px] font-bold uppercase tracking-[0.16em] transition ${
                  facing === f
                    ? 'bg-navy text-ivory shadow-subtle'
                    : 'border border-navy/20 bg-ivory text-navy-deep hover:border-navy'
                }`}
              >
                {f === 'All' ? 'All' : f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-[13px] font-semibold text-ink-muted" role="status">
              Showing {filtered.length} of {plots.length} plots
            </p>
            <label htmlFor="plot-sort" className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">
              Sort
            </label>
            <select
              id="plot-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="field !w-auto !py-2.5 text-sm font-semibold"
            >
              <option value="featured">Featured</option>
              <option value="size-asc">Size: small → large</option>
              <option value="size-desc">Size: large → small</option>
            </select>
          </div>
        </div>
        <p className="mt-3 text-[13px] text-ink-faint">
          Tip: tap <span className="font-bold text-navy-deep">+</span> on up to 3 plots to compare them side by side.
        </p>
      </Reveal>

      {/* grid */}
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => {
            const selected = compareIds.includes(p.id);
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease }}
              >
                <div className="relative h-full">
                  <PlotCard plot={p} />
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-pressed={selected}
                    aria-label={selected ? `Remove ${p.title} from compare` : `Add ${p.title} to compare (up to 3)`}
                    title={selected ? 'Remove from compare' : 'Add to compare'}
                    className={`absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center border backdrop-blur-sm transition ${
                      selected
                        ? 'border-gold bg-gold text-navy-deep shadow-card'
                        : 'border-ivory/60 bg-navy-deep/70 text-ivory hover:bg-navy-deep'
                    }`}
                  >
                    {selected ? <Check size={18} aria-hidden /> : <Plus size={18} aria-hidden />}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* compare tray */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <div className="fixed inset-x-3 bottom-3 z-40 sm:inset-x-6 md:bottom-5">
            <motion.div
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 90, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              className="mx-auto flex max-w-2xl flex-col gap-3 border border-gold/40 bg-navy-deep/95 px-5 py-4 text-ivory shadow-card backdrop-blur-md sm:flex-row sm:items-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-light">
                  Compare {compareIds.length}/3
                </span>
                {compared.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    aria-label={`Remove ${p.title} from compare`}
                    className="inline-flex items-center gap-1.5 border border-ivory/25 px-3 py-1.5 text-[12px] font-bold text-ivory transition hover:border-gold hover:text-gold-light"
                  >
                    {p.sizeSqft} sq.ft. <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCompareOpen(true)}
                  disabled={compareIds.length < 2}
                  className="btn bg-gold px-6 py-3 text-navy-deep hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gold"
                >
                  Compare now
                </button>
                <button
                  type="button"
                  onClick={() => setCompareIds([])}
                  className="u-link px-2 py-3 text-[12px] font-bold uppercase tracking-[0.16em] text-ivory/70 hover:text-ivory"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* compare modal */}
      <AnimatePresence>
        {compareOpen && compared.length >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-deep/85 p-3 backdrop-blur-sm sm:items-center md:p-8"
            onClick={() => setCompareOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
              role="dialog"
              aria-modal="true"
              aria-label="Compare plots side by side"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[88vh] w-full max-w-4xl overflow-auto border border-gold/40 bg-ivory shadow-card"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-7">
                <div>
                  <p className="eyebrow">Side by side</p>
                  <h3 className="mt-2 font-display text-2xl text-navy-deep md:text-3xl">Compare plots</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  autoFocus
                  aria-label="Close comparison"
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-navy/25 text-navy-deep transition hover:bg-navy hover:text-ivory"
                >
                  ✕
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th scope="col" className="p-5 md:p-6">
                        <span className="sr-only">Feature</span>
                      </th>
                      {compared.map((p) => (
                        <th key={p.id} scope="col" className="min-w-[180px] p-5 align-top md:p-6">
                          <p className="font-display text-3xl text-navy-deep">
                            {p.sizeSqft} <span className="text-base">sq.ft.</span>
                          </p>
                          <p className="mt-1 text-[13px] font-semibold text-ink-muted">{p.title}</p>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-[14.5px]">
                    <tr>
                      <th scope="row" className="p-5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:p-6">
                        Dimensions
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-5 text-ink-soft md:p-6">{p.dimensions} ft</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="p-5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:p-6">
                        Facing
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-5 text-ink-soft md:p-6">{p.facing} facing</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="p-5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:p-6">
                        Status
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-5 text-ink-soft md:p-6">{p.status}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="p-5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:p-6">
                        Best for
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-5 text-ink-soft md:p-6">{p.tagline}</td>
                      ))}
                    </tr>
                    <tr>
                      <th scope="row" className="p-5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-faint md:p-6">
                        Next step
                      </th>
                      {compared.map((p) => (
                        <td key={p.id} className="p-5 md:p-6">
                          <a href={PROJECT.phones[0].href} className="btn btn-primary px-5 py-3 text-[11.5px]">
                            <Phone size={14} aria-hidden /> Ask price
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="border-t border-line p-5 md:p-6">
                <Link href="/plots" onClick={() => setCompareOpen(false)} className="u-link text-[12.5px] font-bold uppercase tracking-[0.18em] text-navy-deep">
                  See all six plots →
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* --------------------------------- page ----------------------------------- */
const stackCards = [
  { img: '/images/main-gate.jpg', n: '01', t: 'The Grand Gate', d: 'A brick-and-stone entrance portal with a staffed guard room. Arrival feels like an occasion — every single day.', tags: ['Brick & stone', 'Guard room'] },
  { img: '/images/garden-music.jpg', n: '02', t: 'Six Theme Gardens', d: 'Designed garden courts including a musical garden — morning walks, evening sit-outs and shade in every season.', tags: ['6 theme courts', 'Musical garden'] },
  { img: '/images/open-gym.jpg', n: '03', t: 'Open Gym + Court', d: 'An open-air gym pavilion beside the badminton court. Fitness with fresh air instead of fluorescent lights.', tags: ['Open-air gym', 'Badminton court'] },
  { img: '/images/garden-aerial.jpg', n: '04', t: 'Sports Turfs', d: 'Net-covered cricket and multi-sports turfs for practice evenings, weekend matches and colony tournaments.', tags: ['Net-covered', 'Cricket + multi-sport'] },
  { img: '/images/entrance-avenue.jpg', n: '05', t: '40-Feet Avenue', d: 'A tree-lined 40-feet main road with underground electricity — wide, safe and free of overhead wires.', tags: ['40-feet road', 'Underground power'] },
];

/* ------------- floating scene navbar for the amenity stack -------------- */
const AMENITY_NAV = [
  { id: 'amenity-01', n: '01', label: 'Grand Gate' },
  { id: 'amenity-02', n: '02', label: 'Gardens' },
  { id: 'amenity-03', n: '03', label: 'Gym + Court' },
  { id: 'amenity-04', n: '04', label: 'Sports Turfs' },
  { id: 'amenity-05', n: '05', label: 'Avenue' },
];

function AmenityDeckNav() {
  const [active, setActive] = useState(AMENITY_NAV[0].id);

  useEffect(() => {
    const els = AMENITY_NAV.map((a) => document.getElementById(a.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (els.length === 0) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const jump = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="sticky top-[74px] z-30 mt-8 flex justify-center md:top-[86px]">
      <nav
        aria-label="Amenity scenes"
        className="thin-scroll flex max-w-full items-center gap-1 overflow-x-auto rounded-full border border-ivory/20 bg-navy-deep/25 p-1.5 shadow-soft backdrop-blur-md"
      >
        {AMENITY_NAV.map((a) => {
          const isActive = active === a.id;
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => jump(a.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`relative flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[11px] font-extrabold uppercase tracking-[0.14em] transition-colors duration-300 md:px-4 ${
                isActive ? 'text-navy-deep' : 'text-ivory/65 hover:text-ivory'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="amenity-active-pill"
                  transition={{ duration: 0.4, ease }}
                  className="absolute inset-0 rounded-full bg-ivory shadow-subtle"
                  aria-hidden
                />
              )}
              <span aria-hidden className={`relative font-display text-[11px] ${isActive ? 'text-gold-deep' : 'text-gold-light/70'}`}>
                {a.n}
              </span>
              <span className="relative">{a.label}</span>
              {isActive && <span aria-hidden className="relative h-1 w-1 rounded-full bg-gold" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export default function Home() {
  const { project: PROJECT, banks } = useCms();
  usePageMeta(
    'Shri Aaradhya Sai Property — Surya Greens Plots, Mhow | RERA Approved',
    'RERA-approved premium residential plots (600–1000 sq.ft., east & west facing) at Santer, Kishanganj–Mhow. Gated security, theme gardens, sports turfs, open gym, mandir. Marketed by Shri Aaradhya Sai Property.',
  );

  const reduce = useReducedMotion();
  const introRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: introProg } = useScroll({ target: introRef, offset: ['start end', 'end start'] });
  const introY = useTransform(introProg, [0, 1], ['-10%', '10%']);
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: stackProg } = useScroll({ target: stackRef, offset: ['start end', 'end start'] });

  const stats: [number, string, string][] = [
    [1000, ' sq.ft.', 'Largest plot format'],
    [40, ' ft', 'Grand main road'],
    [6, '', 'Theme-based gardens'],
    [10, ' km', 'Indore within reach'],
  ];

  return (
    <>
      <Hero />
      <GoldMarquee />

      {/* intro statement */}
      <section aria-labelledby="welcome-h" className="mx-auto max-w-shell scroll-mt-24 px-5 pb-4 pt-16 md:px-10 md:pt-24">
        <Reveal>
          <p className="eyebrow">Santer · Kishanganj · Mhow</p>
          <h2 id="welcome-h" className="mt-5 max-w-5xl font-display text-[clamp(2.2rem,5.4vw,4.6rem)] leading-[1.02] text-navy-deep">
            A gated world of <em className="font-light italic text-gold-dark">green courts</em> and{' '}
            <em className="font-light italic text-gold-dark">grand gates</em> — priced for real families.
          </h2>
        </Reveal>
        <div ref={introRef} className="mt-12 grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="relative overflow-hidden border border-gold/40 shadow-card">
            <motion.img
              src="/images/entrance-avenue.jpg"
              alt="Tree-lined entrance avenue at Surya Greens"
              loading="lazy"
              decoding="async"
              style={reduce ? undefined : { y: introY }}
              className="aspect-[16/9] w-full scale-[1.18] object-cover will-change-transform"
            />
            <span className="absolute bottom-4 left-4 bg-navy-deep/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-ivory backdrop-blur-sm">
              The entry avenue
            </span>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="flex items-start justify-between gap-6">
              <p className="max-w-md text-[15.5px] leading-relaxed text-ink-muted md:text-base">
                Surya Greens is a RERA-approved plotted development on the Mhow–Indore growth corridor —
                six east &amp; west facing formats from 600 to 1000 sq.ft., wrapped in security walls,
                gardens and sport. <strong className="text-ink">Visit once and experience the difference.</strong>
              </p>
            </div>
            <div className="mt-6 flex items-center gap-5 text-navy-deep">
              <RotatingBadge text="RERA APPROVED • SURYA GREENS • " sub="✦" />
              <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-ink-muted">
                RERA No.
                <br />
                <span className="font-display text-xl normal-case tracking-normal text-navy-deep">{PROJECT.reraNo}</span>
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/plots" className="btn btn-primary">
                Explore plots <ArrowRight size={16} aria-hidden />
              </Link>
              <a href={PROJECT.phones[0].href} className="btn btn-outline-dark">
                <Phone size={15} aria-hidden /> {PROJECT.phones[0].display}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* stats */}
      <section aria-label="Project numbers" className="mx-auto max-w-shell px-5 py-14 md:px-10 md:py-20">
        <div className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {stats.map(([to, suffix, label], i) => (
            <Reveal key={label} delay={i * 0.06} className="bg-ivory">
              <div className="px-6 py-8 text-center md:py-10">
                <p className="font-display text-5xl text-navy-deep md:text-6xl">
                  <CountUp to={to} suffix={suffix} />
                </p>
                <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.2em] text-ink-muted">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* sticky stacking amenity cards */}
      <section aria-labelledby="amen-h" className="border-y border-line bg-ivory-deep/60">
        <div className="mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
          <SectionHeading
            eyebrow="The amenity deck"
            title="Five Reasons to Never Leave."
            copy="Scroll slowly — each card lands on the last. The full deck of eleven specifications lives in the gallery."
          />
          <h2 id="amen-h" className="sr-only">Amenities</h2>
          <div className="mt-8 flex items-center gap-4" aria-hidden>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-dark">01</span>
            <div className="h-[2px] flex-1 bg-navy/10">
              <motion.div style={{ scaleX: stackProg }} className="h-full origin-left bg-gold" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold-dark">05</span>
          </div>
          <AmenityDeckNav />
        </div>
        <div ref={stackRef} id="amenity-stack" className="relative mt-6">
            {stackCards.map((c, i) => (
              <div key={c.n} id={`amenity-${c.n}`} className="sticky top-0 scroll-mt-28">
                <article className="relative min-h-[100svh] overflow-hidden bg-navy-deep text-ivory">
                  <img
                    src={c.img}
                    alt=""
                    aria-hidden
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-navy-deep/10" aria-hidden />
                  <div className="absolute inset-0 hidden bg-gradient-to-r from-navy-deep/55 via-transparent to-transparent md:block" aria-hidden />
                  <div aria-hidden className="pointer-events-none absolute inset-3 z-10 border border-gold/25 md:inset-5" />
                  <div className={`relative z-20 mx-auto flex min-h-[100svh] w-full max-w-shell flex-col justify-end px-8 pb-14 pt-32 md:px-10 md:pb-16 md:pt-36 ${i % 2 === 1 ? 'md:items-end md:text-right' : ''}`}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold-light">
                      Scene {c.n} <span className="mx-2 text-gold/60" aria-hidden>·</span> Surya Greens
                    </p>
                    <p aria-hidden className="text-outline-ivory mt-3 font-display text-[5.5rem] leading-[0.9] md:text-[8.5rem]">{c.n}</p>
                    <h3 className="mt-3 max-w-xl font-display text-4xl leading-[1.02] md:text-6xl">{c.t}</h3>
                    <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ivory/75 md:text-base">{c.d}</p>
                    <div className={`mt-5 flex flex-wrap gap-2 ${i % 2 === 1 ? 'md:justify-end' : ''}`}>
                      {c.tags.map((t) => (
                        <span key={t} className="border border-ivory/25 bg-navy-deep/55 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                    <Link href="/gallery" className={`u-link mt-7 inline-flex w-fit items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.2em] text-gold-light ${i % 2 === 1 ? 'md:ml-auto' : ''}`}>
                      See in gallery <ArrowUpRight size={14} aria-hidden />
                    </Link>
                  </div>
                  <p aria-hidden className="absolute bottom-6 right-6 z-20 hidden font-display text-sm tracking-[0.2em] text-ivory/50 md:block">{c.n} / 05</p>
                </article>
              </div>
            ))}
        </div>
        <div className="mx-auto max-w-shell px-5 py-10 md:px-10">
          <Reveal className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-muted">…plus boundary walls, CCTV, underground power, kids play area &amp; mandir.</p>
            <Link href="/gallery" className="btn btn-primary">
              All amenities <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* plots */}
      <section aria-labelledby="plots-h" className="mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Plots & sizes"
            title="Six Plots. Pick Your Facing."
            copy="600 to 1000 sq.ft., all east & west facing. Prices on enquiry — call for availability and a site visit."
          />
          <Reveal delay={0.1}>
            <Link href="/plots" className="btn btn-outline-dark">
              Compare plots <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
        <h2 id="plots-h" className="sr-only">Plots</h2>
        <PlotsExplorer />
      </section>

      {/* guided walk */}
      <section aria-labelledby="tour-h" className="bg-navy-deep text-ivory">
        <div className="gold-rule" aria-hidden />
        <div className="mx-auto max-w-shell px-5 pt-16 md:px-10 md:pt-20">
          <Reveal>
            <p className="eyebrow !text-gold">Guided walk</p>
            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <h2 id="tour-h" className="max-w-2xl font-display font-h2">
                Take the Walk, Stop by Stop.
              </h2>
              <p className="max-w-md text-[15px] leading-relaxed text-ivory/65">
                The exact route our team walks with every visitor — gates to gardens
                to turfs. Preview it here, then come feel it under your own feet.
              </p>
            </div>
            <ul className="mt-6 flex flex-wrap items-center gap-2" aria-label="Walk facts">
              <li className="inline-flex items-center gap-1.5 border border-ivory/20 bg-ivory/[0.05] px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ivory/85">
                <Footprints size={14} aria-hidden className="text-gold-light" /> 1.2 km loop
              </li>
              <li className="inline-flex items-center gap-1.5 border border-ivory/20 bg-ivory/[0.05] px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ivory/85">
                <Clock size={14} aria-hidden className="text-gold-light" /> 45 min · easy pace
              </li>
              <li className="inline-flex items-center gap-1.5 border border-ivory/20 bg-ivory/[0.05] px-4 py-2 text-[11.5px] font-bold uppercase tracking-[0.16em] text-ivory/85">
                <MapPin size={14} aria-hidden className="text-gold-light" /> 5 chapters
              </li>
            </ul>
          </Reveal>
        </div>
        <div className="mx-auto mt-8 max-w-shell pb-16 md:pb-20">
          <HorizontalTour />
        </div>
        <div className="gold-rule" aria-hidden />
      </section>

      {/* master plan */}
      <section aria-labelledby="plan-h" className="mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal delay={0.1} className="order-2 lg:order-1">
            <p className="eyebrow">Master layout</p>
            <h2 id="plan-h" className="mt-4 font-display font-h2 text-navy-deep">
              A Plan Drawn for Light &amp; Air.
            </h2>
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-ink-muted">
              Numbered plots along 30-feet colony roads off a 40-feet main road, wrapped by gardens and
              the sports deck. Every plot is east &amp; west facing.
            </p>
            <dl className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3" aria-label="Plot sizes">
              {plotSizes.map((s) => (
                <div key={s.dimensions} className="bg-ivory px-4 py-4">
                  <dt className="text-[12px] font-bold tracking-[0.1em] text-ink-faint">{s.dimensions} ft</dt>
                  <dd className="mt-0.5 font-display text-xl text-navy-deep">{s.area} sq.ft.</dd>
                </div>
              ))}
            </dl>
            <Link href="/plots" className="btn btn-primary mt-8">
              Compare all plots <ArrowUpRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="zoom-frame border border-gold/40 shadow-card">
              <img
                src="/images/master-plan.jpg"
                alt="Surya Greens master layout plan with numbered plots"
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* process */}
      <section aria-label="How buying works" className="border-y border-line bg-ivory-deep/60">
        <div className="mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
          <SectionHeading
            eyebrow="Effortless by design"
            title="From First Call to Foundation."
            copy="Four steps, one phone number, zero confusion."
          />
          <ol className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['01', 'Enquire', 'Call 77249-85563 or send the site-visit form. Tell us your size and facing.'],
              ['02', 'Visit', 'Walk the avenue, gardens and turfs with our team — any day, 10 AM to 6:30 PM.'],
              ['03', 'Book', 'Transparent paperwork with RERA documents and clear titles, verified by you.'],
              ['04', 'Build', 'Loan assistance from leading banks, then raise the home you sketched.'],
            ].map(([n, t, d], i) => (
              <Reveal key={n} delay={i * 0.07} className="bg-ivory">
                <li className="group h-full p-7 transition-colors duration-300 hover:bg-navy-deep">
                  <p className="font-display text-5xl text-gold/40 transition-colors group-hover:text-gold">{n}</p>
                  <h3 className="mt-4 font-display text-2xl text-navy-deep transition-colors group-hover:text-ivory">{t}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted transition-colors group-hover:text-ivory/70">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* banks marquee */}
      <section aria-label="Bank loan facility" className="py-16 md:py-20">
        <Reveal className="mx-auto max-w-3xl px-5 text-center">
          <p className="eyebrow">Loan facility available</p>
          <h2 className="mt-4 font-display font-h2 text-navy-deep">Finance From All Leading Banks.</h2>
        </Reveal>
        <div className="marquee mt-10 border-y border-line bg-ivory py-5" aria-hidden>
          <div className="marquee-track-fast items-center gap-4 pr-4">
            {[...banks, ...banks].map((b, i) => (
              <span key={i} className="whitespace-nowrap border border-navy/20 px-6 py-3 font-display text-lg text-navy-deep">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* location teaser */}
      <section aria-labelledby="loc-h" className="mx-auto max-w-shell px-5 pb-16 md:px-10 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal>
            <p className="eyebrow">Location</p>
            <h2 id="loc-h" className="mt-4 font-display font-h2 text-navy-deep">
              Santer, Kishanganj – Mhow.
            </h2>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-ink-muted">
              On the Mhow–Indore road near Krishi Ganj Colony, Mewara Hospital and the Veterinary
              College — with Indore’s colleges, hospitals and malls within 10 km.
            </p>
            <div className="zoom-frame mt-6 border border-line">
              <img
                src="/images/route-map.jpg"
                alt="Route map to Surya Greens with QR code to scan for location"
                loading="lazy"
                decoding="async"
                className="aspect-[16/8] w-full object-cover"
              />
            </div>
            <Link href="/location" className="btn btn-primary mt-6">
              Everything nearby <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
          <div className="grid content-start gap-4 sm:grid-cols-2">
            {connectivity.slice(0, 4).map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <div className="h-full border border-line bg-ivory p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="flex items-center gap-2 text-gold-dark">
                    <MapPin size={16} aria-hidden />
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em]">{c.places.length} places</p>
                  </div>
                  <h3 className="mt-1.5 font-display text-xl text-navy-deep">{c.title}</h3>
                  <ul className="mt-3 space-y-1.5 text-[14px] text-ink-muted">
                    {c.places.slice(0, 4).map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                    {c.places.length > 4 ? <li className="font-semibold text-navy-deep">+ {c.places.length - 4} more →</li> : null}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* owner stories */}
      <section aria-labelledby="stories-h" className="mx-auto max-w-shell px-5 pb-16 md:px-10 md:pb-24">
        <SectionHeading
          eyebrow="Owner stories"
          title="Families Who Already Chose Us."
          copy="Straight words from owners and visitors — the same trust we promise on your visit."
        />
        <h2 id="stories-h" className="sr-only">Testimonials</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {stories.map((t, i) => (
            <Reveal key={t.n} delay={i * 0.06}>
              <figure className="flex h-full flex-col border border-line bg-ivory p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-card md:p-8">
                <span aria-hidden className="font-display text-6xl leading-[0.6] text-gold">“</span>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-muted">
                  {t.t}
                </blockquote>
                <figcaption className="mt-6 border-t border-line pt-5">
                  <span className="flex items-center gap-1" aria-label="Rated 5 out of 5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} size={14} aria-hidden className="fill-gold text-gold" />
                    ))}
                  </span>
                  <p className="mt-2.5 font-display text-lg text-navy-deep">{t.n}</p>
                  <p className="mt-0.5 text-[13px] text-ink-faint">{t.w}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* faq */}
      <section aria-labelledby="faq-h" className="border-t border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <Reveal>
              <p className="eyebrow">Good questions</p>
              <h2 id="faq-h" className="mt-4 font-display font-h2 text-navy-deep">
                Asked at Every Site Visit.
              </h2>
              <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-ink-muted">
                Straight answers from the brochure — no fine print. Anything else? Call us.
              </p>
              <a href={PROJECT.phones[0].href} className="btn btn-primary mt-6">
                <Phone size={15} aria-hidden /> {PROJECT.phones[0].display}
              </a>
            </Reveal>
            <Reveal delay={0.1}>
              <Faq />
            </Reveal>
          </div>
        </div>
      </section>

      {/* final CTA */}
      <section aria-labelledby="cta-h" className="grain relative overflow-hidden bg-navy-deep text-ivory">
        <motion.img
          src="/images/main-gate.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          initial={reduce ? false : { scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/60 to-navy-deep" aria-hidden />
        <div className="relative mx-auto max-w-shell px-5 py-20 text-center md:px-10 md:py-28">
          <Reveal>
            <p className="eyebrow !text-gold">Visit once</p>
            <p className="mx-auto mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,5rem)] leading-[1.02]">
              Experience <em className="font-light italic text-gold-light">the Difference.</em>
            </p>
            <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-relaxed text-ivory/70">
              Walk the 40-feet main road, stand in the musical garden, and pick your facing. The chai is on us.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              {PROJECT.phones.map((p) => (
                <a key={p.display} href={p.href} className="btn bg-gold px-8 py-4 text-navy-deep hover:bg-gold-light">
                  <Phone size={16} aria-hidden /> {p.display}
                </a>
              ))}
              <Link href="/contact" className="btn btn-ghost">
                Enquire online
              </Link>
            </div>
            <p className="mt-6 inline-flex items-center gap-4 text-[12px] font-bold uppercase tracking-[0.2em] text-ivory/65">
              <span className="inline-flex items-center gap-1.5"><BadgeCheck size={14} aria-hidden className="text-gold" /> RERA Approved</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck size={14} aria-hidden className="text-gold" /> Gated &amp; Guarded</span>
              <span className="hidden items-center gap-1.5 sm:inline-flex"><Landmark size={14} aria-hidden className="text-gold" /> Bank Loans</span>
            </p>
          </Reveal>
        </div>
        <div className="gold-rule relative" aria-hidden />
      </section>

      {/* back to top */}
      <a
        href="#main"
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-40 hidden h-11 w-11 items-center justify-center bg-navy-deep text-gold-light shadow-card transition hover:bg-navy md:inline-flex"
      >
        <ArrowDown size={18} aria-hidden className="rotate-180" />
      </a>
    </>
  );
}
