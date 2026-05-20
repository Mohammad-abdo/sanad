import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bookings } from '../../api/admin';
import { Calendar, User, Clock, DollarSign, Stethoscope, Edit, Trash2, Eye, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { PageHeader, StatCard, PageLoading, PageError } from '../../components/ui';
import toast from 'react-hot-toast';
import { useAppCurrency } from '../../utils/currency';

const Bookings = () => {
  const { currency, formatMoney } = useAppCurrency();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-bookings', page],
    queryFn: async () => {
      const response = await bookings.getAll({ page, limit });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: bookings.delete,
    onSuccess: () => {
      toast.success('تم حذف الحجز بنجاح');
      refetch();
    },
    onError: () => {
      toast.error('فشل حذف الحجز');
    },
  });

  if (isLoading) return <PageLoading />;
  if (error) return <PageError detail={error.message} onRetry={() => refetch()} />;

  const bookingsList = data?.data?.bookings || [];
  const total = data?.data?.pagination?.total || bookingsList.length;
  const completedCount = bookingsList.filter(b => b.status === 'COMPLETED').length;
  const confirmedCount = bookingsList.filter(b => b.status === 'CONFIRMED').length;
  const pendingCount = bookingsList.filter(b => b.status === 'PENDING').length;
  const cancelledCount = bookingsList.filter(b => b.status === 'CANCELLED').length;
  const totalRevenue = bookingsList
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + (parseFloat(b.price) || 0), 0);

  const columns = [
    {
      header: 'الحجز',
      accessor: 'id',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <Calendar className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">حجز #{row.id.substring(0, 8)}</p>
            <p className="text-xs text-gray-500">{row.sessionType === 'VIDEO' ? 'فيديو' : row.sessionType === 'AUDIO' ? 'صوتي' : 'نصي'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'الطبيب',
      accessor: 'doctor',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
            <Stethoscope size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{row.doctor?.name || '-'}</p>
            <p className="text-xs text-gray-500">{row.doctor?.specialization || ''}</p>
          </div>
        </div>
      )
    },
    {
      header: 'المستخدم',
      accessor: 'user',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <span className="text-blue-600 text-sm font-bold">
              {row.user?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{row.user?.username || 'مجهول'}</p>
            <p className="text-xs text-gray-500">مستخدم</p>
          </div>
        </div>
      )
    },
    {
      header: 'التاريخ والوقت',
      accessor: 'scheduledAt',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {new Date(row.scheduledAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(row.scheduledAt).toLocaleTimeString('ar-EG', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      )
    },
    {
      header: 'المبلغ',
      accessor: 'price',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
            <DollarSign size={16} className="text-green-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{formatMoney(row.price)}</p>
            <p className="text-xs text-gray-500">{row.duration} دقيقة</p>
          </div>
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status',
      sortable: false,
      sortable: true,
      render: (row) => {
        const statusConfig = {
          COMPLETED: { label: 'مكتملة', color: 'bg-green-100 text-green-700 border-green-200' },
          CONFIRMED: { label: 'مؤكدة', color: 'bg-blue-100 text-blue-700 border-blue-200' },
          PENDING: { label: 'بانتظار', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
          CANCELLED: { label: 'ملغاة', color: 'bg-red-100 text-red-700 border-red-200' },
        };
        const config = statusConfig[row.status] || statusConfig.PENDING;
        return (
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => {
        navigate(`/bookings/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
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
      <PageHeader title="الحجوزات" description="إدارة جميع الحجوزات في النظام" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="إجمالي الحجوزات" value={total} icon={Calendar} tone="violet" />
        <StatCard title="مكتملة" value={completedCount} icon={CheckCircle} tone="emerald" />
        <StatCard title="مؤكدة" value={confirmedCount} icon={CheckCircle} tone="sky" />
        <StatCard title="معلقة" value={pendingCount} icon={AlertCircle} tone="amber" />
        <StatCard title={`إيرادات الصفحة (${currency})`} value={formatMoney(totalRevenue)} icon={DollarSign} tone="emerald" />
      </div>

      {/* Data Table */}
      <DataTable
        data={bookingsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد حجوزات"
        title="قائمة الحجوزات"
        actions={actions}
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            type: 'select',
            options: [
              { value: 'PENDING', label: 'معلق' },
              { value: 'CONFIRMED', label: 'مؤكد' },
              { value: 'COMPLETED', label: 'مكتمل' },
              { value: 'CANCELLED', label: 'ملغي' }
            ]
          },
          {
            key: 'sessionType',
            label: 'نوع الجلسة',
            type: 'select',
            options: [
              { value: 'VIDEO', label: 'فيديو' },
              { value: 'AUDIO', label: 'صوتي' },
              { value: 'TEXT', label: 'نصي' }
            ]
          },
          {
            key: 'price',
            label: 'السعر',
            type: 'numberRange'
          },
          {
            key: 'scheduledAt',
            label: 'تاريخ الحجز',
            type: 'dateRange'
          }
        ]}
      />
    </div>
  );
};

export default Bookings;
