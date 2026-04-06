import type { Metadata } from 'next';
import TeachersPage from '@/src/components/pages/site/TeachersPage';

export const metadata: Metadata = {
  title: 'শিক্ষকবৃন্দ',
  description: 'প্রতিষ্ঠানের শিক্ষক তালিকা।',
};

export default function TeachersIndexPage() {
  return <TeachersPage />;
}
