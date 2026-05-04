/**
 * Axios baseURL must not end with `/` when request paths start with `/`,
 * or URLs become `...//api/admin/...` and some proxies/backends misbehave.
 * Also fixes env typos like `https://host//api` (double slash before path).
 */
export function normalizeApiBaseUrl(url) {
  let s = String(url ?? '').trim();
  if (!s) return 'http://localhost:3000/api';
  s = s.replace(/\/+$/, '');
  s = s.replace(/(https?:\/\/[^/]+)\/{2,}/i, '$1/');
  return s;
}
