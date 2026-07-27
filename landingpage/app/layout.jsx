import { Barlow_Condensed, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--f-barlow',
  display: 'swap',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--f-playfair',
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--f-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://hibrands.in'),
  title: 'High-Converting Landing Pages & Websites | HiBrands',
  description:
    'HiBrands builds conversion-focused landing pages and fast, modern websites for paid ad campaigns. Lower your cost per lead and turn clicks into customers. Free quote in 24h.',
  keywords: [
    'landing page development',
    'website development',
    'conversion rate optimisation',
    'paid ads landing page',
    'lead generation',
    'HiBrands',
  ],
  openGraph: {
    title: 'High-Converting Landing Pages & Websites | HiBrands',
    description:
      'Conversion-focused landing pages and websites built for paid traffic. Lower CPA, more leads. Get a free quote in 24 hours.',
    type: 'website',
    siteName: 'HiBrands',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'High-Converting Landing Pages & Websites | HiBrands',
    description: 'Landing pages and websites engineered to turn paid clicks into customers.',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#060c15',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${barlow.variable} ${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
