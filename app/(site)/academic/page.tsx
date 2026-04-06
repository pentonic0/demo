import type { Metadata } from 'next';
import Academic from '@/src/components/pages/site/Academic';

export const metadata: Metadata = {
  title: 'একাডেমিক',
  description: 'একাডেমিক তথ্য, রুটিন ও সিলেবাস।',
};

export default function AcademicPage() {
  return <Academic />;
}
