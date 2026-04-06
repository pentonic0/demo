import type { Metadata } from 'next';
import Contact from '@/src/components/pages/site/Contact';

export const metadata: Metadata = {
  title: 'যোগাযোগ',
  description: 'যোগাযোগের তথ্য ও বার্তা পাঠান।',
};

export default function ContactPage() {
  return <Contact />;
}
