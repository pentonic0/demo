import type { Metadata } from 'next';
import TeachersPage from '@/src/components/pages/site/TeachersPage';

export const metadata: Metadata = {
  title: 'শিক্ষক প্রোফাইল',
  description: 'নির্বাচিত শিক্ষকের বিস্তারিত তথ্য।',
};

export default async function TeacherDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TeachersPage id={id} />;
}
