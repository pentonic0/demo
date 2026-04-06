import AdminDashboard from '@/src/components/pages/admin/Dashboard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminDashboard>{children}</AdminDashboard>;
}
