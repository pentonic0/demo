'use client';

import { AuthProvider } from '@/src/contexts/AuthContext';
import { SettingsProvider } from '@/src/contexts/SettingsContext';
import { LanguageProvider } from '@/src/contexts/LanguageContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SettingsProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
