import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/public/navbar';
import { Footer } from '@/components/public/footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SubhanPlays — Gaming, Coding & Technology',
  description: 'SubhanPlays — Minecraft, gaming, coding, hosting, and technology. Explore videos, projects, and everything I\'m building.',
  keywords: ['Minecraft', 'gaming', 'coding', 'hosting', 'Linux', 'infrastructure', 'software development', 'YouTube'],
  authors: [{ name: 'SubhanPlays' }],
  creator: 'SubhanPlays',
  publisher: 'SubhanPlays',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subhanplays.qzz.io',
    siteName: 'SubhanPlays',
    title: 'SubhanPlays — Gaming, Coding & Technology',
    description: 'SubhanPlays — Minecraft, gaming, coding, hosting, and technology. Explore videos, projects, and everything I\'m building.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SubhanPlays',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubhanPlays — Gaming, Coding & Technology',
    description: 'SubhanPlays — Minecraft, gaming, coding, hosting, and technology. Explore videos, projects, and everything I\'m building.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#030303',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main id="main-content" className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}