import { useLayoutEffect } from 'react';
import { useThemeStore } from '../store/themeStore';
import { applyHtmlThemeClass } from '../utils/themeHtml';

/** يطبّق class `dark` على <html> — المصدر: قاعدة البيانات عبر useThemeStore */
export function ThemeSync({ children }) {
  const theme = useThemeStore((s) => s.theme);

  useLayoutEffect(() => {
    applyHtmlThemeClass(theme);
  }, [theme]);

  return children;
}
