import config from '../../payload.config';
import '@payloadcms/next/css';
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts';
import { importMap } from './admin/importMap';
import React from 'react';

export default async function PayloadLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout
      config={config}
      importMap={importMap}
      serverFunction={async (args) => handleServerFunctions({ ...args, config, importMap })}
    >
      {children}
    </RootLayout>
  );
}
