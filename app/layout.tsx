import './globals.css';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Beauty Dokan BD – Premium Beauty & Skincare',
  description:
    "Your Trusted Destination for Premium Beauty Products. Discover authentic global skincare, makeup, hair care, body care and men's grooming—all in one place.",
  icons: {
    icon: [{ url: '/logo65 copy.png', type: 'image/png', sizes: '65x65' }],
    shortcut: '/logo65 copy.png',
    apple: '/logo65 copy.png',
  },
  openGraph: {
    title: 'Beauty Dokan BD – Premium Beauty & Skincare',
    description: 'Your Trusted Destination for Premium Beauty Products.',
    siteName: 'Beauty Dokan BD',
    images: [{ url: '/logo65 copy.png' }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
