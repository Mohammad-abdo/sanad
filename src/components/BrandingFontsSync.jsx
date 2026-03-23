import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { settings } from '../api/admin';
import {
  applyAppFonts,
  DEFAULT_PRIMARY_FONT,
  DEFAULT_SECONDARY_FONT,
} from '../utils/appFonts';

/**
 * بعد تسجيل الدخول: جلب إعدادات الخط من الـ API وتطبيقها على كل لوحة التحكم
 */
export function BrandingFontsSync({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await settings.get();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      applyAppFonts(DEFAULT_PRIMARY_FONT, DEFAULT_SECONDARY_FONT);
      return;
    }
    const raw = data?.data ?? data;
    if (!raw) return;
    applyAppFonts(
      raw.primaryFont || DEFAULT_PRIMARY_FONT,
      raw.secondaryFont || DEFAULT_SECONDARY_FONT
    );
  }, [isAuthenticated, data]);

  return children;
}
