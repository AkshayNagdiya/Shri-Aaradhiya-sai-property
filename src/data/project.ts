/**
 * Surya Greens — project content transcribed from the official project brochure.
 * Location: Santer, Kishanganj – Mhow. Marketed by Shri Aaradhya Sai Property.
 */

export const PROJECT = {
  name: 'Surya Greens',
  tagline: 'For Grandeur Living',
  heroTitle: 'Your Own Space of Paradise',
  heroOffer: 'Premium plots at affordable price',
  location: 'Santer, Kishanganj – Mhow',
  invite: 'Visit Once and Experience the Difference!',
  reraApproved: true,
  reraNo: 'P-IND-26-6829',
  tcpNo: 'INDOL P306825 47800',
  phones: [
    { display: '77249-85563', href: 'tel:+917724985563' },
    { display: '91316-44787', href: 'tel:+919131644787' },
  ],
  marketer: 'Shri Aaradhya Sai Property',
  marketerTagline: 'The Name of Trust',
  marketerSince: 'Since 2010',
  architect: 'H|N Architects',
  architectScope: 'Architect · Interior Design · Planners',
  client: 'Rishi Shrivastava',
  mapUrl: 'https://maps.app.goo.gl/bjN8XqBagaGpGz6D8?g_st=aw',
  instagramUrl: 'https://www.instagram.com/sasp.shriaaradhyasaiproperties',
} as const;

/* ---------------------------------- plots --------------------------------- */

export type Facing = 'East' | 'West';
export type PlotStatus = 'Available' | 'New Release' | 'Premium';

export interface Plot {
  id: string;
  slug: string;
  title: string;
  dimensions: string;
  sizeSqft: number;
  facing: Facing;
  status: PlotStatus;
  tagline: string;
  description: string[];
  images: string[];
  dateAdded: string;
}

const plotImages: Record<string, string[]> = {
  starter: ['/images/entrance-avenue.jpg', '/images/garden-walkway.jpg', '/images/signage-wall.jpg'],
  family: ['/images/main-gate.jpg', '/images/open-gym.jpg', '/images/garden-music-2.jpg'],
  garden: ['/images/garden-music.jpg', '/images/garden-walkway.jpg', '/images/signage-wall-2.jpg'],
  corner: ['/images/hero-gate.jpg', '/images/garden-aerial.jpg', '/images/boundary-wall.jpg'],
  signature: ['/images/garden-aerial-2.jpg', '/images/boundary-wall-2.jpg', '/images/entrance-gate-2.jpg'],
  grandeur: ['/images/entrance-avenue-2.jpg', '/images/entrance-gate-2.jpg', '/images/open-gym.jpg'],
};

