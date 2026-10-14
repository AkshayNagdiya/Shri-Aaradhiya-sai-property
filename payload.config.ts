import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { Amenities, Gallery, Plots, Users } from './src/payload/collections.ts';
import { SiteSettings } from './src/payload/globals.ts';
import { seedContent } from './src/payload/seed.ts';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-please-change',
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/property-next',
  }),
  collections: [Users, Plots, Amenities, Gallery],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    try {
      await seedContent(payload);
    } catch (err) {
      payload.logger.error(`Content seed skipped: ${(err as Error).message}`);
    }
  },
});
