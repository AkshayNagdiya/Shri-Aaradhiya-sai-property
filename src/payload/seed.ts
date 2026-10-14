import type { Payload } from 'payload';
import { PROJECT, amenities, banks, gallery, plots } from '../data/project.ts';

/**
 * Seeds CMS content from the built-in catalogue on first boot.
 * Runs once — existing documents are never overwritten.
 */
export async function seedContent(payload: Payload): Promise<void> {
  const plotCount = await payload.count({ collection: 'plots' });
  if (plotCount.totalDocs === 0) {
    for (const p of plots) {
      await payload.create({
        collection: 'plots',
        data: {
          title: p.title,
          slug: p.slug,
          dimensions: p.dimensions,
          sizeSqft: p.sizeSqft,
          facing: p.facing,
          status: p.status,
          tagline: p.tagline,
          description: [...p.description],
          images: [...p.images],
          dateAdded: new Date(p.dateAdded).toISOString(),
        },
      });
    }
    payload.logger.info('Seeded 6 plots');
  }

  const amenityCount = await payload.count({ collection: 'amenities' });
  if (amenityCount.totalDocs === 0) {
    for (const a of amenities) {
      await payload.create({
        collection: 'amenities',
        data: { title: a.title, description: a.description, image: a.image },
      });
    }
    payload.logger.info(`Seeded ${amenities.length} amenities`);
  }

  const galleryCount = await payload.count({ collection: 'gallery' });
  if (galleryCount.totalDocs === 0) {
    for (const g of gallery) {
      await payload.create({
        collection: 'gallery',
        data: { src: g.src, title: g.title, category: g.category },
      });
    }
    payload.logger.info(`Seeded ${gallery.length} gallery frames`);
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' });
  if (!settings?.marketer) {
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        name: PROJECT.name,
        tagline: PROJECT.tagline,
        heroOffer: PROJECT.heroOffer,
        location: PROJECT.location,
        invite: PROJECT.invite,
        reraNo: PROJECT.reraNo,
        tcpNo: PROJECT.tcpNo,
        phones: PROJECT.phones.map((p) => ({ display: p.display, href: p.href })),
        marketer: PROJECT.marketer,
        marketerTagline: PROJECT.marketerTagline,
        marketerSince: PROJECT.marketerSince,
        architect: PROJECT.architect,
        architectScope: PROJECT.architectScope,
        client: PROJECT.client,
        mapUrl: PROJECT.mapUrl,
        instagramUrl: PROJECT.instagramUrl,
        banks: [...banks],
      },
    });
    payload.logger.info('Seeded site settings');
  }
}