export const plots: Plot[] = [
  {
    id: 'plot-600',
    slug: '600-sqft-east-facing-plot',
    title: 'The 600 sq.ft. Starter Plot',
    dimensions: '15 × 40',
    sizeSqft: 600,
    facing: 'East',
    status: 'Available',
    tagline: 'A smart first step into gated plotted living.',
    description: [
      'A compact 15 × 40 east-facing plot inside the secured Surya Greens layout — ideal for a first home or a long-horizon holding near Mhow–Indore growth.',
      'Every plot shares the same development backbone: 40-feet main road and 30-feet colony roads, underground electricity, CCTV surveillance and the full garden-and-sports amenity deck.',
    ],
    images: plotImages.starter,
    dateAdded: '2026-06-10',
  },
  {
    id: 'plot-800',
    slug: '800-sqft-west-facing-plot',
    title: 'The 800 sq.ft. Family Plot',
    dimensions: '20 × 40',
    sizeSqft: 800,
    facing: 'West',
    status: 'Available',
    tagline: 'Room for a full family home with a garden edge.',
    description: [
      'A 20 × 40 west-facing plot with comfortable frontage for a duplex home, parking porch and a planted setback.',
      'Residents enjoy 6 theme-based gardens, the children’s play area, open gym, net-covered cricket and multi-sports turfs, and the project mandir — all within the secured boundary.',
    ],
    images: plotImages.family,
    dateAdded: '2026-06-10',
  },
  {
    id: 'plot-875',
    slug: '875-sqft-east-facing-plot',
    title: 'The 875 sq.ft. Garden Plot',
    dimensions: '20 × 43.9',
    sizeSqft: 875,
    facing: 'East',
    status: 'New Release',
    tagline: 'Extra depth for deeper verandahs and shade.',
    description: [
      'A 20 × 43.9 east-facing plot — the added depth suits wide living rooms, rear utility courts and mature planting.',
      'The layout’s 40-feet main road, underground electricity and security boundary walls with CCTV come standard across all releases.',
    ],
    images: plotImages.garden,
    dateAdded: '2026-08-22',
  },
  {
    id: 'plot-925',
    slug: '925-sqft-west-facing-plot',
    title: 'The 925 sq.ft. Corner-Feeling Plot',
    dimensions: '20 × 46.3',
    sizeSqft: 925,
    facing: 'West',
    status: 'New Release',
    tagline: 'A generous rectangle for a courtyard-style home.',
    description: [
      'A 20 × 46.3 west-facing plot with the proportions architects love — long enough for a central court, light wells and cross-ventilation.',
      'Loan facility is available from all leading banks, and the project is RERA approved for a transparent purchase.',
    ],
    images: plotImages.corner,
    dateAdded: '2026-08-22',
  },
  {
    id: 'plot-976',
    slug: '976-sqft-east-facing-plot',
    title: 'The 976 sq.ft. Signature Plot',
    dimensions: '20 × 48.10',
    sizeSqft: 976,
    facing: 'East',
    status: 'Premium',
    tagline: 'Near-grand format for a statement residence.',
    description: [
      'A 20 × 48.10 east-facing premium plot — build a double-height living pavilion, home office wing and a lawn that holds evening gatherings.',
      'Premium plots sit closest to the theme gardens and sports deck, minutes on foot from the grand entrance gate.',
    ],
    images: plotImages.signature,
    dateAdded: '2026-09-05',
  },
  {
    id: 'plot-1000',
    slug: '1000-sqft-west-facing-plot',
    title: 'The 1000 sq.ft. Grandeur Plot',
    dimensions: '20 × 50',
    sizeSqft: 1000,
    facing: 'West',
    status: 'Premium',
    tagline: 'The flagship format — for grandeur living.',
    description: [
      'A full 20 × 50 west-facing plot, the largest standard format at Surya Greens — the canvas for a true grandeurn residence with staff quarters and terrace decks.',
      'All plots are east & west facing across the development; pricing is shared on enquiry and bank loans can be arranged through leading banks.',
    ],
    images: plotImages.grandeur,
    dateAdded: '2026-09-05',
  },
];

export function getPlotBySlug(slug: string): Plot | undefined {
  return plots.find((p) => p.slug === slug);
}

export function getSimilarPlots(current: Plot, count = 3): Plot[] {
  const bySize = [...plots]
    .filter((p) => p.id !== current.id)
    .sort((a, b) => Math.abs(a.sizeSqft - current.sizeSqft) - Math.abs(b.sizeSqft - current.sizeSqft));
  return bySize.slice(0, count);
}

/* -------------------------------- amenities ------------------------------- */

export interface Amenity {
  title: string;
  description: string;
  image: string;
}

