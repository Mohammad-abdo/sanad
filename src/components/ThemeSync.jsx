import { useLayoutEffect, useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { applyHtmlThemeClass } from '../utils/themeHtml';

/** يطبّق class `dark` على <html> ويتزامن مع Zustand (قبل الرسم لتفادي وميض/خلط الأنماط) */
export function ThemeSync({ children }) {
  const theme = useThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    applyHtmlThemeClass(theme);
  }, [theme]);

  // بعد اكتمال persist قد يتغير theme — نعيد المزامنة
  useEffect(() => {
    const api = useThemeStore.persist;
    if (!api?.onFinishHydration) return undefined;
    return api.onFinishHydration(() => {
      applyHtmlThemeClass(useThemeStore.getState().theme);
    });
  }, []);

  return children;
}
