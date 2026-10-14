import config from '../../../../payload.config';
import { RootPage } from '@payloadcms/next/views';
import { importMap } from '../importMap';

type Args = {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminPage({ params, searchParams }: Args) {
  return RootPage({
    config,
    params: params as Promise<{ segments: string[] }>,
    searchParams: searchParams as Promise<{ [key: string]: string | string[] }>,
    importMap,
  });
}
