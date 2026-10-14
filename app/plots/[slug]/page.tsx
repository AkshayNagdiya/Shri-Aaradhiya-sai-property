'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Calculator,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Phone,
  Ruler,
} from 'lucide-react';
import PlotCard from '../../../src/components/PlotCard';
import InquiryForm from '../../../src/components/InquiryForm';
import Reveal from '../../../src/components/Reveal';
import { developmentSpecs, plotSizes } from '../../../src/data/project';
import { useCms } from '../../../src/lib/cms';
import { usePageMeta } from '../../../src/lib/seo';

function EmiCalc() {
  const [amount, setAmount] = useState(1500000);
  const [years, setYears] = useState(15);
  const rate = 8.5;
  const r = rate / 1200;
  const n = years * 12;
  const emi = Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));

  return (
    <div className="border border-line bg-ivory p-6 md:p-7">
      <h3 className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep">
        <Calculator size={15} aria-hidden /> Quick EMI check
      </h3>
      <label className="mt-5 block text-[14px] font-semibold text-ink">
        Loan amount · <span className="text-navy-deep">₹{amount.toLocaleString('en-IN')}</span>
      </label>
      <input
        type="range"
        min={500000}
        max={5000000}
        step={50000}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="mt-2 w-full accent-navy"
        aria-label="Loan amount"
      />
      <label className="mt-4 block text-[14px] font-semibold text-ink">
        Tenure · <span className="text-navy-deep">{years} years</span>
      </label>
      <input
        type="range"
        min={5}
        max={25}
        step={1}
        value={years}
        onChange={(e) => setYears(Number(e.target.value))}
        className="mt-2 w-full accent-navy"
        aria-label="Tenure in years"
      />
      <div className="mt-5 flex items-center justify-between bg-navy-deep px-5 py-4 text-ivory">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-ivory/65">EMI @ {rate}%</span>
        <span className="font-display text-2xl text-gold-light">₹{emi.toLocaleString('en-IN')}<span className="text-sm">/mo</span></span>
      </div>
      <p className="mt-2.5 text-[12.5px] italic text-ink-faint">Indicative only · final offer by the bank</p>
    </div>
  );
}

