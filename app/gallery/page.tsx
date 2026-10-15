'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '../../src/components/SectionHeading';
import Reveal from '../../src/components/Reveal';
import type { GalleryImage } from '../../src/data/project';
import { useCms } from '../../src/lib/cms';
import { usePageMeta } from '../../src/lib/seo';

export const dynamic = 'force-dynamic';

function buildGroups(gallery: GalleryImage[]): { title: string; copy: string; items: GalleryImage[] }[] {
  return (
  ['Entrance', 'Gardens', 'Sports', 'Master Plan', 'Project'] as const
).map((cat) => ({
  title:
    cat === 'Entrance'
      ? 'The Grand Entrance'
      : cat === 'Gardens'
        ? 'Gardens & Courts'
        : cat === 'Sports'
          ? 'Gym & Sports Deck'
          : cat === 'Master Plan'
            ? 'Master Layout'
            : 'From the Brochure',
  copy:
    cat === 'Entrance'
      ? 'Gate, avenue, signage walls and the secured boundary — first impressions, engineered.'
      : cat === 'Gardens'
        ? 'Musical courts, walkways and sit-outs inside the green core.'
        : cat === 'Sports'
          ? 'Open gym, badminton court and turfs, seen from eye level and above.'
          : cat === 'Master Plan'
            ? 'The numbered layout: 30-feet colony roads off a 40-feet main road.'
            : 'Amenity boards and presentations from the official brochure.',
  items: gallery.filter((g) => g.category === cat),
  }));
}

/* gallery index is resolved inline from live CMS data */

export default function Gallery() {
  const { project: PROJECT, amenities, gallery } = useCms();
  const groups = buildGroups(gallery);
  usePageMeta('Gallery & Amenities — Surya Greens', 'Official project renders: grand gate, theme gardens, open gym, sports turfs and the master layout plan.');
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((v) => (v !== null && v < gallery.length - 1 ? v + 1 : v));
      if (e.key === 'ArrowLeft') setLightbox((v) => (v !== null && v > 0 ? v - 1 : v));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="pt-[68px] md:pt-[106px]">
      <div className="border-b border-line bg-ivory-deep/50">
        <div className="mx-auto max-w-shell px-5 py-12 md:px-10 md:py-16">
          <SectionHeading
            eyebrow="Gallery & amenities"
            title="Walk Through Surya Greens."
            copy={`Official 3D renders by ${PROJECT.architect} plus the amenity deck from the project brochure. Click any render to view it large.`}
          />
        </div>
      </div>

      <div className="mx-auto max-w-shell px-5 py-10 md:px-10 md:py-14">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title} className="mb-14 last:mb-0">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                <h2 className="font-display text-2xl text-navy-deep md:text-3xl">{group.title}</h2>
                <p className="text-[12px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                  {group.items.length} {group.items.length === 1 ? 'render' : 'renders'}
                </p>
              </div>
              <p className="mt-3 max-w-2xl text-[14.5px] text-ink-muted">{group.copy}</p>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((g, i) => (
                <Reveal key={g.src} delay={Math.min(i * 0.04, 0.25)}>
                  <button
                    type="button"
                    onClick={() => setLightbox(gallery.findIndex((x) => x.src === g.src))}
                    className="zoom-frame group block w-full text-left"
                    aria-label={`Enlarge render: ${g.title}`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden border border-line">
                      <img src={g.src} alt={g.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>
                    <span className="mt-2 flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.16em] text-navy-deep">
                      {g.title}
                      <span aria-hidden className="text-gold-dark">⤢</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>
        ))}

        {/* amenity detail cards */}
        <div className="mt-16">
          <SectionHeading
            eyebrow="Amenity deck"
            title="Twelve Reasons to Stay Outdoors."
            copy="Each amenity from the brochure, paired with its render."
          />
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {amenities.map((a, i) => (
              <Reveal key={a.title} delay={Math.min(i * 0.04, 0.25)}>
                <article className="h-full border border-line bg-ivory transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <div className="zoom-frame aspect-[16/10] w-full overflow-hidden">
                    <img src={a.image} alt={a.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-display text-[21px] text-navy-deep">{a.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-ink-muted">{a.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* lightbox */}
      {lightbox !== null && gallery[lightbox] ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged view: ${gallery[lightbox].title}`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-deep/95 p-4 md:p-10"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            autoFocus
            aria-label="Close enlarged view"
            className="absolute right-5 top-5 inline-flex h-11 w-11 items-center justify-center border border-ivory/40 text-ivory hover:bg-ivory hover:text-navy-deep"
          >
            ✕
          </button>
          <button
            type="button"
            aria-label="Previous render"
            onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v !== null && v > 0 ? v - 1 : v)); }}
            className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/40 text-ivory hover:bg-ivory hover:text-navy-deep md:inline-flex"
          >
            <ArrowLeft size={20} aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next render"
            onClick={(e) => { e.stopPropagation(); setLightbox((v) => (v !== null && v < gallery.length - 1 ? v + 1 : v)); }}
            className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center border border-ivory/40 text-ivory hover:bg-ivory hover:text-navy-deep md:inline-flex"
          >
            <ArrowRight size={20} aria-hidden />
          </button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[lightbox].src} alt={gallery[lightbox].title} className="max-h-[80vh] w-auto border border-gold/40 object-contain" />
            <figcaption className="mt-3 flex items-center justify-between text-ivory">
              <span className="font-display text-xl">{gallery[lightbox].title}</span>
              <span className="text-sm text-ivory/60">
                {lightbox + 1} / {gallery.length}
              </span>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}
