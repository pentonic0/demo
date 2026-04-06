'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LoadingScreen from '@/src/components/LoadingScreen';
import PopupBanner from '@/src/components/PopupBanner';
import { useSettings } from '@/src/contexts/SettingsContext';

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { settings, loading } = useSettings();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const isAdminPath = pathname.startsWith('/admin');
    const isMaintenancePage = pathname === '/maintenance';

    if (settings.maintenanceMode && !isAdminPath && !isMaintenancePage) {
      router.replace('/maintenance');
      return;
    }

    if (!settings.maintenanceMode && isMaintenancePage) {
      router.replace('/');
    }
  }, [loading, pathname, router, settings.maintenanceMode]);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <PopupBanner />
      {children}
    </>
  );
}
