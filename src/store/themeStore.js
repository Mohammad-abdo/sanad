import { create } from 'zustand';

/**
 * Dashboard light/dark — source of truth is AppSettings.dashboardTheme in the API.
 * No localStorage: theme syncs from GET /admin/settings (authenticated) or public login preview.
 */
export const useThemeStore = create((set) => ({
  theme: 'light',
  setTheme: (t) => set({ theme: t === 'dark' ? 'dark' : 'light' }),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}));
