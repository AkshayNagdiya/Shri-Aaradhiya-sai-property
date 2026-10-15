'use client';

import Link from 'next/link';
import { ArrowUpRight, MapPin, Phone } from 'lucide-react';
import SectionHeading from '../../src/components/SectionHeading';
import Reveal from '../../src/components/Reveal';
import { connectivity } from '../../src/data/project';
import { useCms } from '../../src/lib/cms';
import { usePageMeta } from '../../src/lib/seo';

export const dynamic = 'force-dynamic';

export default function Location() {
  const { project: PROJECT } = useCms();
  usePageMeta(
    'Location & Connectivity — Surya Greens',
    'Surya Greens at Santer, Kishanganj–Mhow: colleges, hospitals, schools, shopping and entertainment within 10 km.',
  );

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-12 md:px-10 md:py-16">
          <SectionHeading
            eyebrow="Location"
            title="Santer, Kishanganj – Mhow."
            copy="On the Mhow–Indore road — near Krishi Ganj Colony, Mewara Hospital, Vijayant College, Kaila Mahan and the Veterinary College, with Indore’s essentials within 10 km."
          />
        </div>
      </div>

      <div className="mx-auto max-w-shell px-5 py-10 md:px-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <div className="border border-gold/40 bg-ivory">
              <img
                src="/images/route-map.jpg"
                alt="Route map showing Surya Greens on the Mhow–Indore road with QR code to scan for live location"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="flex flex-col gap-2 border-t border-line p-5 sm:flex-row sm:items-center sm:justify-between md:p-6">
                <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-navy-deep">
                  <MapPin size={16} aria-hidden className="text-gold-dark" />
                  Scan the QR — or open the live map directly
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={PROJECT.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary px-5 py-3 text-[12px]"
                  >
                    Open live map <ArrowUpRight size={14} aria-hidden />
                  </a>
                  {PROJECT.phones.map((p) => (
                    <a key={p.display} href={p.href} className="btn btn-outline-dark px-5 py-3 text-[12px]">
                      <Phone size={14} aria-hidden /> {p.display}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border border-line bg-navy-deep p-6 text-ivory md:p-8">
              <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-gold">Route snapshot</p>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-ivory/85">
                <li><strong className="text-ivory">Mhow ↔ Indore</strong> main road access at the top of the route</li>
                <li>Near <strong className="text-ivory">Krishi Ganj Colony</strong> and <strong className="text-ivory">Mewara Hospital</strong></li>
                <li>Close to <strong className="text-ivory">Vijayant College</strong>, <strong className="text-ivory">Kaila Mahan</strong> and the <strong className="text-ivory">Veterinary College</strong></li>
                <li>Colleges, hospitals, malls &amp; cinemas of Indore within <strong className="text-ivory">10 km</strong></li>
              </ul>
              <Link href="/contact" className="btn mt-6 bg-gold px-6 py-3.5 text-navy-deep hover:bg-gold-light">
                Plan a site visit <ArrowUpRight size={15} aria-hidden />
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <SectionHeading
            eyebrow="Within 10 km"
            title="Everything Daily Life Needs."
            copy="Schools, colleges, hospitals, defence offices, shopping and entertainment — transcribed from the project brochure."
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {connectivity.map((c, i) => (
              <Reveal key={c.title} delay={Math.min(i * 0.05, 0.25)}>
                <div className="h-full border border-line bg-ivory p-6 md:p-7">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-dark">
                    {String(i + 1).padStart(2, '0')} · {c.places.length} places
                  </p>
                  <h2 className="mt-1.5 font-display text-[22px] text-navy-deep">{c.title}</h2>
                  <ul className="mt-3 space-y-1.5 text-[14.5px] text-ink-muted">
                    {c.places.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
