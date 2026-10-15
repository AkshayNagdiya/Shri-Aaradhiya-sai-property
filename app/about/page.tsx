'use client';

import Link from 'next/link';
import { ArrowRight, Award, BadgeCheck, Landmark, ShieldCheck } from 'lucide-react';
import SectionHeading from '../../src/components/SectionHeading';
import Reveal from '../../src/components/Reveal';
import { legality } from '../../src/data/project';
import { useCms } from '../../src/lib/cms';
import { usePageMeta } from '../../src/lib/seo';

export const dynamic = 'force-dynamic';

export default function About() {
  const { project: PROJECT, banks } = useCms();
  usePageMeta(
    'About — Shri Aaradhya Sai Property',
    'RERA-approved Surya Greens, marketed by Shri Aaradhya Sai Property — The Name of Trust, since 2010.',
  );

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="relative overflow-hidden bg-navy-deep text-ivory">
        <img
          src="/images/signage-wall.jpg"
          alt=""
          aria-hidden
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/50 to-navy-deep" aria-hidden />
        <div className="relative mx-auto max-w-shell px-5 py-16 md:px-10 md:py-24">
          <Reveal>
            <p className="eyebrow !text-gold">About the project</p>
            <h1 className="mt-4 max-w-3xl font-display font-h2">For Grandeur Living — by a Name of Trust.</h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-ivory/75">
              Surya Greens pairs an architect-drawn gated layout with the sales discipline of {PROJECT.marketer} —{' '}
              {PROJECT.marketerTagline}, {PROJECT.marketerSince.toLowerCase()}.
            </p>
          </Reveal>
        </div>
      </div>

      {/* marketer */}
      <div className="mx-auto grid max-w-shell items-center gap-10 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="border border-gold/40 bg-ivory p-8 text-center md:p-10">
            <img
              src="/images/logo-sasp.jpg"
              alt="Shri Aaradhya Sai Property — The Name of Trust logo"
              loading="lazy"
              decoding="async"
              className="mx-auto max-h-64 w-auto object-contain"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="eyebrow">Marketed by</p>
          <h2 className="mt-4 font-display font-h2 text-navy-deep">{PROJECT.marketer}.</h2>
          <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-ink-muted">
            <p>
              <strong className="text-ink">“{PROJECT.marketerTagline}”</strong> — serving home buyers since{' '}
              <strong className="text-ink">2010</strong>, SASP markets Surya Greens end-to-end: site visits,
              transparent paperwork, RERA documentation and loan coordination with all leading banks.
            </p>
            <p>
              The layout itself is drawn by <strong className="text-ink">{PROJECT.architect}</strong> ({PROJECT.architectScope}),
              with a grand entrance portal, six theme gardens, sports turfs, an open gym and a 40-feet
              main road as its signature moves.
            </p>
          </div>
          <div className="mt-7 grid grid-cols-3 gap-5 border-t border-ink/15 pt-6">
            {[
              ['2010', 'Serving since'],
              ['11', 'Specs delivered'],
              ['10 km', 'City within reach'],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="font-display text-3xl text-navy-deep md:text-4xl">{n}</p>
                <p className="mt-1 text-[12.5px] uppercase tracking-[0.14em] text-ink-muted">{l}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* pillars */}
      <section aria-label="Why Surya Greens" className="border-y border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-14 md:px-10 md:py-20">
          <SectionHeading eyebrow="Why buyers choose us" title="Four Assurances, in Writing." />
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeCheck, t: 'RERA Approved', d: `Registered project — RERA No. ${PROJECT.reraNo}. Verify before you buy; we encourage it.` },
              { icon: ShieldCheck, t: 'Gated & Guarded', d: 'Security boundary walls, CCTV cameras and a staffed grand entrance gate.' },
              { icon: Landmark, t: 'Bank-Ready Titles', d: 'Loan facility from all leading banks with documentation support from SASP.' },
              { icon: Award, t: 'Architect-Drawn', d: `${PROJECT.architect} master plan — 40-ft main road, gardens and sports by design.` },
            ].map(({ icon: Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.06} className="bg-ivory">
                <div className="h-full p-7">
                  <span className="inline-flex h-11 w-11 items-center justify-center bg-navy-mist text-navy-deep">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 font-display text-[22px] text-navy-deep">{t}</h3>
                  <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-muted">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* legality */}
      <section aria-label="Legality" className="mx-auto max-w-shell px-5 py-14 md:px-10 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <Reveal>
            <SectionHeading
              eyebrow="Legality"
              title="Clear Titles, Published Numbers."
              copy="Approval numbers exactly as printed in the project brochure. Always verify RERA registration independently before booking."
            />
            <div className="mt-6 flex flex-wrap gap-2.5" aria-label="Partner banks">
              {banks.map((b) => (
                <span key={b} className="border border-navy/20 px-4 py-2 text-[13px] font-semibold text-navy-deep">
                  {b}
                </span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="divide-y divide-line border-y border-line">
              {legality.map((l) => (
                <div key={l.label} className="flex items-center justify-between gap-4 py-4">
                  <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-ink-muted">{l.label}</dt>
                  <dd className="text-right font-display text-lg text-navy-deep">{l.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[13.5px] leading-relaxed text-ink-faint">
              Project visuals: {PROJECT.architect} for client {PROJECT.client}. Marketed by {PROJECT.marketer} —{' '}
              {PROJECT.phones.map((p) => p.display).join(' / ')}.
            </p>
            <Link href="/contact" className="btn btn-primary mt-6">
              Ask for documents <ArrowRight size={16} aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
