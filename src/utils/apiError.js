/**
 * Human-readable error message from axios / API responses (admin dashboard).
 */
export function getApiErrorMessage(error, fallback = 'حدث خطأ غير متوقع') {
  if (!error) return fallback;
  const d = error.response?.data;
  if (typeof d === 'string' && d.trim()) return d;
  if (d?.error?.message) return String(d.error.message);
  if (d?.message) return String(d.message);
  if (error.message) return error.message;
  return fallback;
}