export const amenities: Amenity[] = [
  {
    title: 'Grand Main Gate',
    description: 'A brick-and-stone entrance portal with guard room that sets the tone — grandeur, from the first metre.',
    image: '/images/main-gate.jpg',
  },
  {
    title: '40-Feet Main Road',
    description: 'A wide, tree-lined 40-feet main road with paver finish and landscaped edges for unhurried arrivals.',
    image: '/images/entrance-avenue.jpg',
  },
  {
    title: 'Security Boundary Walls',
    description: 'Full-perimeter security boundary walls with CCTV camera surveillance across the development.',
    image: '/images/boundary-wall.jpg',
  },
  {
    title: '6 Theme-Based Gardens',
    description: 'Six designed theme gardens — including a musical garden court — for morning walks and evening rest.',
    image: '/images/garden-music.jpg',
  },
  {
    title: 'Open Gym',
    description: 'An open-air gym pavilion under a pergola, beside the badminton court, for fitness in fresh air.',
    image: '/images/open-gym.jpg',
  },
  {
    title: 'Net-Covered Cricket Turf',
    description: 'A dedicated net-covered cricket turf for serious practice without chasing balls across the colony.',
    image: '/images/garden-aerial.jpg',
  },
  {
    title: 'Multi Sports Turf',
    description: 'A net-covered multi-sports turf for football, tennis-practice and community tournaments.',
    image: '/images/garden-aerial-2.jpg',
  },
  {
    title: 'Kids Play Area',
    description: 'A safe, colourful children’s play area with modern equipment inside the green core.',
    image: '/images/garden-music-2.jpg',
  },
  {
    title: 'Project Mandir',
    description: 'A serene project mandir at the heart of the layout — faith, within walking distance.',
    image: '/images/signage-wall.jpg',
  },
  {
    title: 'Underground Electricity',
    description: 'Underground electrification keeps streetscapes clean, safe and free of overhead wires.',
    image: '/images/entrance-avenue-2.jpg',
  },
  {
    title: '30-Feet Colony Roads',
    description: '30-feet wide internal colony roads connect every block, with footpaths and avenue planting.',
    image: '/images/garden-walkway.jpg',
  },
  {
    title: 'CCTV Surveillance',
    description: 'CCTV cameras at the gate and across common areas for round-the-clock peace of mind.',
    image: '/images/entrance-gate-2.jpg',
  },
];

export const developmentSpecs: string[] = [
  '40 Feet Wide Main Road',
  '30 Feet Wide Colony Roads',
  'Underground Electricity',
  'Security Boundary Walls',
  'CCTV Camera',
  'Net Covered Multi Sports Turf',
  'Open Gym',
  'Net Covered Cricket Turf',
  '6 Theme Based Gardens',
  'Children’s Play Area',
  'Mandir',
];

/* -------------------------------- plot sizes ------------------------------ */

export const plotSizes = [
  { dimensions: '15 × 40', area: 600 },
  { dimensions: '20 × 40', area: 800 },
  { dimensions: '20 × 43.9', area: 875 },
  { dimensions: '20 × 46.3', area: 925 },
  { dimensions: '20 × 48.10', area: 976 },
  { dimensions: '20 × 50', area: 1000 },
];

/* ---------------------------------- banks --------------------------------- */

export const banks: string[] = [
  'State Bank of India',
  'ICICI Bank',
  'HDFC Bank',
  'Axis Bank',
  'YES Bank',
  'Canara Bank',
  'Bank of Baroda',
  'Union Bank of India',
  'IIFL Home Loan',
  'LIC Housing Finance',
];

/* -------------------------------- legality -------------------------------- */

export const legality: { label: string; value: string }[] = [
  { label: 'RERA No.', value: 'P-IND-26-6829' },
  { label: 'T&CP No.', value: 'INDOL P306825 47800' },
  { label: 'Colonizer Licence No.', value: 'Available on request' },
  { label: 'Diversion No.', value: 'Available on request' },
  { label: 'Development Permission No.', value: 'Available on request' },
];

/* ------------------------------- connectivity ----------------------------- */

export interface ConnectivityGroup {
  title: string;
  places: string[];
}

