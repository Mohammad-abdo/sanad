import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Calendar, 
  User, 
  Activity, 
  Search,
  Eye,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Shield
} from 'lucide-react';
import { activityLogs } from '../../api/admin';
import DataTable from '../../components/common/DataTable';
import { PageHeader, StatCard, Button, PageLoading, PageError } from '../../components/ui';
import toast from 'react-hot-toast';

const ActivityLogs = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['activity-logs', page],
    queryFn: async () => {
      const response = await activityLogs.getAll({ page, limit });
      return response.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['activity-logs-stats'],
    queryFn: async () => {
      const response = await activityLogs.getStats();
      return response.data;
    },
  });

  const handleExport = async () => {
    try {
      const response = await activityLogs.export({ format: 'CSV' });
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('تم تصدير السجل بنجاح');
    } catch (error) {
      toast.error('فشل تصدير السجل');
    }
  };

  if (isLoading) return <PageLoading />;
  if (error) return <PageError detail={error?.message} onRetry={() => refetch()} />;

  const logsList = data?.data?.logs || data?.logs || [];
  const total = data?.data?.pagination?.total || data?.pagination?.total || logsList.length;
  const stats = statsData || {};
  
  // Calculate stats from logs if stats API not available
  const createCount = logsList.filter(log => log.action === 'CREATE').length;
  const updateCount = logsList.filter(log => log.action === 'UPDATE').length;
  const deleteCount = logsList.filter(log => log.action === 'DELETE').length;
  const approveCount = logsList.filter(log => log.action === 'APPROVE').length;
  const rejectCount = logsList.filter(log => log.action === 'REJECT').length;

  const columns = [
    {
      header: 'الإجراء',
      accessor: 'action',
      sortable: true,
      render: (row) => {
        const actionConfig = {
          CREATE: { label: 'إنشاء', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
          UPDATE: { label: 'تحديث', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: Edit },
          DELETE: { label: 'حذف', color: 'bg-red-100 text-red-700 border-red-200', icon: Trash2 },
          APPROVE: { label: 'موافقة', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
          REJECT: { label: 'رفض', color: 'bg-red-100 text-red-700 border-red-200', icon: XCircle },
        };
        const config = actionConfig[row.action] || { 
          label: row.action, 
          color: 'bg-gray-100 text-gray-700 border-gray-200',
          icon: Activity
        };
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${config.color}`}>
              <Icon size={18} />
            </div>
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.color}`}>
              {config.label}
            </span>
          </div>
        );
      },
    },
    {
      header: 'النوع',
      accessor: 'entityType',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
            <FileText className="text-primary-600" size={18} />
          </div>
          <span className="text-sm font-medium text-gray-900">{row.entityType || '-'}</span>
        </div>
      ),
    },
    {
      header: 'الأدمن',
      accessor: 'admin',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">
              {row.admin?.name?.charAt(0) || 'A'}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{row.admin?.name || '-'}</p>
            <p className="text-xs text-gray-500">{row.admin?.email || ''}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الوصف',
      accessor: 'description',
      render: (row) => (
        <span className="text-sm text-gray-600 max-w-md truncate block">
          {row.description || '-'}
        </span>
      ),
    },
    {
      header: 'التاريخ',
      accessor: 'createdAt',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {new Date(row.createdAt).toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(row.createdAt).toLocaleTimeString('ar-EG', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      ),
    },
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => {
        navigate(`/activity-logs/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title="سجل الأنشطة"
        description="تتبع جميع الأنشطة والإجراءات في النظام"
        actions={
          <Button icon={Download} onClick={handleExport}>
            تصدير السجل
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="إجمالي السجلات" value={total} icon={Activity} tone="violet" />
        <StatCard title="إنشاء/موافقة" value={createCount + approveCount} icon={CheckCircle} tone="emerald" />
        <StatCard title="تحديثات" value={updateCount} icon={Edit} tone="sky" />
        <StatCard title="حذف/رفض" value={deleteCount + rejectCount} icon={Trash2} tone="orange" />
        <StatCard title="أنشطة أدمن" value={logsList.filter(log => log.admin).length} icon={Shield} tone="fuchsia" />
      </div>

      {/* Data Table */}
      <DataTable
        data={logsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا يوجد سجل أنشطة"
        title="قائمة سجل الأنشطة"
        actions={actions}
        filters={[
          {
            key: 'action',
            label: 'الإجراء',
            type: 'select',
            options: [
              { value: 'CREATE', label: 'إنشاء' },
              { value: 'UPDATE', label: 'تحديث' },
              { value: 'DELETE', label: 'حذف' },
              { value: 'APPROVE', label: 'موافقة' },
              { value: 'REJECT', label: 'رفض' }
            ]
          },
          {
            key: 'entityType',
            label: 'نوع الكيان',
            type: 'select',
            options: [
              { value: 'User', label: 'مستخدم' },
              { value: 'Doctor', label: 'طبيب' },
              { value: 'Post', label: 'منشور' },
              { value: 'Booking', label: 'حجز' },
              { value: 'Payment', label: 'دفع' },
              { value: 'Withdrawal', label: 'سحب' }
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

export default ActivityLogs;
