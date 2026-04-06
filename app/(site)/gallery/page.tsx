import type { Metadata } from 'next';
import Gallery from '@/src/components/pages/site/Gallery';

export const metadata: Metadata = {
  title: 'গ্যালারি',
  description: 'ছবি ও কার্যক্রমের গ্যালারি।',
};

export default function GalleryPage() {
  return <Gallery />;
}
