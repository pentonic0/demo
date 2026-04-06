import type { Metadata } from 'next';
import PrincipalMessage from '@/src/components/pages/site/PrincipalMessage';

export const metadata: Metadata = {
  title: 'অধ্যক্ষের বাণী',
  description: 'অধ্যক্ষের পূর্ণ বার্তা।',
};

export default function PrincipalMessagePage() {
  return <PrincipalMessage />;
}
