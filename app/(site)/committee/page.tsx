import type { Metadata } from 'next';
import Committee from '@/src/components/pages/site/Committee';

export const metadata: Metadata = {
  title: 'কমিটি',
  description: 'গভর্নিং বডি ও কমিটির তথ্য।',
};

export default function CommitteePage() {
  return <Committee />;
}
