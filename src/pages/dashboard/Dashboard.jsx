import { useQuery } from '@tanstack/react-query';
import { dashboard } from '../../api/admin';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign,
  FileText,
  Headphones,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Target,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppCurrency } from '../../utils/currency';
import { useThemeStore } from '../../store/themeStore';

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

  const { data: stats, isLoading, isError, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboard.getStats();
      return response.data.data;
    },
  });

  const statCards = [
    {
      title: 'إجمالي المستخدمين',
      value: stats?.totalUsers || 0,
      icon: Users,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '+12%',
      changeType: 'positive',
      subtitle: 'مستخدم نشط'
    },
    {
      title: 'إجمالي الأطباء',
      value: stats?.totalDoctors || 0,
      icon: Stethoscope,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '+5%',
      changeType: 'positive',
      subtitle: 'طبيب معتمد'
    },
    {
      title: 'الحجوزات اليوم',
      value: stats?.todayBookings || 0,
      icon: Calendar,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '+8%',
      changeType: 'positive',
      subtitle: 'حجز جديد'
    },
    {
      title: 'الإيرادات اليوم',
      value: formatMoney(stats?.todayRevenue || 0),
      icon: DollarSign,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '+15%',
      changeType: 'positive',
      subtitle: 'إيرادات اليوم'
    },
    {
      title: 'المنشورات',
      value: stats?.totalPosts || 0,
      icon: FileText,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '+20%',
      changeType: 'positive',
      subtitle: 'منشور نشط'
    },
    {
      title: 'تذاكر الدعم المفتوحة',
      value: stats?.openSupportTickets || 0,
      icon: Headphones,
      iconBg: 'bg-gray-100',
      iconColor: 'text-primary-600',
      change: '-5%',
      changeType: 'negative',
      subtitle: 'تذكرة مفتوحة'
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="glass-card rounded-2xl p-8">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600 dark:border-primary-400" />
          <div className="font-medium text-gray-700 dark:text-slate-300">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  // Sample chart data (replace with real data from API)
  const revenueData = [
    { name: 'يناير', revenue: 4000, bookings: 120 },
    { name: 'فبراير', revenue: 3000, bookings: 90 },
    { name: 'مارس', revenue: 5000, bookings: 150 },
    { name: 'أبريل', revenue: 4500, bookings: 140 },
    { name: 'مايو', revenue: 6000, bookings: 180 },
    { name: 'يونيو', revenue: 5500, bookings: 170 },
  ];

  const userGrowthData = [
    { name: 'الأسبوع 1', users: 100, doctors: 20 },
    { name: 'الأسبوع 2', users: 150, doctors: 25 },
    { name: 'الأسبوع 3', users: 200, doctors: 30 },
    { name: 'الأسبوع 4', users: 250, doctors: 35 },
  ];

  const statusData = [
    { name: 'نشط', value: stats?.totalUsers || 0, color: '#875FD8' },
    { name: 'غير نشط', value: 50, color: '#A384E1' },
    { name: 'بانتظار', value: 20, color: '#C2ADEB' },
  ];

  const COLORS = ['#875FD8', '#A384E1', '#C2ADEB'];

  return (
    <div className="w-full space-y-6">
      {/* Welcome Header */}
      <div className="glass-card rounded-2xl border border-primary-200/80 bg-gradient-to-br from-white/95 via-primary-50/30 to-white/90 p-6 dark:border-primary-500/25 dark:from-slate-900/75 dark:via-primary-950/20 dark:to-slate-900/65">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">مرحباً بك في لوحة التحكم</h1>
            <p className="text-gray-600 dark:text-slate-400">نظرة عامة على أداء النظام والإحصائيات</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-primary-200/80 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-primary-500/30 dark:bg-slate-800/80 md:flex">
            <Clock className="text-primary-600 dark:text-primary-400" size={18} />
            <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === 'positive';
          return (
            <div
              key={index}
              className="group glass-card rounded-2xl border border-gray-200/90 p-6 transition-all duration-300 hover:border-primary-400/80 hover:shadow-xl dark:border-slate-600/50 dark:hover:border-primary-500/40"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className={`${stat.iconBg} rounded-xl border border-primary-200/80 p-3 transition-transform duration-300 group-hover:scale-110 dark:border-primary-500/30 dark:bg-slate-800/80`}
                >
                  <Icon className={`${stat.iconColor} dark:text-primary-300`} size={24} />
                </div>
                {isPositive ? (
                  <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 dark:bg-emerald-950/40">
                    <ArrowUpRight className="text-green-600 dark:text-emerald-400" size={14} />
                    <span className="text-xs font-semibold text-green-600 dark:text-emerald-400">{stat.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 rounded-lg bg-red-50 px-2 py-1 dark:bg-red-950/35">
                    <ArrowDownRight className="text-red-600 dark:text-red-400" size={14} />
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">{stat.change}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500 dark:text-slate-400">{stat.title}</p>
                <p className="mb-1 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-400 dark:text-slate-500">{stat.subtitle}</p>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4 dark:border-slate-700/60">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400">
                  {isPositive ? (
                    <TrendingUp className="text-green-500" size={12} />
                  ) : (
                    <TrendingDown className="text-red-500" size={12} />
                  )}
                  <span>من الشهر الماضي</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="glass-card flex items-center gap-3 rounded-xl p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-gray-100 dark:border-primary-500/30 dark:bg-slate-800/80">
            <CheckCircle className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">الحجوزات المكتملة</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.completedBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 rounded-xl p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-gray-100 dark:border-primary-500/30 dark:bg-slate-800/80">
            <Clock className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">الحجوزات المعلقة</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.pendingBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 rounded-xl p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-gray-100 dark:border-primary-500/30 dark:bg-slate-800/80">
            <XCircle className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">الحجوزات الملغاة</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{stats?.cancelledBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-3 rounded-xl p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary-200 bg-gray-100 dark:border-primary-500/30 dark:bg-slate-800/80">
            <Target className="text-primary-600 dark:text-primary-400" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-slate-400">معدل النجاح</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">94%</p>
          </div>
        </div>
      </div>

      {/* Charts Row — min-w-0 يمنع تمدد غريب على الشاشات العريضة */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="glass-card min-w-0 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">الإيرادات والحجوزات</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">آخر 6 أشهر</p>
            </div>
            <div className="shrink-0 rounded-lg border border-primary-200 bg-gray-100 p-2 dark:border-primary-500/30 dark:bg-slate-800/80">
              <BarChart3 className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#875FD8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#875FD8" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.55} />
              <XAxis dataKey="name" tick={axisTick} />
              <YAxis tick={axisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={legendStyle} />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14b8a6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name={`الإيرادات (${currency})`}
              />
              <Area 
                type="monotone" 
                dataKey="bookings" 
                stroke="#22c55e" 
                fillOpacity={1} 
                fill="url(#colorBookings)" 
                name="الحجوزات"
              />
            </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="glass-card min-w-0 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">نمو المستخدمين والأطباء</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">آخر 4 أسابيع</p>
            </div>
            <div className="shrink-0 rounded-lg border border-primary-200 bg-gray-100 p-2 dark:border-primary-500/30 dark:bg-slate-800/80">
              <TrendingUp className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
          </div>
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} opacity={0.55} />
              <XAxis dataKey="name" tick={axisTick} />
              <YAxis tick={axisTick} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend wrapperStyle={legendStyle} />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#875FD8" 
                strokeWidth={3}
                dot={{ fill: '#875FD8', r: 4 }}
                name="المستخدمين"
              />
              <Line 
                type="monotone" 
                dataKey="doctors" 
                stroke="#A384E1" 
                strokeWidth={3}
                dot={{ fill: '#A384E1', r: 4 }}
                name="الأطباء"
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Status Distribution */}
        <div className="glass-card min-w-0 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">توزيع الحالات</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">حالة المستخدمين</p>
            </div>
            <div className="rounded-lg border border-primary-200 bg-gray-100 p-2 dark:border-primary-500/30 dark:bg-slate-800/80">
              <PieChartIcon className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
          </div>
          <div className="h-[250px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card col-span-1 min-w-0 rounded-2xl p-6 transition-shadow duration-300 hover:shadow-xl lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">النشاط الأخير</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">آخر 10 أنشطة</p>
            </div>
            <div className="rounded-lg border border-primary-200 bg-gray-100 p-2 dark:border-primary-500/30 dark:bg-slate-800/80">
              <Zap className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
          </div>
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gradient-to-r from-gray-50 to-white p-4 transition-all duration-300 hover:border-primary-200 hover:shadow-md dark:border-slate-700/50 dark:from-slate-800/40 dark:to-slate-900/30 dark:hover:border-primary-500/35"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-primary-200 bg-gray-100 transition-transform group-hover:scale-110 dark:border-primary-500/30 dark:bg-slate-800/80">
                    <Activity className="text-primary-600 dark:text-primary-400" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.adminName || 'System'} - {activity.action} {activity.entityType}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400">
                      <Clock size={12} />
                      {new Date(activity.time).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary-600 dark:bg-primary-400" />
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800/80">
                  <Activity className="text-gray-400 dark:text-slate-500" size={32} />
                </div>
                <p className="font-medium text-gray-500 dark:text-slate-400">لا يوجد نشاط حديث</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">سيظهر النشاط هنا عند حدوث أي إجراء</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

