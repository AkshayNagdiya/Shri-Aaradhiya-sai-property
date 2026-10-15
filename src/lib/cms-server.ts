import 'server-only';

import { cache } from 'react';
import { getPayload } from './getPayload';
import {
  PROJECT as fallbackProject,
  amenities as fallbackAmenities,
  banks as fallbackBanks,
  gallery as fallbackGallery,
  plots as fallbackPlots,
  type Amenity,
  type GalleryImage,
  type Plot,
} from '../data/project';

export interface CmsSnapshot {
  project: typeof fallbackProject;
  plots: Plot[];
  amenities: Amenity[];
  gallery: GalleryImage[];
  banks: string[];
  /** true when values came from Payload; false when static fallback was used (CMS down / empty). */
  live: boolean;
}

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

const asString = (v: unknown, fb: string): string => (typeof v === 'string' && v ? v : fb);

function toPlot(d: Record<string, unknown>, i: number): Plot {
  const facing = d.facing === 'West' ? 'West' : 'East';
  const statusRaw = typeof d.status === 'string' ? d.status : '';
  const status = (['Available', 'New Release', 'Premium'] as const).includes(
    statusRaw as Plot['status'],
  )
    ? (statusRaw as Plot['status'])
    : 'Available';
  const images = asStrings(d.images);
  return {
    id: asString(d.id, `plot-${i}`),
    slug: asString(d.slug, `plot-${i}`),
    title: asString(d.title, 'Untitled plot'),
    dimensions: asString(d.dimensions, '—'),
    sizeSqft: typeof d.sizeSqft === 'number' ? d.sizeSqft : 0,
    facing,
    status,
    tagline: asString(d.tagline, ''),
    description: asStrings(d.description),
    images: images.length > 0 ? images : ['/images/main-gate.jpg'],
    dateAdded: asString(d.dateAdded, new Date().toISOString().slice(0, 10)),
  };
}

function toAmenity(d: Record<string, unknown>): Amenity {
  return {
    title: asString(d.title, 'Amenity'),
    description: asString(d.description, ''),
    image: asString(d.image, '/images/main-gate.jpg'),
  };
}

function toGallery(d: Record<string, unknown>): GalleryImage {
  const cat = asString(d.category, 'Project');
  const category = (['Entrance', 'Gardens', 'Sports', 'Master Plan', 'Project'] as const).includes(
    cat as GalleryImage['category'],
  )
    ? (cat as GalleryImage['category'])
    : 'Project';
  return { src: asString(d.src, '/images/main-gate.jpg'), title: asString(d.title, 'Render'), category };
}

/**
 * Fully-dynamic server fetch of ALL CMS content.
 * Results are de-duplicated per request (React cache) and held in a short
 * in-memory TTL so layout + metadata + sitemap don't hit Mongo 3x per page.
 * Falls back to static data if CMS is down/slow — never blocks first paint long.
 */
const TTL_MS = 30_000;
let memCache: { at: number; data: CmsSnapshot } | null = null;

const fetchSnapshot = cache(async (): Promise<CmsSnapshot> => {
  if (memCache && Date.now() - memCache.at < TTL_MS) return memCache.data;
  const snapshot: CmsSnapshot = {
    project: fallbackProject,
    plots: fallbackPlots,
    amenities: fallbackAmenities,
    gallery: fallbackGallery,
    banks: fallbackBanks,
    live: false,
  };

  try {
    const payload = await getPayload();
    // depth: 0 = no joins/population, select only what we render — much faster.
    // Race against a timeout so a cold Atlas cluster never blocks first paint.
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('cms-timeout')), 6000),
    );
    const query = Promise.all([
      payload.find({ collection: 'plots', limit: 30, sort: 'sizeSqft', depth: 0 }),
      payload.find({ collection: 'amenities', limit: 30, depth: 0 }),
      payload.find({ collection: 'gallery', limit: 30, depth: 0 }),
      payload.findGlobal({ slug: 'site-settings' }),
    ]);
    const [plotsRes, amenitiesRes, galleryRes, settings] = await Promise.race([query, timeout]);

    if (plotsRes.docs.length > 0) {
      snapshot.plots = plotsRes.docs.map((d, i) => toPlot(d as unknown as Record<string, unknown>, i));
    }
    if (amenitiesRes.docs.length > 0) {
      snapshot.amenities = amenitiesRes.docs.map((d) => toAmenity(d as unknown as Record<string, unknown>));
    }
    if (galleryRes.docs.length > 0) {
      snapshot.gallery = galleryRes.docs.map((d) => toGallery(d as unknown as Record<string, unknown>));
    }

    if (settings) {
      const g = settings as unknown as Record<string, unknown>;
      const banks = asStrings(g.banks);
      const phonesRaw = Array.isArray(g.phones) ? (g.phones as Record<string, unknown>[]) : [];
      const phones = phonesRaw
        .map((x) => ({ display: asString(x.display, ''), href: asString(x.href, '') }))
        .filter((x) => x.display && x.href);
      snapshot.project = {
        ...fallbackProject,
        name: asString(g.name, fallbackProject.name),
        tagline: asString(g.tagline, fallbackProject.tagline),
        heroOffer: asString(g.heroOffer, fallbackProject.heroOffer),
        location: asString(g.location, fallbackProject.location),
        invite: asString(g.invite, fallbackProject.invite),
        reraNo: asString(g.reraNo, fallbackProject.reraNo),
        tcpNo: asString(g.tcpNo, fallbackProject.tcpNo),
        phones: (phones.length > 0 ? phones : fallbackProject.phones) as typeof fallbackProject.phones,
        marketer: asString(g.marketer, fallbackProject.marketer),
        marketerTagline: asString(g.marketerTagline, fallbackProject.marketerTagline),
        marketerSince: asString(g.marketerSince, fallbackProject.marketerSince),
        architect: asString(g.architect, fallbackProject.architect),
        architectScope: asString(g.architectScope, fallbackProject.architectScope),
        client: asString(g.client, fallbackProject.client),
        mapUrl: asString(g.mapUrl, fallbackProject.mapUrl),
        instagramUrl: asString(g.instagramUrl, fallbackProject.instagramUrl),
      } as CmsSnapshot['project'];
      if (banks.length > 0) snapshot.banks = banks;
    }

    snapshot.live = true;
  } catch {
    // CMS unreachable/slow (e.g. DB down at build time) — static fallback keeps pages rendering.
  }

  if (snapshot.live) memCache = { at: Date.now(), data: snapshot };
  return snapshot;
});

export async function getCmsData(): Promise<CmsSnapshot> {
  return fetchSnapshot();
}

export async function getPlots(): Promise<Plot[]> {
  return (await getCmsData()).plots;
}

export async function getPlotBySlugServer(slug: string): Promise<Plot | undefined> {
  const { plots } = await getCmsData();
  return plots.find((p) => p.slug === slug);
}

export async function getPlotSlugs(): Promise<string[]> {
  return (await getCmsData()).plots.map((p) => p.slug);
}
