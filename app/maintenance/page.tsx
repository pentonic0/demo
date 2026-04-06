import type { Metadata } from 'next';
import Maintenance from '@/src/components/pages/site/MaintenancePage';

export const metadata: Metadata = {
  title: 'রক্ষণাবেক্ষণ',
  description: 'ওয়েবসাইট রক্ষণাবেক্ষণাধীন।',
};

export default function MaintenancePage() {
  return <Maintenance />;
}
