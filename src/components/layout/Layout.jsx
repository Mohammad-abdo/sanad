import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  FileText, 
  Calendar, 
  DollarSign, 
  Headphones, 
  FileBarChart, 
  Settings,
  LogOut,
  Menu,
  X,
  Tag,
  Ticket,
  Hash,
  Lightbulb,
  Bell,
  User,
  ChevronDown,
  Search,
  Moon,
  Sun,
  Shield,
  Wallet,
  Layers,
  Trash2,
  CheckCheck,
  ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { notifications } from '../../api/admin';
import toast from 'react-hot-toast';

const Layout = ({ children = null }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const userDropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, refetch: refetchNotifications } = useQuery({
    queryKey: ['admin-notifications-header'],
    queryFn: async () => {
      try {
        const response = await notifications.getAll({ page: 1, limit: 10 });
        return response.data.data;
      } catch (error) {
        return { notifications: [], unreadCount: 0 };
      }
    },
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  const notificationsList = notificationsData?.notifications || [];
  const unreadCount = notificationsData?.unreadCount || 0;

  // Play sound when new notifications arrive
  useEffect(() => {
    if (unreadCount > previousUnreadCount && previousUnreadCount > 0) {
      playNotificationSound();
    }
    setPreviousUnreadCount(unreadCount);
  }, [unreadCount, previousUnreadCount]);

  const playNotificationSound = () => {
    try {
      // Use Web Audio API for notification sound
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Pleasant notification tone
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (error) {
      // Silent fail if audio is not supported
      console.log('Audio notification not supported');
    }
  };

  const clearAllMutation = useMutation({
    mutationFn: notifications.clearAll,
    onSuccess: () => {
      toast.success('تم مسح جميع الإشعارات');
      refetchNotifications();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notifications.markAllAsRead,
    onSuccess: () => {
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
      refetchNotifications();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const handleClearAll = () => {
    clearAllMutation.mutate();
  };

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'لوحة التحكم' },
    { path: '/users', icon: Users, label: 'المستخدمين' },
    { path: '/doctors', icon: Stethoscope, label: 'الأطباء' },
    { path: '/posts', icon: FileText, label: 'المنشورات' },
    { path: '/bookings', icon: Calendar, label: 'الحجوزات' },
    { path: '/payments', icon: DollarSign, label: 'المدفوعات' },
    { path: '/withdrawals', icon: Wallet, label: 'طلبات السحب' },
    { path: '/wallets', icon: Wallet, label: 'محافظ الأطباء' },
    { path: '/support', icon: Headphones, label: 'الدعم' },
    { path: '/reports', icon: FileBarChart, label: 'التقارير' },
    { path: '/interests', icon: Tag, label: 'الاهتمامات' },
    { path: '/tags', icon: Hash, label: 'التاجات' },
    { path: '/tips', icon: Lightbulb, label: 'النصائح' },
    { path: '/coupons', icon: Ticket, label: 'الكوبونات' },
    { path: '/activity-logs', icon: FileText, label: 'سجل الأنشطة' },
    { path: '/onboarding', icon: Layers, label: 'التعريف (Onboarding)' },
    { path: '/notifications', icon: Bell, label: 'الإشعارات' },
    { path: '/content-moderation', icon: ShieldCheck, label: 'فلترة المحتوى' },
    ...(admin?.role === 'SUPER_ADMIN' ? [{ path: '/admins', icon: Shield, label: 'إدارة الأدمن' }] : []),
    { path: '/settings', icon: Settings, label: 'الإعدادات' },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('تم تسجيل الخروج بنجاح');
    navigate('/login');
  };

  // Close mobile drawer after route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const desktopNavLink = (active, expanded) =>
    `relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
      expanded ? 'gap-3 px-3 py-2.5' : 'justify-center px-2 py-3'
    } ${
      active
        ? 'bg-gradient-to-l from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/25'
        : 'text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white'
    }`;

  const mobileNavLink = (active) =>
    `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
      active
        ? 'bg-gradient-to-l from-primary-600 to-primary-500 text-white shadow-md shadow-primary-500/25'
        : 'text-slate-600 hover:bg-slate-100/90 dark:text-slate-300 dark:hover:bg-slate-800/70'
    }`;

  return (
    <div
      className={`relative flex h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950' : 'bg-[#f8fafc]'
      }`}
    >

      {/* Sidebar — مكتب: لوحة عائمة حديثة */}
      <aside
        className={`relative z-10 hidden h-[calc(100vh-2rem)] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-xl shadow-slate-200/40 backdrop-blur-xl transition-all duration-300 ease-out dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-black/30 md:flex ${
          sidebarOpen ? 'my-4 ms-4 w-[17.5rem]' : 'my-4 ms-4 w-[4.25rem]'
        }`}
      >
        <div className="border-b border-slate-200/80 bg-gradient-to-br from-primary-500/[0.08] via-transparent to-transparent px-4 py-5 dark:border-slate-700/60">
          <div
            className={`flex items-center ${sidebarOpen ? 'justify-between gap-2' : 'flex-col gap-3'}`}
          >
            {sidebarOpen ? (
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-lg shadow-primary-500/30">
                  س
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">سند</h1>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">لوحة التحكم</p>
                </div>
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-lg shadow-primary-500/30">
                س
              </div>
            )}
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0 rounded-xl border border-slate-200/90 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-primary-600 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label={sidebarOpen ? 'طي القائمة' : 'توسيع القائمة'}
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                title={!sidebarOpen ? item.label : undefined}
                className={desktopNavLink(active, sidebarOpen)}
              >
                <Icon className="shrink-0" size={20} strokeWidth={active ? 2.25 : 2} />
                {sidebarOpen && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {sidebarOpen && (
          <div className="border-t border-slate-200/80 p-3 dark:border-slate-700/60">
            <div className="glass-card rounded-xl border border-slate-200/80 p-3 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-md">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{admin?.name || 'Admin'}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-slate-400">{admin?.email || 'admin@sanad.com'}</p>
                  {admin?.role && (
                    <span className="mt-1 inline-block rounded-lg bg-primary-500/15 px-2 py-0.5 text-xs font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-300">
                      {admin.role === 'SUPER_ADMIN' ? 'مدير عام' : admin.role === 'ADMIN' ? 'أدمن' : admin.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* Mobile Sidebar Drawer — نفس الهوية */}
      <aside
        className={`fixed right-2 top-2 z-40 flex h-[calc(100vh-1rem)] w-[min(18rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white/95 shadow-2xl shadow-slate-300/40 backdrop-blur-xl transition-transform duration-300 ease-out dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-black/40 md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200/80 bg-gradient-to-br from-primary-500/[0.08] via-transparent to-transparent px-4 py-5 dark:border-slate-700/60">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white shadow-lg shadow-primary-500/30">
                  س
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">سند</h1>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">لوحة التحكم</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="shrink-0 rounded-xl border border-slate-200/90 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="إغلاق القائمة"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <nav className="custom-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto px-2 py-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={`mobile-${item.path}`}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLink(active)}
                >
                  <Icon className="shrink-0" size={20} strokeWidth={active ? 2.25 : 2} />
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200/80 p-3 dark:border-slate-700/60">
            <div className="glass-card rounded-xl border border-slate-200/80 p-3 dark:border-slate-600/50">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white shadow-md">
                  {admin?.name?.charAt(0) || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 dark:text-white">{admin?.name || 'Admin'}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-slate-400">{admin?.email || 'admin@sanad.com'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`relative flex min-w-0 flex-1 flex-col overflow-hidden ${
          theme === 'dark' ? 'bg-slate-950' : 'bg-[#f8fafc]'
        }`}
      >
        {/* Header */}
        <header className="glass-header relative z-50 overflow-visible px-6 py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden rounded-xl border border-gray-200 p-2 text-gray-700 transition-all duration-300 hover:border-primary-200 hover:bg-gray-50 hover:text-primary-600 dark:border-slate-600 dark:text-slate-200 dark:hover:border-primary-500/40 dark:hover:bg-slate-800/80 dark:hover:text-primary-300"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
              <div className="min-w-0">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {menuItems.find((item) => item.path === location.pathname)?.label || 'لوحة التحكم'}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-slate-400 truncate">
                {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            </div>
            <div className="relative z-50 flex items-center gap-3 overflow-visible sm:gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 dark:text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="input w-64 py-2 pl-10 pr-10"
                />
              </div>

              {/* Light / Dark */}
              <button
                type="button"
                onClick={() => toggleTheme()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white/90 text-amber-600 shadow-sm transition-all hover:border-primary-300 hover:text-primary-600 dark:border-slate-600 dark:bg-slate-800/90 dark:text-amber-300 dark:hover:border-primary-500/50 dark:hover:text-primary-300"
                title={theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن'}
                aria-label={theme === 'dark' ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Notifications */}
              <div className="relative z-[100] overflow-visible" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative z-[100] rounded-xl border border-gray-200 p-2 text-gray-600 transition-all duration-300 hover:border-primary-300 hover:bg-gray-50 hover:text-primary-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-primary-500/40 dark:hover:bg-slate-800/80 dark:hover:text-primary-300"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute left-0 mt-2 w-96 glass-strong rounded-2xl shadow-2xl z-[100] border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">الإشعارات</h3>
                      {notificationsList.length > 0 && (
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={() => {
                                markAllAsReadMutation.mutate();
                                setNotificationsOpen(false);
                              }}
                              className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary-300"
                              title="تحديد الكل كمقروء"
                            >
                              <CheckCheck size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              handleClearAll();
                              setNotificationsOpen(false);
                            }}
                            className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40"
                            title="مسح الكل"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notificationsList.length > 0 ? (
                        notificationsList.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-300 ${
                              !notification.isRead ? 'bg-blue-50/50' : ''
                            }`}
                            onClick={() => {
                              if (!notification.isRead) {
                                notifications.markAsRead(notification.id).then(() => {
                                  refetchNotifications();
                                });
                              }
                              setNotificationsOpen(false);
                              navigate('/notifications');
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm ${notification.isRead ? 'text-gray-600 dark:text-slate-400' : 'font-semibold text-gray-900 dark:text-white'}`}
                                >
                                  {notification.message || notification.title}
                                </p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-slate-500">
                                  {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                          <Bell className="mx-auto mb-2 text-gray-400 dark:text-slate-600" size={32} />
                          <p>لا توجد إشعارات</p>
                        </div>
                      )}
                    </div>
                    {notificationsList.length > 0 && (
                      <div className="border-t border-gray-200 p-3 text-center dark:border-slate-600/60">
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          عرض الكل
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Dropdown */}
              <div className="relative z-[100] overflow-visible" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl glass-btn text-gray-700 hover:bg-gray-50 transition-all duration-300 z-[100]"
                >
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center shadow-md">
                    <span className="text-primary-600 font-semibold text-sm">
                      {admin?.name?.charAt(0) || 'A'}
                    </span>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900">{admin?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500">{admin?.role || 'ADMIN'}</p>
                  </div>
                  <ChevronDown 
                    className={`text-gray-500 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} 
                    size={18} 
                  />
                </button>
                {userDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 glass-strong rounded-2xl shadow-2xl z-[100] border border-gray-200">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{admin?.name || 'Admin'}</p>
                      <p className="text-xs text-gray-500 mt-1">{admin?.email || 'admin@sanad.com'}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 transition-all duration-300"
                      >
                        <User size={18} />
                        <span className="text-sm">الملف الشخصي</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 text-gray-700 transition-all duration-300"
                      >
                        <Settings size={18} />
                        <span className="text-sm">الإعدادات</span>
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-300"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">تسجيل الخروج</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 relative z-0">
          <div className="relative w-full">{children || <Outlet />}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

