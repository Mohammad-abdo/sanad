import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Bell, Trash2, Check, CheckCheck, Eye, Calendar, User, Stethoscope, AlertCircle, FileText, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { notifications } from '../../api/admin';
import DataTable from '../../components/common/DataTable';
import { PageHeader, StatCard, Button, PageLoading, PageError } from '../../components/ui';

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [page, setPage] = useState(1);
  const limit = 20;
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-notifications', filter, page],
    queryFn: async () => {
      const response = await notifications.getAll({
        page,
        limit,
        unreadOnly: filter === 'unread',
      });
      return response.data.data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: notifications.markAsRead,
    onSuccess: () => {
      toast.success('تم تحديد الإشعار كمقروء');
      refetch();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notifications.markAllAsRead,
    onSuccess: () => {
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
      refetch();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notifications.delete,
    onSuccess: () => {
      toast.success('تم حذف الإشعار');
      refetch();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: notifications.clearAll,
    onSuccess: () => {
      toast.success('تم مسح جميع الإشعارات');
      refetch();
      queryClient.invalidateQueries(['admin-notifications']);
    },
  });

  const handleClearAll = () => {
    clearAllMutation.mutate();
  };

  if (isLoading) return <PageLoading />;
  if (error) return <PageError detail={error?.message} onRetry={() => refetch()} />;

  const notificationsList = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;
  const readCount = notificationsList.length - unreadCount;

  const getTypeConfig = (type) => {
    const configs = {
      BOOKING: { label: 'حجز', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Calendar },
      PAYMENT: { label: 'دفع', color: 'bg-green-100 text-green-700 border-green-200', icon: TrendingUp },
      SUPPORT: { label: 'دعم', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle },
      SYSTEM: { label: 'نظام', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: Bell },
      DOCTOR: { label: 'طبيب', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: Stethoscope },
    };
    return configs[type] || { label: type || 'عام', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FileText };
  };

  const columns = [
    {
      header: 'النوع',
      accessor: 'type',
      render: (row) => {
        const config = getTypeConfig(row.type);
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${config.color}`}>
              <Icon size={18} />
            </div>
            <span className="text-sm font-semibold text-gray-900">{config.label}</span>
          </div>
        );
      }
    },
    {
      header: 'الرسالة',
      accessor: 'message',
      render: (row) => (
        <div className="max-w-md">
          <p className={`text-sm ${row.isRead ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
            {row.message || row.title || 'لا توجد رسالة'}
          </p>
          {row.data && typeof row.data === 'object' && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              {JSON.stringify(row.data).substring(0, 50)}...
            </p>
          )}
        </div>
      )
    },
    {
      header: 'المستخدم',
      accessor: 'user',
      render: (row) => {
        if (row.user) {
          return (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
                <User className="text-primary-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{row.user.username || row.user.email}</p>
                <p className="text-xs text-gray-500">مستخدم</p>
              </div>
            </div>
          );
        } else if (row.doctor) {
          return (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
                <Stethoscope className="text-green-600" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{row.doctor.name || row.doctor.email}</p>
                <p className="text-xs text-gray-500">طبيب</p>
              </div>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center">
              <Bell className="text-gray-600" size={18} />
            </div>
            <span className="text-sm text-gray-500">نظام</span>
          </div>
        );
      }
    },
    {
      header: 'التاريخ',
      accessor: 'createdAt',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(row.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(row.createdAt).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: 'isRead',
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
          row.isRead 
            ? 'bg-gray-100 text-gray-700 border-gray-200' 
            : 'bg-primary-100 text-primary-700 border-primary-200'
        }`}>
          {row.isRead ? 'مقروء' : 'غير مقروء'}
        </span>
      )
    },
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => {
        navigate(`/notifications/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
    {
      label: 'تحديد كمقروء',
      icon: Check,
      onClick: (row) => markAsReadMutation.mutate(row.id),
      show: (row) => !row.isRead,
      className: 'text-blue-600 hover:bg-blue-50',
    },
    {
      label: 'حذف',
      icon: Trash2,
      onClick: (row) => {
        deleteMutation.mutate(row.id);
      },
      className: 'text-red-600 hover:bg-red-50',
      show: () => true,
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title="الإشعارات"
        description="إدارة جميع الإشعارات في النظام"
        actions={
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="secondary"
                size="sm"
                icon={CheckCheck}
                onClick={() => markAllAsReadMutation.mutate()}
              >
                تحديد الكل كمقروء
              </Button>
            )}
            <Button variant="danger" size="sm" icon={Trash2} onClick={handleClearAll}>
              مسح الكل
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="إجمالي الإشعارات" value={notificationsList.length} icon={Bell} tone="violet" />
        <StatCard title="غير مقروء" value={unreadCount} icon={AlertCircle} tone="amber" />
        <StatCard title="مقروء" value={readCount} icon={Check} tone="emerald" />
        <StatCard
          title="نسبة القراءة"
          value={`${notificationsList.length > 0 ? Math.round((readCount / notificationsList.length) * 100) : 0}%`}
          icon={TrendingUp}
          tone="sky"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'all'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          الكل ({notificationsList.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'unread'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          غير المقروء ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            filter === 'read'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          المقروء ({readCount})
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={notificationsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد إشعارات"
        title="قائمة الإشعارات"
        actions={actions}
        filters={[
          {
            key: 'isRead',
            label: 'الحالة',
            type: 'boolean'
          },
          {
            key: 'type',
            label: 'النوع',
            type: 'select',
            options: [
              { value: 'BOOKING', label: 'حجز' },
              { value: 'PAYMENT', label: 'دفع' },
              { value: 'SUPPORT', label: 'دعم' },
              { value: 'SYSTEM', label: 'نظام' },
              { value: 'DOCTOR', label: 'طبيب' }
            ]
          },
          {
            key: 'createdAt',
            label: 'التاريخ',
            type: 'dateRange'
          }
        ]}
      />
    </div>
  );
};

export default Notifications;
