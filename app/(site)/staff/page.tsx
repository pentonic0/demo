import type { Metadata } from 'next';
import Staff from '@/src/components/pages/site/Staff';

export const metadata: Metadata = {
  title: 'কর্মচারীবৃন্দ',
  description: 'বিদ্যালয়ের কর্মচারীদের তালিকা।',
};

export default function StaffPage() {
  return <Staff />;
}
