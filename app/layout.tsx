import type { Metadata, Viewport } from 'next';
import './globals.css';
import { StoreSettingsProvider } from '@/context/StoreSettingsContext';
import { CartProvider } from '@/context/CartContext';
import { ScrollToTop } from '@/components/ScrollToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://zohantraders.com'),
  title: 'ZOHAN TRADERS | Security, IT, Construction & Office Solutions',
  description:
    'Zohan Traders - Your trusted government and enterprise supplier in DG Khan & Pakistan. Security Systems, IT & Fiber Networks, Construction Raw Materials, Corporate Stationery & Modern Furniture.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'ZOHAN TRADERS — Security, IT & Construction Solutions',
    description:
      'Premier commercial trading and contracting partner in DG Khan. CCTV, Networks, Building Materials, Stationery & Workstations.',
    url: 'https://zohantraders.com',
    siteName: 'Zohan Traders',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Zohan Traders Logo and Enterprise Solutions',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0F172A" />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        <StoreSettingsProvider>
          <CartProvider>
            <ScrollToTop />
            {children}
          </CartProvider>
        </StoreSettingsProvider>
      </body>
    </html>
  );
}
