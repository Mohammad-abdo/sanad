import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Stethoscope,
  Calendar,
  DollarSign,
  FileText,
  Headphones,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Wallet,
  ArrowLeft,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { dashboard } from '../../api/admin';
import { useAppCurrency } from '../../utils/currency';
import { useThemeStore } from '../../store/themeStore';
import {
  aggregateRevenueByMonth,
  bookingStatsToChart,
  bookingSuccessRate,
  getBookingCountByStatus,
  userStatusPieData,
} from '../../utils/dashboardAnalytics';
import { Card, CardHeader, CardTitle, CardDescription, PageSkeleton, StatCard, MiniStat } from '../../components/ui';

const Dashboard = () => {
  const { currency, formatMoney } = useAppCurrency();
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  const gridStroke = isDark ? '#475569' : '#e2e8f0';
  const axisTick = { fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 };
  const chartTooltipStyle = {
    backgroundColor: isDark ? '#1e293b' : '#ffffff',
    border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
    borderRadius: '12px',
    color: isDark ? '#f1f5f9' : '#111827',
    boxShadow: isDark ? '0 10px 40px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.08)',
  };
  const legendStyle = { color: isDark ? '#cbd5e1' : '#475569', fontSize: 12 };

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboard.getStats();
      return response.data.data;
    },
  });

  const { data: analytics } = useQuery({
    queryKey: ['dashboard-analytics'],
    queryFn: async () => {
      const response = await dashboard.getAnalytics({ period: 'daily' });
      return response.data.data;
    },
  });

  if (isLoading) {
    return <PageSkeleton rows={6} />;
  }

  const bookingStats = analytics?.bookingStats || [];
  const revenueData = aggregateRevenueByMonth(analytics?.revenueByDate);
  const statusPieData = userStatusPieData(stats);
  const bookingPieData = bookingStatsToChart(bookingStats);
  const successRate = bookingSuccessRate(bookingStats);

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.totalUsers ?? 0,
      subtitle: `${stats?.activeUsers ?? 0} نشط`,
      icon: Users,
      tone: 'violet',
    },
    {
      title: 'إجمالي الأطباء',
      value: stats?.totalDoctors ?? 0,
      subtitle: `${stats?.activeDoctors ?? 0} معتمد`,
      icon: Stethoscope,
      tone: 'emerald',
    },
    {
      title: 'الحجوزات اليوم',
      value: stats?.todayBookings ?? 0,
      subtitle: `${stats?.totalBookings ?? 0} إجمالي`,
      icon: Calendar,
      tone: 'sky',
    },
    {
      title: 'الإيرادات اليوم',
      value: formatMoney(stats?.todayRevenue ?? 0),
      subtitle: `إجمالي ${formatMoney(stats?.totalRevenue ?? 0)}`,
      icon: DollarSign,
      tone: 'amber',
    },
    {
      title: 'المنشورات',
      value: stats?.totalPosts ?? 0,
      subtitle: `${stats?.totalArticles ?? 0} مقال`,
      icon: FileText,
      tone: 'fuchsia',
    },
    {
      title: 'تذاكر الدعم المفتوحة',
      value: stats?.openSupportTickets ?? 0,
      subtitle: stats?.pendingWithdrawals ? `${stats.pendingWithdrawals} سحب معلق` : 'لا طلبات سحب',
      icon: Headphones,
      tone: 'orange',
    },
  ];

  const quickLinks = [
    { to: '/users', label: 'المستخدمين', icon: Users },
    { to: '/bookings', label: 'الحجوزات', icon: Calendar },
    { to: '/payments', label: 'المدفوعات', icon: DollarSign },
    { to: '/withdrawals', label: 'طلبات السحب', icon: Wallet },
  ];

  return (
    <div className="page-shell">
      {/* Welcome */}
      <Card className="overflow-hidden border-primary-200/60 bg-gradient-to-br from-white via-primary-50/40 to-white p-6 dark:border-primary-500/20 dark:from-slate-900/90 dark:via-primary-950/25 dark:to-slate-900/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">مرحباً بك في لوحة التحكم</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              نظرة عامة على أداء النظام — بيانات مباشرة من السيرفر
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-700 dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:border-primary-500/40 dark:hover:text-primary-300"
              >
                <Icon size={14} />
                {label}
                <ArrowLeft size={12} className="opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </div>

      {/* Booking quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniStat
          label="حجوزات مكتملة"
          value={getBookingCountByStatus(bookingStats, 'COMPLETED')}
          icon={CheckCircle}
          tone="success"
        />
        <MiniStat
          label="حجوزات معلقة"
          value={getBookingCountByStatus(bookingStats, 'PENDING')}
          icon={Clock}
          tone="warning"
        />
        <MiniStat
          label="حجوزات ملغاة"
          value={getBookingCountByStatus(bookingStats, 'CANCELLED')}
          icon={XCircle}
          tone="danger"
        />
        <MiniStat
          label="معدل إتمام الحجوزات"
          value={successRate != null ? `${successRate}%` : '—'}
          icon={AlertCircle}
          tone="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader
            action={
              <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-950/40">
                <BarChart3 className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
            }
          >
            <CardTitle>الإيرادات الشهرية</CardTitle>
            <CardDescription>آخر 6 أشهر — من بيانات المدفوعات</CardDescription>
          </CardHeader>
          <div className="h-[280px] w-full min-w-0">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#875FD8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#875FD8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.5} />
                  <XAxis dataKey="name" tick={axisTick} />
                  <YAxis tick={axisTick} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={legendStyle} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#875FD8"
                    fill="url(#colorRevenue)"
                    name={`الإيرادات (${currency})`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                لا توجد بيانات إيرادات في الفترة المحددة
              </div>
            )}
          </div>
        </Card>

        <Card className="min-w-0">
          <CardHeader
            action={
              <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-950/40">
                <PieChartIcon className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
            }
          >
            <CardTitle>توزيع حالات الحجوزات</CardTitle>
            <CardDescription>آخر 30 يوماً</CardDescription>
          </CardHeader>
          <div className="h-[280px] w-full min-w-0">
            {bookingPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {bookingPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                لا توجد حجوزات في الفترة المحددة
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-1">
          <CardHeader>
            <CardTitle>المستخدمون النشطون</CardTitle>
            <CardDescription>توزيع حالة المستخدمين</CardDescription>
          </CardHeader>
          <div className="h-[220px] w-full">
            {statusPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    dataKey="value"
                  >
                    {statusPieData.map((entry, index) => (
                      <Cell key={`u-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">لا بيانات</div>
            )}
          </div>
        </Card>

        <Card className="min-w-0 lg:col-span-2">
          <CardHeader
            action={
              <div className="rounded-lg bg-primary-50 p-2 dark:bg-primary-950/40">
                <Zap className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
            }
          >
            <CardTitle>النشاط الأخير</CardTitle>
            <CardDescription>آخر 10 إجراءات في النظام</CardDescription>
          </CardHeader>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition-colors hover:border-primary-200/80 dark:border-slate-700/50 dark:bg-slate-800/40 dark:hover:border-primary-500/30"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100 dark:bg-primary-950/50">
                    <Activity className="text-primary-600 dark:text-primary-400" size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                      {activity.adminName || 'النظام'} — {activity.action} {activity.entityType}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock size={11} />
                      {new Date(activity.time).toLocaleString('ar-EG')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                لا يوجد نشاط حديث
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Top interests */}
      {stats?.topInterests?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>أكثر الاهتمامات اختياراً</CardTitle>
            <CardDescription>من إعدادات المرضى</CardDescription>
          </CardHeader>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.topInterests.slice(0, 5).map((item) => (
              <div
                key={item.interestId}
                className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/40"
              >
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {item.interest?.nameAr || item.interest?.name || '—'}
                </p>
                <p className="mt-1 text-2xl font-bold text-primary-600 dark:text-primary-400">{item.count}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
