import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IMPERIUM AI - Master the Art of Power',
  description: 'Learn from history\'s greatest strategists',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-imperial-black text-imperial-cream min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}