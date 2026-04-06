import type { Metadata } from 'next';
import Home from '@/src/components/pages/site/Home';

export const metadata: Metadata = {
  title: 'হোম',
  description: 'প্রতিষ্ঠানের হোমপেজ',
};

export default function HomePage() {
  return <Home />;
}