export default function PlotDetail() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const router = useRouter();
  const { project: PROJECT, plots } = useCms();
  const plot = useMemo(() => plots.find((p) => p.slug === slug), [plots, slug]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  usePageMeta(
    plot ? `${plot.title} (${plot.dimensions} ft) — Surya Greens` : 'Plot not found — Surya Greens',
    plot?.tagline,
  );

  useEffect(() => setIndex(0), [slug]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!plot) return;
      if (e.key === 'ArrowRight') {
        setDirection(1);
        setIndex((i) => (i + 1) % plot.images.length);
      }
      if (e.key === 'ArrowLeft') {
        setDirection(-1);
        setIndex((i) => (i - 1 + plot.images.length) % plot.images.length);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [plot]);

  if (!plot) {
    return (
      <div className="mx-auto max-w-shell px-5 pb-20 pt-[140px] md:px-10">
        <h1 className="font-display text-4xl text-navy-deep">Plot not found.</h1>
        <p className="mt-3 text-ink-muted">That link doesn’t match any of our six plot formats.</p>
        <Link href="/plots" className="btn btn-primary mt-6">
          Back to all plots
        </Link>
      </div>
    );
  }

  const similar = useMemo(() => {
    if (!plot) return [];
    return plots
      .filter((p) => p.id !== plot.id)
      .sort((a, b) => Math.abs(a.sizeSqft - plot.sizeSqft) - Math.abs(b.sizeSqft - plot.sizeSqft))
      .slice(0, 3);
  }, [plots, plot]);
  const go = (dir: 1 | -1) => {
    setDirection(dir);
    setIndex((i) => (i + dir + plot.images.length) % plot.images.length);
  };

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="mx-auto max-w-shell px-5 pt-8 md:px-10 md:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.18em] text-gold-dark"
          >
            <ArrowLeft size={15} aria-hidden /> Back to plots
          </button>
          <nav aria-label="Breadcrumb" className="text-[13px] text-ink-muted">
            <Link href="/" className="hover:text-ink">Home</Link> <span aria-hidden>/</span>{' '}
            <Link href="/plots" className="hover:text-ink">Plots</Link> <span aria-hidden>/</span>{' '}
            <span aria-current="page" className="text-ink">{plot.title}</span>
          </nav>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="eyebrow">{plot.dimensions} ft · {plot.facing} facing · RERA approved</p>
            <h1 className="mt-3 font-display font-h2 text-navy-deep">{plot.title}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-[15px] text-ink-muted">
              <MapPin size={16} aria-hidden /> Surya Greens, {PROJECT.location}
            </p>
            <p className="mt-3 font-display text-xl italic text-ink-soft md:text-2xl">“{plot.tagline}”</p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-line py-5 lg:justify-end lg:border-y-0 lg:py-0">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink-faint">Plot size</p>
              <p className="font-display text-3xl text-navy-deep">{plot.sizeSqft} sq.ft.</p>
            </div>
            <span className="bg-navy px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ivory">
              {plot.status}
            </span>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="mx-auto mt-8 max-w-shell px-5 md:px-10">
        <div className="relative overflow-hidden border border-gold/30 bg-navy-deep" role="region" aria-roledescription="carousel" aria-label={`${plot.title} gallery`}>
          <div className="aspect-[16/10] w-full md:aspect-[21/10]">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.img
                key={index}
                src={plot.images[index]}
                alt={`${plot.title} — render ${index + 1} of ${plot.images.length}`}
                initial={{ opacity: 0, x: 60 * direction }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 * direction }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4 md:p-5">
            <p className="bg-navy-deep/60 px-3 py-1.5 text-[12px] font-semibold tracking-[0.14em] text-ivory backdrop-blur-sm" role="status">
              {index + 1} / {plot.images.length}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="inline-flex h-11 w-11 items-center justify-center bg-ivory text-navy-deep transition hover:bg-white">
                <ChevronLeft size={20} />
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="inline-flex h-11 w-11 items-center justify-center bg-ivory text-navy-deep transition hover:bg-white">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="thin-scroll mt-3 flex gap-3 overflow-x-auto pb-1" role="group" aria-label="Choose render">
          {plot.images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              aria-pressed={i === index}
              aria-label={`Show render ${i + 1}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              className={`h-20 w-32 shrink-0 overflow-hidden border-2 transition ${i === index ? 'border-gold' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={src} alt="" aria-hidden loading="lazy" decoding="async" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <p className="mt-2 text-[13px] italic text-ink-faint">Official project renders by {PROJECT.architect} — representative imagery.</p>
      </div>

      {/* Overview */}
      <div className="mx-auto grid max-w-shell gap-10 px-5 py-12 md:px-10 md:py-16 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Reveal>
            <dl className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4" aria-label="Key specifications">
              {[
                { icon: Ruler, k: 'Dimensions', v: `${plot.dimensions} ft` },
                { icon: Compass, k: 'Facing', v: plot.facing },
                { icon: BadgeCheck, k: 'RERA', v: 'Approved' },
                { icon: MapPin, k: 'Location', v: 'Santer, Mhow' },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="bg-ivory px-5 py-5">
                  <dt className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                    <Icon size={14} aria-hidden /> {k}
                  </dt>
                  <dd className="mt-1 font-display text-xl text-navy-deep">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="font-display text-[26px] text-navy-deep md:text-[30px]">About this plot</h2>
            <div className="mt-4 space-y-4 text-[15.5px] leading-relaxed text-ink-muted">
              {plot.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep">Development specifications included</h3>
            <ul className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {developmentSpecs.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-ink-soft">
                  <Check size={16} aria-hidden className="mt-0.5 shrink-0 text-gold-dark" /> {f}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.22em] text-navy-deep">All six plot sizes</h3>
            <div className="mt-4 overflow-x-auto border border-line">
              <table className="w-full min-w-[420px] text-left text-[15px]">
                <thead>
                  <tr className="bg-navy-deep text-ivory">
                    <th scope="col" className="px-5 py-3 text-[12px] uppercase tracking-[0.16em]">Dimensions (ft)</th>
                    <th scope="col" className="px-5 py-3 text-[12px] uppercase tracking-[0.16em]">Area</th>
                    <th scope="col" className="px-5 py-3 text-[12px] uppercase tracking-[0.16em]">Facing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {plotSizes.map((s) => (
                    <tr key={s.dimensions} className={s.area === plot.sizeSqft ? 'bg-gold-mist font-semibold' : ''}>
                      <td className="px-5 py-3">{s.dimensions}</td>
                      <td className="px-5 py-3">{s.area} sq.ft.</td>
                      <td className="px-5 py-3">East &amp; West</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <EmiCalc />
          </Reveal>
        </div>

        <aside aria-label="Enquiry" className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <div className="border border-gold/40 bg-gold-mist/50 p-6 md:p-8">
              <p className="eyebrow">Price on request</p>
              <h2 className="mt-2 font-display text-2xl text-navy-deep">Enquire about this plot</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Call{' '}
                <a href={PROJECT.phones[0].href} className="font-bold text-navy-deep underline">
                  {PROJECT.phones[0].display}
                </a>{' '}
                for price &amp; availability, or send a visit request below.
              </p>
              <div className="mt-6">
                <InquiryForm subject={plot.title} />
              </div>
              <a href={PROJECT.phones[1].href} className="btn btn-primary mt-4 w-full">
                <Phone size={15} aria-hidden /> {PROJECT.phones[1].display}
              </a>
            </div>
          </Reveal>
        </aside>
      </div>

      {/* Similar */}
      <section aria-labelledby="similar-h" className="border-t border-line bg-ivory-deep/40">
        <div className="mx-auto max-w-shell px-5 py-14 md:px-10 md:py-20">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Keep exploring</p>
              <h2 id="similar-h" className="mt-3 font-display text-3xl text-navy-deep md:text-4xl">Similar plots</h2>
            </div>
            <Link href="/plots" className="btn btn-outline-dark hidden sm:inline-flex">
              All plots <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {similar.map((p) => (
              <PlotCard key={p.id} plot={p} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
