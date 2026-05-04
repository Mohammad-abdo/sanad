import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { settings } from '../api/admin';

/**
 * After login: load AppSettings and apply `dashboardTheme` (database — not localStorage).
 */
export function AdminSettingsSync() {
  const token = useAuthStore((s) => s.token);
  const setTheme = useThemeStore((s) => s.setTheme);

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => (await settings.get()).data,
    enabled: Boolean(token),
    staleTime: 60_000,
  });

  useEffect(() => {
    const raw = data?.data ?? data;
    if (!raw) return;
    const t = raw.dashboardTheme;
    if (t === 'dark' || t === 'light') {
      setTheme(t);
    }
  }, [data, setTheme]);

  return null;
}
