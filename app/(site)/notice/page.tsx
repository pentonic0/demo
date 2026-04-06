import type { Metadata } from 'next';
import NoticePage from '@/src/components/pages/site/NoticePage';

export const metadata: Metadata = {
  title: 'নোটিশ',
  description: 'সকল নোটিশের তালিকা।',
};

export default function NoticeIndexPage() {
  return <NoticePage />;
}
