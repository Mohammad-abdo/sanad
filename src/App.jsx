import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Users from './pages/users/Users';
import Doctors from './pages/doctors/Doctors';
import Posts from './pages/posts/Posts';
import Bookings from './pages/bookings/Bookings';
import BookingDetails from './pages/bookings/BookingDetails';
import Payments from './pages/payments/Payments';
import Support from './pages/support/Support';
import SupportDetails from './pages/support/SupportDetails';
import Reports from './pages/reports/Reports';
import ReportDetails from './pages/reports/ReportDetails';
import Settings from './pages/settings/Settings';
import Interests from './pages/interests/Interests';
import InterestDetails from './pages/interests/InterestDetails';
import Coupons from './pages/coupons/Coupons';
import CouponDetails from './pages/coupons/CouponDetails';
import ActivityLogs from './pages/activity-logs/ActivityLogs';
import ActivityLogDetails from './pages/activity-logs/ActivityLogDetails';
import Tags from './pages/tags/Tags';
import TagDetails from './pages/tags/TagDetails';
import Tips from './pages/tips/Tips';
import TipDetails from './pages/tips/TipDetails';
import Withdrawals from './pages/withdrawals/Withdrawals';
import WithdrawalDetails from './pages/withdrawals/WithdrawalDetails';
import Admins from './pages/admins/Admins';
import AdminDetails from './pages/admins/AdminDetails';
import DoctorDetails from './pages/doctors/DoctorDetails';
import Onboarding from './pages/onboarding/Onboarding';
import OnboardingDetails from './pages/onboarding/OnboardingDetails';
import Notifications from './pages/notifications/Notifications';
import NotificationDetails from './pages/notifications/NotificationDetails';
import UserDetails from './pages/users/UserDetails';
import ContentModeration from './pages/content-moderation/ContentModeration';
import PageView from './pages/public/PageView';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/pages/:pageType" element={<PageView />} />

      {/* Protected Routes with Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/bookings/:id" element={<BookingDetails />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/withdrawals" element={<Withdrawals />} />
        <Route path="/withdrawals/:id" element={<WithdrawalDetails />} />
        <Route path="/admins" element={<Admins />} />
        <Route path="/admins/:id" element={<AdminDetails />} />
        <Route path="/support" element={<Support />} />
        <Route path="/support/:id" element={<SupportDetails />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/interests/:id" element={<InterestDetails />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/tags/:id" element={<TagDetails />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/:id" element={<TipDetails />} />
        <Route path="/coupons" element={<Coupons />} />
        <Route path="/coupons/:id" element={<CouponDetails />} />
        <Route path="/activity-logs" element={<ActivityLogs />} />
        <Route path="/activity-logs/:id" element={<ActivityLogDetails />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/onboarding/:id" element={<OnboardingDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/:id" element={<NotificationDetails />} />
        <Route path="/content-moderation" element={<ContentModeration />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

