import './globals.css';

export const metadata = {
  title: 'Beauty Dokan BD',
  description: 'Your Trusted Destination for Premium Beauty Products. Discover authentic global skincare, makeup, hair care, body care and men\'s grooming products—all in one place.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
