import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Headphones, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  User,
  Stethoscope,
  TrendingUp,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';
import { support } from '../../api/admin';
import DataTable from '../../components/common/DataTable';
import { PageHeader, StatCard, PageLoading, PageError } from '../../components/ui';
import toast from 'react-hot-toast';

const Support = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['support-tickets', page],
    queryFn: async () => {
      const response = await support.getTickets({ page, limit });
      return response.data;
    },
  });

  if (isLoading && !data) return <PageLoading />;
  if (error) return <PageError onRetry={() => refetch()} />;

  const ticketsList = data?.data?.tickets || data?.tickets || [];
  const total = data?.data?.pagination?.total || data?.pagination?.total || ticketsList.length;
  
  // Calculate stats
  const openCount = ticketsList.filter(t => t.status === 'OPEN').length;
  const inProgressCount = ticketsList.filter(t => t.status === 'IN_PROGRESS').length;
  const resolvedCount = ticketsList.filter(t => t.status === 'RESOLVED').length;
  const closedCount = ticketsList.filter(t => t.status === 'CLOSED').length;
  const urgentCount = ticketsList.filter(t => t.priority === 'URGENT').length;

  const columns = [
    {
      header: 'الموضوع',
      accessor: 'subject',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <Headphones className="text-white" size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 text-lg truncate">{row.subject}</p>
            <p className="text-xs text-gray-500 truncate">ID: {row.id.substring(0, 8)}...</p>
          </div>
        </div>
      )
    },
    {
      header: 'المرسل',
      accessor: 'user',
      render: (row) => {
        const sender = row.user || row.doctor;
        const senderName = row.user ? row.user.username : (row.doctor ? row.doctor.name : '-');
        const senderType = row.user ? 'مستخدم' : (row.doctor ? 'طبيب' : '-');
        
        return (
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              row.user ? 'bg-primary-50 border border-primary-200' : 'bg-blue-50 border border-blue-200'
            }`}>
              {row.user ? (
                <User className={row.user ? 'text-primary-600' : 'text-blue-600'} size={18} />
              ) : (
                <Stethoscope className="text-blue-600" size={18} />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{senderName}</p>
              <p className="text-xs text-gray-500">{senderType}</p>
            </div>
          </div>
        );
      }
    },
    {
      header: 'الأولوية',
      accessor: 'priority',
      sortable: true,
      render: (row) => {
        const priorityConfig = {
          URGENT: { label: 'عاجل', color: 'bg-red-100 text-red-700 border-red-200' },
          HIGH: { label: 'عالية', color: 'bg-orange-100 text-orange-700 border-orange-200' },
          MEDIUM: { label: 'متوسطة', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
          LOW: { label: 'منخفضة', color: 'bg-gray-100 text-gray-700 border-gray-200' },
        };
        const config = priorityConfig[row.priority] || priorityConfig.LOW;
        return (
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      header: 'الحالة',
      accessor: 'status',
      sortable: false,
      sortable: true,
      render: (row) => {
        const statusConfig = {
          OPEN: { label: 'مفتوحة', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: AlertCircle },
          IN_PROGRESS: { label: 'قيد المعالجة', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Clock },
          RESOLVED: { label: 'محلولة', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
          CLOSED: { label: 'مغلقة', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: XCircle },
        };
        const config = statusConfig[row.status] || statusConfig.OPEN;
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <Icon size={16} className={config.color.split(' ')[1]} />
            <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.color}`}>
              {config.label}
            </span>
          </div>
        );
      }
    },
    {
      header: 'المُكلف',
      accessor: 'assignedAdmin',
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.assignedAdmin ? (
            <>
              <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
                <Shield className="text-purple-600" size={18} />
              </div>
              <span className="text-sm font-medium text-gray-900">{row.assignedAdmin.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-400">غير مُكلف</span>
          )}
        </div>
      )
    },
    {
      header: 'تاريخ الإنشاء',
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
      )
    },
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => {
        navigate(`/support/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader title="تذاكر الدعم" description="إدارة جميع تذاكر الدعم الفني" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="إجمالي التذاكر" value={total} icon={Headphones} tone="violet" />
        <StatCard title="مفتوحة" value={openCount} icon={AlertCircle} tone="sky" />
        <StatCard title="قيد المعالجة" value={inProgressCount} icon={Clock} tone="amber" />
        <StatCard title="محلولة" value={resolvedCount} icon={CheckCircle} tone="emerald" />
        <StatCard title="عاجلة" value={urgentCount} icon={AlertCircle} tone="orange" />
      </div>

      {/* Data Table */}
      <DataTable
        data={ticketsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد تذاكر دعم"
        title="قائمة تذاكر الدعم"
        actions={actions}
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            type: 'select',
            options: [
              { value: 'OPEN', label: 'مفتوحة' },
              { value: 'IN_PROGRESS', label: 'قيد المعالجة' },
              { value: 'RESOLVED', label: 'محلولة' },
              { value: 'CLOSED', label: 'مغلقة' }
            ]
          },
          {
            key: 'priority',
            label: 'الأولوية',
            type: 'select',
            options: [
              { value: 'URGENT', label: 'عاجل' },
              { value: 'HIGH', label: 'عالية' },
              { value: 'MEDIUM', label: 'متوسطة' },
              { value: 'LOW', label: 'منخفضة' }
            ]
          },
          {
            key: 'createdAt',
            label: 'تاريخ الإنشاء',
            type: 'dateRange'
          }
        ]}
      />
    </div>
  );
};

export default Support;
