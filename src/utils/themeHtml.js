/** مزامنة class الوضع على <html> — يُستدعى قبل React وبعد rehydrate */
export function applyHtmlThemeClass(theme) {
  const root = document.documentElement;
  const t = theme === 'dark' ? 'dark' : 'light';
  root.dataset.theme = t;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

/** قراءة المظهر من localStorage (sanad-theme) — الافتراضي فاتح */
export function readStoredTheme() {
  try {
    const raw = localStorage.getItem('sanad-theme');
    if (!raw) return 'light';
    const parsed = JSON.parse(raw);
    const t = parsed?.state?.theme;
    return t === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function syncHtmlThemeFromStorage() {
  applyHtmlThemeClass(readStoredTheme());
}
