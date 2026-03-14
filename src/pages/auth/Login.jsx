import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { adminAuth } from '../../api/admin';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminAuth.login({ email, password });
      
      // Check response structure
      console.log('Login response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        const { token, admin } = response.data.data;
        
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Admin:', admin);
        
        if (token && admin) {
          login(admin, token);
          
          // Verify token was saved
          const savedToken = useAuthStore.getState().token;
          console.log('Token saved:', savedToken ? 'Yes' : 'No');
          
          toast.success('تم تسجيل الدخول بنجاح');
          navigate('/dashboard');
        } else {
          toast.error('خطأ في بيانات الاستجابة');
        }
      } else {
        toast.error('استجابة غير صحيحة من السيرفر');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.error?.message || 
                          error.response?.data?.message || 
                          error.message || 
                          'فشل تسجيل الدخول';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="glass-strong rounded-3xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">سند</h1>
          <p className="text-gray-600">لوحة تحكم الأدمن</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="admin@sanad.app"
              required
            />
          </div>

          <div>
            <label className="label">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                جاري تسجيل الدخول...
              </>
            ) : (
              <>
                <LogIn size={20} />
                تسجيل الدخول
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

