import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/authStore';
import { settings } from '../api/admin';
import { publicBranding } from '../api/public';
import {
  applyAppFonts,
  DEFAULT_PRIMARY_FONT,
  DEFAULT_SECONDARY_FONT,
} from '../utils/appFonts';

/**
 * يطبّق خطوط الإعدادات على كل لوحة التحكم وصفحة الدخول (Alexandria افتراضياً من السيرفر).
 */
export function BrandingFontsSync({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: authSettings } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const response = await settings.get();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 60_000,
    retry: 1,
  });

  const { data: publicRes } = useQuery({
    queryKey: ['public-admin-branding'],
    queryFn: async () => (await publicBranding.getAdminDashboard()).data,
    enabled: !isAuthenticated,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  useEffect(() => {
    if (isAuthenticated) {
      const raw = authSettings?.data ?? authSettings;
      if (raw) {
        applyAppFonts(
          raw.primaryFont || DEFAULT_PRIMARY_FONT,
          raw.secondaryFont || DEFAULT_SECONDARY_FONT
        );
      } else {
        applyAppFonts(DEFAULT_PRIMARY_FONT, DEFAULT_SECONDARY_FONT);
      }
      return;
    }
    const d = publicRes?.data;
    if (d) {
      applyAppFonts(
        d.primaryFont || DEFAULT_PRIMARY_FONT,
        d.secondaryFont || DEFAULT_SECONDARY_FONT
      );
    } else {
      applyAppFonts(DEFAULT_PRIMARY_FONT, DEFAULT_SECONDARY_FONT);
    }
  }, [isAuthenticated, authSettings, publicRes]);

  return children;
}
