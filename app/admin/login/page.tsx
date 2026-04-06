import type { Metadata } from 'next';
import AdminLogin from '@/src/components/pages/admin/Login';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Administrator login portal.',
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
