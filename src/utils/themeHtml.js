/** مزامنة class الوضع على <html> */
export function applyHtmlThemeClass(theme) {
  const root = document.documentElement;
  const t = theme === 'dark' ? 'dark' : 'light';
  root.dataset.theme = t;
  if (t === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
}

/** قبل React: وضع فاتح مبدئي فقط (المظهر الحقيقي من قاعدة البيانات بعد التحميل) */
export function syncHtmlThemeFromStorage() {
  applyHtmlThemeClass('light');
}
