import type { Metadata } from 'next';
import History from '@/src/components/pages/site/History';

export const metadata: Metadata = {
  title: 'ইতিহাস',
  description: 'প্রতিষ্ঠানের ইতিহাস।',
};

export default function HistoryPage() {
  return <History />;
}
