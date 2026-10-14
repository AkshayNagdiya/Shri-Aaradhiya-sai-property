'use client';

import Link from 'next/link';
import { ArrowUpRight, Compass, Ruler } from 'lucide-react';
import type { Plot } from '../data/project';

const statusStyle: Record<string, string> = {
  Available: 'bg-navy text-ivory',
  'New Release': 'bg-gold text-navy-deep',
  Premium: 'bg-navy-deep text-gold-light border border-gold/50',
};

export default function PlotCard({ plot, ratio = 'aspect-[4/3]' }: { plot: Plot; ratio?: string }) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/plots/${plot.slug}`}
        className="zoom-frame block bg-navy-mist"
        aria-label={`View ${plot.title}`}
      >
        <div className={`${ratio} w-full overflow-hidden`}>
          <img
            src={plot.images[0]}
            alt={`${plot.title} at Surya Greens`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <span className={`absolute left-4 top-4 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] ${statusStyle[plot.status]}`}>
          {plot.status}
        </span>
        <span className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center bg-ivory text-navy-deep opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <ArrowUpRight size={18} aria-hidden />
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-2 border border-t-0 border-line bg-ivory px-5 py-5 md:px-6 md:py-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-dark">
              {plot.dimensions} · {plot.facing} facing
            </p>
            <h3 className="mt-1 font-display text-[22px] leading-tight">
              <Link href={`/plots/${plot.slug}`} className="transition-colors hover:text-navy">
                {plot.title}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-ink-muted">{plot.tagline}</p>
          </div>
          <p className="whitespace-nowrap font-display text-[19px] font-medium text-navy-deep">
            {plot.sizeSqft} <span className="text-sm font-sans font-semibold">sq.ft.</span>
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-4 text-[13.5px] text-ink-muted">
          <span className="inline-flex items-center gap-1.5">
            <Ruler size={16} aria-hidden /> {plot.dimensions} ft
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Compass size={16} aria-hidden /> {plot.facing} facing
          </span>
        </div>
        <Link
          href={`/plots/${plot.slug}`}
          className="u-link mt-3 inline-flex w-fit items-center gap-1 text-[12.5px] font-bold uppercase tracking-[0.18em] text-navy-deep"
        >
          View plot <ArrowUpRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
