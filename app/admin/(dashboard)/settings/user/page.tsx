import UserSettings from '@/src/components/pages/admin/UserSettings';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'অ্যাকাউন্ট সেটিংস | অ্যাডমিন প্যানেল',
  description: 'আপনার প্রশাসনিক অ্যাকাউন্ট সেটিংস পরিচালনা করুন।',
};

export default function Page() {
  return <UserSettings />;
}
