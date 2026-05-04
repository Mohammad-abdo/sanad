import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { adminAuth } from '../../api/admin';
import { publicBranding } from '../../api/public';
import toast from 'react-hot-toast';
import { LogIn, Shield, Sparkles, BarChart3, Lock } from 'lucide-react';

const features = [
  { icon: Shield, text: 'وصول آمن ومعتمد للمسؤولين' },
  { icon: BarChart3, text: 'إدارة المستخدمين والحجوزات والمالية' },
  { icon: Sparkles, text: 'واجهة سريعة ومظهر موحّد مع لوحة التحكم' },
];

const Login = () => {
  const { isAuthenticated, login } = useAuthStore();
  const navigate = useNavigate();
  const setTheme = useThemeStore((s) => s.setTheme);
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: brandingRes, isLoading: brandingLoading } = useQuery({
    queryKey: ['public-admin-branding'],
    queryFn: async () => (await publicBranding.getAdminDashboard()).data,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const branding = brandingRes?.data;

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
      return undefined;
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [hydrated, isAuthenticated, navigate]);

  useEffect(() => {
    if (!branding) return;
    if (branding.dashboardTheme === 'dark' || branding.dashboardTheme === 'light') {
      setTheme(branding.dashboardTheme);
    }
  }, [branding, setTheme]);

  const appName = branding?.appName || 'سند';
  const appNameEn = branding?.appNameEn || 'Sanad';
  const logo = branding?.logo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAuth.login({ email, password });

      if (response.data && response.data.success && response.data.data) {
        const { token, admin } = response.data.data;

        if (token && admin) {
          login(admin, token);
          toast.success('تم تسجيل الدخول بنجاح');
          navigate('/dashboard', { replace: true });
        } else {
          toast.error('خطأ في بيانات الاستجابة');
        }
      } else {
        toast.error('استجابة غير صحيحة من السيرفر');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'فشل تسجيل الدخول';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showFormSkeleton = !hydrated || (brandingLoading && !branding);

  return (
    <div
      className="min-h-screen w-full bg-[#f8fafc] font-sans dark:bg-slate-950"
      dir="rtl"
    >
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* نفس تدرجات primary المستخدمة في الشريط الجانبي والأزرار النشطة */}
        <div className="relative flex min-h-[220px] flex-1 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-600 via-primary-800 to-slate-950 px-8 py-10 text-white lg:min-h-screen lg:max-w-[46%] lg:px-12 lg:py-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            aria-hidden
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25)_0%,transparent_45%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_75%,rgba(135,95,216,0.45)_0%,transparent_50%)]" />
          </div>

          <div className="relative z-10">
            {logo ? (
              <div className="mb-6">
                <div className="mb-3 flex items-center gap-3">
                  <img
                    src={logo}
                    alt=""
                    className="h-12 w-auto max-w-[200px] object-contain drop-shadow-md"
                  />
                </div>
                <p className="text-sm font-medium text-white/85 lg:text-base">{appNameEn}</p>
              </div>
            ) : (
              <>
                <div className="mb-2 text-3xl font-bold tracking-tight text-white drop-shadow-sm lg:text-4xl">
                  {appName}
                </div>
                <p className="text-sm font-medium text-white/85 lg:text-base">{appNameEn}</p>
              </>
            )}
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80">
              لوحة التحكم لإدارة التطبيق — نفس ألوان وتدرجات واجهة الداشبورد.
            </p>
          </div>

          <ul className="relative z-10 mt-10 hidden space-y-4 lg:block">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/90">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-primary-500/25 backdrop-blur-sm">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="pt-1.5 leading-snug">{text}</span>
              </li>
            ))}
          </ul>
          <p className="relative z-10 mt-8 text-xs text-white/45">
            © {new Date().getFullYear()} {appName}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center bg-[#f8fafc] px-4 py-10 dark:bg-slate-950">
          <div className="w-full max-w-md">
            {showFormSkeleton ? (
              <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white/95 p-8 shadow-xl shadow-slate-200/40 dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-black/30">
                <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="space-y-3 pt-4">
                  <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                  <div className="h-10 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
                </div>
                <div className="h-12 animate-pulse rounded-2xl bg-primary-200/60 dark:bg-primary-900/40" />
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/95 dark:shadow-black/30">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
                    <Lock className="text-white" size={26} />
                  </div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    تسجيل الدخول
                  </h1>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    أدخل بيانات المسؤول للمتابعة
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input w-full rounded-xl border-slate-200 bg-white/90 text-slate-900 shadow-inner focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-800/90 dark:text-white"
                      placeholder="admin@sanad.app"
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      كلمة المرور
                    </label>
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input w-full rounded-xl border-slate-200 bg-white/90 text-slate-900 shadow-inner focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-slate-600 dark:bg-slate-800/90 dark:text-white"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary-600 to-primary-500 px-4 py-3.5 text-base font-semibold text-white shadow-md shadow-primary-500/25 transition hover:opacity-[0.97] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:ring-offset-slate-900"
                  >
                    {loading ? (
                      <>
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        جاري تسجيل الدخول…
                      </>
                    ) : (
                      <>
                        <LogIn size={20} />
                        دخول
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
