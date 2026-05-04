/**
 * من يصل لأي مسار في لوحة التحكم (حسب دور الأدمن في قاعدة البيانات).
 * المطابقة: أطول بادئة أولاً — مثال `/users/abc` تُقارن مع `/users`.
 */
export const ROUTE_ACCESS = {
  '/dashboard': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'],
  '/users': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'],
  '/doctors': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/posts': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/bookings': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'],
  '/payments': ['SUPER_ADMIN', 'ADMIN'],
  '/withdrawals': ['SUPER_ADMIN', 'ADMIN'],
  '/wallets': ['SUPER_ADMIN', 'ADMIN'],
  '/admins': ['SUPER_ADMIN'],
  '/support': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'SUPPORT'],
  '/reports': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/settings': ['SUPER_ADMIN', 'ADMIN'],
  '/interests': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/tags': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/tips': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/coupons': ['SUPER_ADMIN', 'ADMIN'],
  '/activity-logs': ['SUPER_ADMIN', 'ADMIN'],
  '/onboarding': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/notifications': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
  '/content-moderation': ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'],
};

/** المسارات غير المعرّفة: لا يُفترض وصول دعم/مشرف لها */
const DEFAULT_ACCESS = ['SUPER_ADMIN', 'ADMIN'];

const sortedPrefixes = Object.keys(ROUTE_ACCESS).sort((a, b) => b.length - a.length);

/**
 * @param {string} pathname — مثال `/doctors/xyz`
 * @returns {string[]}
 */
export function getAllowedRolesForPath(pathname) {
  const path = (pathname || '/').split('?')[0] || '/';
  for (const prefix of sortedPrefixes) {
    if (path === prefix || path.startsWith(`${prefix}/`)) {
      return ROUTE_ACCESS[prefix];
    }
  }
  return DEFAULT_ACCESS;
}

/**
 * @param {string} pathname
 * @param {string} [role]
 * @returns {boolean}
 */
export function canAccessPath(pathname, role) {
  if (!role) return false;
  return getAllowedRolesForPath(pathname).includes(role);
}
