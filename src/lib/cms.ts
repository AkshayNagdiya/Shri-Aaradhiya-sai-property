'use client';

import { useEffect, useState } from 'react';
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

export interface CmsData {
  project: typeof fallbackProject;
  plots: Plot[];
  amenities: Amenity[];
  gallery: GalleryImage[];
  banks: string[];
  live: boolean;
}

const initial: CmsData = {
  project: fallbackProject,
  plots: fallbackPlots,
  amenities: fallbackAmenities,
  gallery: fallbackGallery,
  banks: fallbackBanks,
  live: false,
};

const asStrings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];

const asString = (v: unknown, fb: string): string => (typeof v === 'string' && v ? v : fb);

function toPlot(d: Record<string, unknown>, i: number): Plot {
  const facing = d.facing === 'West' ? 'West' : 'East';
  const statusRaw = typeof d.status === 'string' ? d.status : '';
  const status = (['Available', 'New Release', 'Premium'] as const).includes(
    statusRaw as (typeof fallbackPlots)[number]['status'],
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

function toPhones(v: unknown): CmsData['project']['phones'] {
  if (!Array.isArray(v)) return fallbackProject.phones;
  const list = v
    .filter((x): x is Record<string, unknown> => typeof x === 'object' && x !== null)
    .map((x) => ({ display: asString(x.display, ''), href: asString(x.href, '') }))
    .filter((x) => x.display && x.href);
  return (list.length > 0 ? list : fallbackProject.phones) as CmsData['project']['phones'];
}

async function getJson(path: string): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Live CMS data with instant static fallback.
 * Edit content at /admin — pages refresh from Payload automatically.
 */
export function useCms(): CmsData {
  const [data, setData] = useState<CmsData>(initial);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [plotsRes, amenitiesRes, galleryRes, settingsRes] = await Promise.all([
        getJson('/api/plots?limit=100&sort=sizeSqft'),
        getJson('/api/amenities?limit=100'),
        getJson('/api/gallery?limit=100'),
        getJson('/api/globals/site-settings'),
      ]);
      if (cancelled) return;

      const next: CmsData = { ...initial, live: true };

      const plotDocs = Array.isArray(plotsRes?.docs) ? (plotsRes.docs as Record<string, unknown>[]) : [];
      if (plotDocs.length > 0) next.plots = plotDocs.map(toPlot);

      const amenityDocs = Array.isArray(amenitiesRes?.docs)
        ? (amenitiesRes.docs as Record<string, unknown>[])
        : [];
      if (amenityDocs.length > 0) next.amenities = amenityDocs.map(toAmenity);

      const galleryDocs = Array.isArray(galleryRes?.docs)
        ? (galleryRes.docs as Record<string, unknown>[])
        : [];
      if (galleryDocs.length > 0) next.gallery = galleryDocs.map(toGallery);

      if (settingsRes) {
        const g = settingsRes;
        const banks = asStrings(g.banks);
        if (banks.length > 0) next.banks = banks;
        next.project = {
          ...fallbackProject,
          name: asString(g.name, fallbackProject.name),
          tagline: asString(g.tagline, fallbackProject.tagline),
          heroOffer: asString(g.heroOffer, fallbackProject.heroOffer),
          location: asString(g.location, fallbackProject.location),
          invite: asString(g.invite, fallbackProject.invite),
          reraNo: asString(g.reraNo, fallbackProject.reraNo),
          tcpNo: asString(g.tcpNo, fallbackProject.tcpNo),
          phones: toPhones(g.phones),
          marketer: asString(g.marketer, fallbackProject.marketer),
          marketerTagline: asString(g.marketerTagline, fallbackProject.marketerTagline),
          marketerSince: asString(g.marketerSince, fallbackProject.marketerSince),
          architect: asString(g.architect, fallbackProject.architect),
          architectScope: asString(g.architectScope, fallbackProject.architectScope),
          client: asString(g.client, fallbackProject.client),
          mapUrl: asString(g.mapUrl, fallbackProject.mapUrl),
          instagramUrl: asString(g.instagramUrl, fallbackProject.instagramUrl),
        } as CmsData['project'];
      }

      setData(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
