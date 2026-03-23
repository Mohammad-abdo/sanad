/**
 * خطوط لوحة التحكم — تُحمَّل من Google عند الحاجة وتُطبَّق عبر --app-font-stack
 */

export const DEFAULT_PRIMARY_FONT = 'Alexandria';
export const DEFAULT_SECONDARY_FONT = 'Cairo';

/** خيارات القائمة في الإعدادات (القيمة = اسم العائلة في CSS) */
export const ADMIN_FONT_OPTIONS = [
  { value: 'Alexandria', label: 'Alexandria' },
  { value: 'Cairo', label: 'Cairo' },
  { value: 'Tajawal', label: 'Tajawal' },
  { value: 'Almarai', label: 'Almarai' },
  { value: 'Changa', label: 'Changa' },
  { value: 'IBM Plex Sans Arabic', label: 'IBM Plex Sans Arabic' },
  { value: 'Noto Sans Arabic', label: 'Noto Sans Arabic' },
  { value: 'Amiri', label: 'Amiri' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
];

/**
 * مواصفات Google Fonts API v2 (بدون البادئة family=)
 * خطوط النظام: null
 */
const GOOGLE_FONT_SPECS = {
  Alexandria: 'Alexandria:wght@100;200;300;400;500;600;700',
  Cairo: 'Cairo:wght@300;400;500;600;700',
  Tajawal: 'Tajawal:wght@300;400;500;700',
  Almarai: 'Almarai:wght@300;400;700;800',
  Changa: 'Changa:wght@400;500;600;700',
  'IBM Plex Sans Arabic': 'IBM+Plex+Sans+Arabic:wght@400;500;600;700',
  'Noto Sans Arabic': 'Noto+Sans+Arabic:wght@400;500;600;700',
  Amiri: 'Amiri:wght@400;700',
  Inter: 'Inter:wght@400;500;600;700',
  Roboto: 'Roboto:wght@400;500;700',
  Arial: null,
};

function quoteFamily(name) {
  if (!name || typeof name !== 'string') return 'sans-serif';
  return /\s/.test(name) ? `"${name.replace(/"/g, '\\"')}"` : name;
}

function buildGoogleFontsHref(fontNames) {
  const specs = [...new Set(fontNames)]
    .map((n) => GOOGLE_FONT_SPECS[n])
    .filter(Boolean);
  if (specs.length === 0) return null;
  const q = specs.map((s) => `family=${encodeURIComponent(s)}`).join('&');
  return `https://fonts.googleapis.com/css2?${q}&display=swap`;
}

/**
 * يطبّق الخط على document.documentElement ويحمّل Google Fonts عند الحاجة
 */
export function applyAppFonts(primary = DEFAULT_PRIMARY_FONT, secondary = DEFAULT_SECONDARY_FONT) {
  const p = primary?.trim() || DEFAULT_PRIMARY_FONT;
  const s = secondary?.trim() || DEFAULT_SECONDARY_FONT;

  const href = buildGoogleFontsHref([p, s]);
  const LINK_ID = 'sanad-admin-google-fonts';

  if (href) {
    let link = document.getElementById(LINK_ID);
    if (!link) {
      link = document.createElement('link');
      link.id = LINK_ID;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = href;
  }

  const stack = `${quoteFamily(p)}, ${quoteFamily(s)}, Arial, sans-serif`;
  document.documentElement.style.setProperty('--app-font-stack', stack);
}
