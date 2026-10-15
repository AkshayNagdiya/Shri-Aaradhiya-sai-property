'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import OfferPopup from './OfferPopup';

/** Site chrome hides itself under /admin so the Payload studio gets a clean canvas. */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/');

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-ivory text-ink">
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <OfferPopup />
    </div>
  );
}
