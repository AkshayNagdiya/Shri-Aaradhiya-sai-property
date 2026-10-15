'use client';

import Link from 'next/link';
import { ArrowLeft, Phone } from 'lucide-react';
import SectionHeading from '../../src/components/SectionHeading';
import PlotCard from '../../src/components/PlotCard';
import Reveal from '../../src/components/Reveal';
import { useCms } from '../../src/lib/cms';
import { usePageMeta } from '../../src/lib/seo';

export const dynamic = 'force-dynamic';

export default function Plots() {
  const { project: PROJECT, plots } = useCms();
  usePageMeta(
    'Plots & Sizes — Surya Greens',
    'Six plot formats from 600 to 1000 sq.ft., all east & west facing, at Santer, Kishanganj–Mhow.',
  );

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-12 md:px-10 md:py-16">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold uppercase tracking-[0.18em] text-gold-dark">
            <ArrowLeft size={15} aria-hidden /> Back home
          </Link>
          <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Plots & sizes"
              title="Six Formats. One Standard of Grandeur."
              copy="Every plot is east & west facing with the same gated infrastructure. Prices on enquiry — call for availability."
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              {PROJECT.phones.map((p) => (
                <a key={p.display} href={p.href} className="btn btn-primary px-6 py-3.5 text-[12px]">
                  <Phone size={14} aria-hidden /> {p.display}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-shell px-5 py-10 md:px-10 md:py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plots.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i * 0.05, 0.3)}>
              <PlotCard plot={p} ratio={i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-[4/3]'} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 border border-gold/40 bg-gold-mist/60 p-6 text-center md:p-10">
          <p className="eyebrow">Price &amp; availability</p>
          <p className="mx-auto mt-3 max-w-xl font-display text-2xl text-navy-deep md:text-3xl">
            Like a plot? Call us for the price and a Sunday site visit.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {PROJECT.phones.map((p) => (
              <a key={p.display} href={p.href} className="btn btn-primary">
                <Phone size={15} aria-hidden /> {p.display}
              </a>
            ))}
            <Link href="/contact" className="btn btn-outline-dark">
              Enquire online
            </Link>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
