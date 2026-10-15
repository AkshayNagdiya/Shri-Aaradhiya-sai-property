import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';
import { Amenities, Gallery, Inquiries, Media, Plots, Users } from './src/payload/collections';
import { SiteSettings } from './src/payload/globals';
import { seedContent } from './src/payload/seed';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-please-change',
  serverURL,
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/property-next',
    connectOptions: {
      // Fail fast instead of hanging the dev server for 30s when Atlas is cold/unreachable.
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      maxPoolSize: 10,
    },
  }),
  editor: lexicalEditor(),
  sharp,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '· Surya Greens CMS',
    },
  },
  collections: [Users, Media, Plots, Amenities, Gallery, Inquiries],
  globals: [SiteSettings],
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
  cors: serverURL ? [serverURL] : undefined,
  csrf: serverURL ? [serverURL] : undefined,
  onInit: async (payload) => {
    // Seed first admin from env so /admin is usable on first boot.
    // Counts run in parallel; creates run in parallel — never sequential awaits in a loop.
    try {
      const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL;
      const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD;
      if (adminEmail && adminPassword) {
        const existing = await payload.count({
          collection: 'users',
          where: { email: { equals: adminEmail } },
        });
        if (existing.totalDocs === 0) {
          await payload.create({
            collection: 'users',
            data: { email: adminEmail, password: adminPassword, name: 'Site Admin' },
          });
          payload.logger.info(`Created admin user ${adminEmail}`);
        }
      }
    } catch (err) {
      payload.logger.error(`Admin seed skipped: ${(err as Error).message}`);
    }
    try {
      // Don't block server startup on seeding — run in background.
      void seedContent(payload).catch((err: Error) => {
        payload.logger.error(`Content seed skipped: ${err.message}`);
      });
    } catch (err) {
      payload.logger.error(`Content seed skipped: ${(err as Error).message}`);
    }
  },
});
