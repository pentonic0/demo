import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/src/components/Providers';
import AppBootstrap from '@/src/components/AppBootstrap';

export const metadata: Metadata = {
  title: {
    default: 'Institutional School Website',
    template: '%s | Institutional School Website',
  },
  description: 'Modern institutional school website built with Next.js App Router.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body>
        <Providers>
          <AppBootstrap>{children}</AppBootstrap>
        </Providers>
      </body>
    </html>
  );
}
