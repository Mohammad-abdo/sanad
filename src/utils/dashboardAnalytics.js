const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
];

const BOOKING_STATUS_AR = {
  COMPLETED: 'مكتمل',
  PENDING: 'معلق',
  CANCELLED: 'ملغي',
  CONFIRMED: 'مؤكد',
  REJECTED: 'مرفوض',
};

export function getBookingCountByStatus(bookingStats, status) {
  const row = (bookingStats || []).find((s) => s.status === status);
  if (!row) return 0;
  const c = row._count;
  if (typeof c === 'number') return c;
  if (c && typeof c._all === 'number') return c._all;
  if (c && typeof c.status === 'number') return c.status;
  return Object.values(c || {})[0] || 0;
}

export function bookingStatsToChart(bookingStats) {
  const colors = {
    COMPLETED: '#22c55e',
    PENDING: '#f59e0b',
    CANCELLED: '#ef4444',
    CONFIRMED: '#875FD8',
    REJECTED: '#94a3b8',
  };
  return (bookingStats || [])
    .map((s) => ({
      name: BOOKING_STATUS_AR[s.status] || s.status,
      value: getBookingCountByStatus([s], s.status),
      color: colors[s.status] || '#875FD8',
    }))
    .filter((d) => d.value > 0);
}

export function aggregateRevenueByMonth(revenueByDate) {
  const map = new Map();
  (revenueByDate || []).forEach((row) => {
    const d = new Date(row.createdAt);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const prev = map.get(key) || 0;
    map.set(key, prev + (row._sum?.amount || 0));
  });
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, revenue]) => {
      const [, month] = key.split('-').map(Number);
      return { name: MONTHS_AR[month], revenue };
    });
}

export function userStatusPieData(stats) {
  const active = stats?.activeUsers || 0;
  const total = stats?.totalUsers || 0;
  const inactive = Math.max(0, total - active);
  return [
    { name: 'نشط', value: active, color: '#875FD8' },
    { name: 'غير نشط', value: inactive, color: '#A384E1' },
    { name: 'أطباء بانتظار', value: stats?.pendingDoctors || 0, color: '#C2ADEB' },
  ].filter((d) => d.value > 0);
}

export function bookingSuccessRate(bookingStats) {
  const completed = getBookingCountByStatus(bookingStats, 'COMPLETED');
  const total = (bookingStats || []).reduce(
    (sum, s) => sum + getBookingCountByStatus([s], s.status),
    0
  );
  if (!total) return null;
  return Math.round((completed / total) * 100);
}
