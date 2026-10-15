import type { Payload } from 'payload';
import { PROJECT, amenities, banks, gallery, plots } from '../data/project';

/**
 * Seeds CMS content from the built-in catalogue on first boot.
 * Runs once — existing documents are never overwritten.
 */
export async function seedContent(payload: Payload): Promise<void> {
  // Counts in parallel — one round-trip instead of four sequential ones.
  const [plotCount, amenityCount, galleryCount, settings] = await Promise.all([
    payload.count({ collection: 'plots' }),
    payload.count({ collection: 'amenities' }),
    payload.count({ collection: 'gallery' }),
    payload.findGlobal({ slug: 'site-settings' }),
  ]);

  const jobs: Promise<unknown>[] = [];

  if (plotCount.totalDocs === 0) {
    jobs.push(
      Promise.all(
        plots.map((p) =>
          payload.create({
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
          }),
        ),
      ).then(() => payload.logger.info('Seeded 6 plots')),
    );
  }

  if (amenityCount.totalDocs === 0) {
    jobs.push(
      Promise.all(
        amenities.map((a) =>
          payload.create({
            collection: 'amenities',
            data: { title: a.title, description: a.description, image: a.image },
          }),
        ),
      ).then(() => payload.logger.info(`Seeded ${amenities.length} amenities`)),
    );
  }

  if (galleryCount.totalDocs === 0) {
    jobs.push(
      Promise.all(
        gallery.map((g) =>
          payload.create({
            collection: 'gallery',
            data: { src: g.src, title: g.title, category: g.category },
          }),
        ),
      ).then(() => payload.logger.info(`Seeded ${gallery.length} gallery frames`)),
    );
  }

  if (!settings?.marketer) {
    jobs.push(
      payload
        .updateGlobal({
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
        })
        .then(() => payload.logger.info('Seeded site settings')),
    );
  }

  await Promise.all(jobs);
}
