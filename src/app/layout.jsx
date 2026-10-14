import '@fontsource-variable/bricolage-grotesque/opsz.css';
import '@fontsource-variable/geist/index.css';
import '@/index.css';
import '@/views/Inner.css';
import '@/views/Home.css';
import '@/views/Projects.css';
import '@/views/Blog.css';
import '@/components/Header/Header.css';
import '@/components/Footer/Footer.css';
import '@/components/Loader/Loader.css';
import '@/components/EnquirePanel/EnquirePanel.css';
import '@/components/BookingModal/BookingModal.css';
import '@/sections/CTA/CTA.css';
import '@/components/HeroVisuals.css';

import Header from '@/components/Header/Header.jsx';
import Footer from '@/components/Footer/Footer.jsx';
import EnquirePanel from '@/components/EnquirePanel/EnquirePanel.jsx';
import SiteChrome from '@/components/SiteChrome.jsx';
import { BookingProvider } from '@/components/BookingModal/BookingContext.jsx';
import { SITE_URL, SITE_NAME } from '@/seo/seo.config.js';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.png' },
  alternates: { types: { 'application/rss+xml': `${SITE_URL}/blog/rss.xml` } },
};

export const viewport = {
  themeColor: '#EEF3FF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body>
        <BookingProvider>
          <SiteChrome />
          <Header />
          <EnquirePanel />
          {children}
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
