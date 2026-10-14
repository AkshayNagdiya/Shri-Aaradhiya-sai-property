import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope } from 'next/font/google';
import './globals.css';
import Header from '../src/components/Header';
import Footer from '../src/components/Footer';
import CookieConsent from '../src/components/CookieConsent';
import OfferPopup from '../src/components/OfferPopup';
import PageTransition from '../src/components/PageTransition';

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

export const metadata: Metadata = {
  title: 'Shri Aaradhya Sai Property — The Name of Trust | Surya Greens, Mhow',
  description:
    'Shri Aaradhya Sai Property — The Name of Trust, since 2010. Presenting Surya Greens: RERA-approved premium residential plots (600–1000 sq.ft., east & west facing) at Santer, Kishanganj–Mhow, with bank loans from all leading banks.',
  openGraph: {
    title: 'Shri Aaradhya Sai Property — The Name of Trust',
    description:
      'Premium plots at affordable price. Santer, Kishanganj – Mhow. Visit once and experience the difference.',
    type: 'website',
    images: ['/images/hero-gate.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B1E3B',
};

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <div className="flex min-h-screen flex-col bg-ivory text-ink">
          <Header />
          <main id="main" className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <CookieConsent />
          <OfferPopup />
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
