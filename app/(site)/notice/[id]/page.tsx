import type { Metadata } from 'next';
import NoticePage from '@/src/components/pages/site/NoticePage';

export const metadata: Metadata = {
  title: 'নোটিশ বিস্তারিত',
  description: 'নির্বাচিত নোটিশের বিস্তারিত।',
};

export default async function NoticeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoticePage id={id} />;
}
