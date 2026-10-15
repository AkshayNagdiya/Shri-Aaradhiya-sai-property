import type { GlobalConfig } from 'payload';

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
  },
  fields: [
    { name: 'brand', type: 'text', admin: { description: 'Shown as Shri Aaradhya Sai Property' } },
    { name: 'name', type: 'text', admin: { description: 'Flagship project name' } },
    { name: 'tagline', type: 'text' },
    { name: 'heroTitle', type: 'text', admin: { description: 'Homepage hero headline' } },
    { name: 'heroOffer', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'invite', type: 'text' },
    { name: 'reraNo', type: 'text' },
    { name: 'tcpNo', type: 'text' },
    {
      name: 'phones',
      type: 'array',
      fields: [
        { name: 'display', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    { name: 'marketer', type: 'text' },
    { name: 'marketerTagline', type: 'text' },
    { name: 'marketerSince', type: 'text' },
    { name: 'architect', type: 'text' },
    { name: 'architectScope', type: 'text' },
    { name: 'client', type: 'text' },
    { name: 'mapUrl', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    {
      name: 'banks',
      type: 'text',
      hasMany: true,
      admin: { description: 'One bank per line.' },
    },
  ],
};
