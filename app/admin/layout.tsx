import ClientWrapper from '@/components/ClientWrapper';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <ClientWrapper>{children}</ClientWrapper>;
}
