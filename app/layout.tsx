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
  metadataBase: new URL('https://www.beautydokan.com'),
  title: 'Beauty Dokan BD | All Premium Beauty & Skincare products',
  description:
    "Your Trusted Bangladeshi Destination for Premium Beauty Products. Discover authentic global beauty & skincare, makeup, hair care, body care, women clothes, Bags, women personal items and men's grooming—all in one place.",
  icons: {
    icon: [{ url: '/logo65 copy.png', type: 'image/png', sizes: '65x65' }],
    shortcut: '/logo65 copy.png',
    apple: '/logo65 copy.png',
  },
  openGraph: {
    title: 'Beauty Dokan BD | All Premium Beauty & Skincare products',
    description: "Your Trusted Bangladeshi Destination for Premium Beauty Products.",
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
