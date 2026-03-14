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
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadialBarChart, RadialBar } from 'recharts';

const Dashboard = () => {
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
      value: `${stats?.todayRevenue || 0} ج.م`,
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
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-gray-700 font-medium">جاري التحميل...</div>
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
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card rounded-2xl p-6 bg-white border border-primary-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">مرحباً بك في لوحة التحكم</h1>
            <p className="text-gray-600">نظرة عامة على أداء النظام والإحصائيات</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-primary-200">
            <Clock className="text-primary-600" size={18} />
            <span className="text-sm font-medium text-gray-700">
              {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Modern Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === 'positive';
          return (
            <div 
              key={index} 
              className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group border border-gray-200 hover:border-primary-400"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.iconBg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300 border border-primary-200`}>
                  <Icon className={stat.iconColor} size={24} />
                </div>
                {isPositive ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                    <ArrowUpRight className="text-green-600" size={14} />
                    <span className="text-xs font-semibold text-green-600">{stat.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-50 rounded-lg">
                    <ArrowDownRight className="text-red-600" size={14} />
                    <span className="text-xs font-semibold text-red-600">{stat.change}</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.subtitle}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-primary-200">
            <CheckCircle className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">الحجوزات المكتملة</p>
            <p className="text-lg font-bold text-gray-900">{stats?.completedBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-primary-200">
            <Clock className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">الحجوزات المعلقة</p>
            <p className="text-lg font-bold text-gray-900">{stats?.pendingBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-primary-200">
            <XCircle className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">الحجوزات الملغاة</p>
            <p className="text-lg font-bold text-gray-900">{stats?.cancelledBookings || 0}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center border border-primary-200">
            <Target className="text-primary-600" size={20} />
          </div>
          <div>
            <p className="text-xs text-gray-500">معدل النجاح</p>
            <p className="text-lg font-bold text-gray-900">94%</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">الإيرادات والحجوزات</h3>
              <p className="text-sm text-gray-500 mt-1">آخر 6 أشهر</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg border border-primary-200">
              <BarChart3 className="text-primary-600" size={20} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
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
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#14b8a6" 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                name="الإيرادات (ج.م)"
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

        {/* User Growth Chart */}
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">نمو المستخدمين والأطباء</h3>
              <p className="text-sm text-gray-500 mt-1">آخر 4 أسابيع</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg border border-primary-200">
              <TrendingUp className="text-primary-600" size={20} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
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

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">توزيع الحالات</h3>
              <p className="text-sm text-gray-500 mt-1">حالة المستخدمين</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg border border-primary-200">
              <PieChartIcon className="text-primary-600" size={20} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">النشاط الأخير</h3>
              <p className="text-sm text-gray-500 mt-1">آخر 10 أنشطة</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg border border-primary-200">
              <Zap className="text-primary-600" size={20} />
            </div>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 border border-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Activity className="text-primary-600" size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {activity.adminName || 'System'} - {activity.action} {activity.entityType}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(activity.time).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 animate-pulse"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Activity className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 font-medium">لا يوجد نشاط حديث</p>
                <p className="text-xs text-gray-400 mt-1">سيظهر النشاط هنا عند حدوث أي إجراء</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

