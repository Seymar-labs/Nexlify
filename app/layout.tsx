import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Nexlify - Premium Digital Tools Platform',
  description: 'Fast, lossless, and professional tools for image processing, document management, and file conversion. Transform your files with AI-powered tools.',
  keywords: 'image compressor, PDF tools, video converter, file conversion, image optimization, AI tools',
  authors: [{ name: 'Nexlify' }],
  openGraph: {
    title: 'Nexlify - Premium Digital Tools Platform',
    description: 'Fast, lossless, and professional tools for image processing, document management, and file conversion.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='scroll-smooth'>
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className='min-h-screen flex flex-col bg-surface'>
        <Navbar />
        <main className='flex-1 pt-16 page-transition'>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}