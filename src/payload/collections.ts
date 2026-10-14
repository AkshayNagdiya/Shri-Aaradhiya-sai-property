import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [],
};

export const Plots: CollectionConfig = {
  slug: 'plots',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sizeSqft', 'facing', 'status'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'dimensions', type: 'text', required: true },
    { name: 'sizeSqft', type: 'number', required: true },
    {
      name: 'facing',
      type: 'select',
      required: true,
      options: ['East', 'West'],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: ['Available', 'New Release', 'Premium'],
    },
    { name: 'tagline', type: 'text' },
    {
      name: 'description',
      type: 'text',
      hasMany: true,
      admin: { description: 'One paragraph per line.' },
    },
    {
      name: 'images',
      type: 'text',
      hasMany: true,
      admin: { description: 'Image paths, e.g. /images/main-gate.jpg' },
    },
    { name: 'dateAdded', type: 'date' },
  ],
};

export const Amenities: CollectionConfig = {
  slug: 'amenities',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'text' },
  ],
};

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'src', type: 'text', required: true },
    { name: 'title', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: ['Entrance', 'Gardens', 'Sports', 'Master Plan', 'Project'],
    },
  ],
};
