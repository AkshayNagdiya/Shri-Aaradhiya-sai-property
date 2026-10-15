import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import SiteChrome from '../src/components/SiteChrome';
import PageTransition from '../src/components/PageTransition';
import { getCmsData } from '../src/lib/cms-server';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0B1E3B',
};

export async function generateMetadata(): Promise<Metadata> {
  const { project } = await getCmsData();
  const title = `${project.marketer} — The Name of Trust | ${project.name}, Mhow`;
  const description =
    `${project.marketer} — ${project.marketerTagline}, ${project.marketerSince}. ` +
    `Presenting ${project.name}: RERA-approved premium residential plots ` +
    `(600–1000 sq.ft., east & west facing) at ${project.location}, ` +
    `with bank loans from all leading banks.`;
  return {
    title,
    description,
    openGraph: {
      title: `${project.marketer} — The Name of Trust`,
      description: `${project.heroOffer}. ${project.location}. ${project.invite}`,
      type: 'website',
      images: ['/images/hero-gate.jpg'],
    },
    twitter: {
      card: 'summary_large_image',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Shri Aaradhya Sai Property',
    slogan: 'The Name of Trust',
    foundingDate: '2010',
    telephone: ['+91-77249-85563', '+91-91316-44787'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Surya Greens, Santer, Kishanganj',
      addressLocality: 'Mhow',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    areaServed: 'Mhow, Indore',
    priceRange: '₹₹',
  };

  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <SiteChrome>
          <PageTransition>{children}</PageTransition>
        </SiteChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