export const connectivity: ConnectivityGroup[] = [
  {
    title: 'Nearest Entertainment',
    places: [
      'Cine Wheels Drive-In, Windasa',
      'Fundore Entertainment Park',
      'Simcha Island — Adventure Park & Resort',
      'Carnival Cinema',
      'Vikram Mall',
    ],
  },
  {
    title: 'Nearest Colleges',
    places: [
      'Sapphire Institute of Management',
      'Vikrant Institute',
      'Veterinary College',
      'SD Bansal College',
      'Medi-Caps University',
      'IIM Indore',
      'IIT Indore',
      'Dental College',
      'Law College',
      'IIST',
      'SAGE University',
      'IPS College',
      'Degree College',
      'PG College',
    ],
  },
  {
    title: 'Nearest Defence Offices',
    places: ['Army War College', 'MCTE', 'EME', 'Infantry School'],
  },
  {
    title: 'Nearest Hospitals',
    places: [
      'Mewara Medicare & Eyecare Hospital',
      'Get Well Hospital',
      'Red Cross Hospital',
      'Shree Minesh Hospital',
      'Paliwal Clinic',
      'Madhya Bharat Hospital',
      'Dental Hospital',
      'Cancer Hospital',
      'Tiwari Hospital',
      'Military Hospital',
    ],
  },
  {
    title: 'Nearest Schools',
    places: [
      'Fountainhead International School',
      'Sideras International School',
      'Kendriya Vidyalaya',
      'Army Public School',
      'La Sagesse Academy',
      'Medi-Caps International School',
      'Sapphire Institute',
    ],
  },
  {
    title: 'Nearest Shopping',
    places: ['D-Mart', 'Walmart', 'Reliance Smart', 'Trinity Mall', 'Mhow Market', 'Rau Market'],
  },
];

/* --------------------------------- gallery -------------------------------- */

export interface GalleryImage {
  src: string;
  title: string;
  category: 'Entrance' | 'Gardens' | 'Sports' | 'Master Plan' | 'Project';
}

export const gallery: GalleryImage[] = [
  { src: '/images/hero-gate.jpg', title: 'Grand entrance gate', category: 'Entrance' },
  { src: '/images/main-gate.jpg', title: 'Main gate portal', category: 'Entrance' },
  { src: '/images/entrance-avenue.jpg', title: 'Tree-lined entry avenue', category: 'Entrance' },
  { src: '/images/entrance-avenue-2.jpg', title: 'Entry drive with hedges', category: 'Entrance' },
  { src: '/images/entrance-gate-2.jpg', title: 'Gatehouse view', category: 'Entrance' },
  { src: '/images/signage-wall.jpg', title: 'Project signage wall', category: 'Entrance' },
  { src: '/images/signage-wall-2.jpg', title: 'Signage court', category: 'Entrance' },
  { src: '/images/boundary-wall.jpg', title: 'Security boundary wall', category: 'Entrance' },
  { src: '/images/boundary-wall-2.jpg', title: 'Boundary wall frontage', category: 'Entrance' },
  { src: '/images/garden-music.jpg', title: 'Musical theme garden', category: 'Gardens' },
  { src: '/images/garden-music-2.jpg', title: 'Garden sit-out court', category: 'Gardens' },
  { src: '/images/garden-walkway.jpg', title: 'Garden walkway', category: 'Gardens' },
  { src: '/images/open-gym.jpg', title: 'Open gym pavilion', category: 'Sports' },
  { src: '/images/garden-aerial.jpg', title: 'Sports & gym deck (aerial)', category: 'Sports' },
  { src: '/images/garden-aerial-2.jpg', title: 'Garden & court deck (aerial)', category: 'Sports' },
  { src: '/images/master-plan.jpg', title: 'Master layout plan', category: 'Master Plan' },
  { src: '/images/amenities-board.jpg', title: 'Amenities presentation', category: 'Project' },
  { src: '/images/loan-banner.jpg', title: 'Loan facility presentation', category: 'Project' },
  { src: '/images/connectivity-board.jpg', title: 'Connectivity presentation', category: 'Project' },
];
