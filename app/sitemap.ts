import type { MetadataRoute } from 'next';
import { getPlotSlugs } from '../src/lib/cms-server';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
  const staticRoutes = ['', '/plots', '/gallery', '/location', '/about', '/contact'].map((route) => ({
    url: `${base}${route || '/'}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    const slugs = await getPlotSlugs();
    return [
      ...staticRoutes,
      ...slugs.map((slug) => ({
        url: `${base}/plots/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
