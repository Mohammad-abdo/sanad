import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { doctors } from '../../api/admin';
import { Plus, Check, X, Shield, ShieldOff, Mail, Calendar, Star, Edit, Eye, Stethoscope, UserCheck, UserX, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../utils/apiError';
import DataTable from '../../components/common/DataTable';
import { PageHeader, StatCard, Button } from '../../components/ui';

const Doctors = () => {
  const navigate = useNavigate();
  const { admin } = useAuthStore();
  const canDeleteDoctor = admin?.role === 'SUPER_ADMIN' || admin?.role === 'ADMIN';
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['doctors', page],
    queryFn: async () => {
      const response = await doctors.getAll({ page, limit });
      return response.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: doctors.approve,
    onSuccess: () => {
      toast.success('تم الموافقة على الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل الموافقة'));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => doctors.reject(id, { reason: 'رفض من الأدمن' }),
    onSuccess: () => {
      toast.success('تم رفض الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل الرفض'));
    },
  });

  const verifyMutation = useMutation({
    mutationFn: doctors.verify,
    onSuccess: () => {
      toast.success('تم توثيق الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل التوثيق'));
    },
  });

  const unverifyMutation = useMutation({
    mutationFn: doctors.unverify,
    onSuccess: () => {
      toast.success('تم إلغاء توثيق الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل إلغاء التوثيق'));
    },
  });

  const activateMutation = useMutation({
    mutationFn: doctors.activate,
    onSuccess: () => {
      toast.success('تم تفعيل الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل التفعيل'));
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: doctors.deactivate,
    onSuccess: () => {
      toast.success('تم تعطيل الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل التعطيل'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: doctors.delete,
    onSuccess: () => {
      toast.success('تم حذف الطبيب');
      refetch();
    },
    onError: (e) => {
      toast.error(getApiErrorMessage(e, 'فشل حذف الطبيب'));
    },
  });

  const doctorsList = data?.data?.doctors || [];
  const total = data?.data?.pagination?.total || doctorsList.length;
  const approvedCount = doctorsList.filter(d => d.isApproved).length;
  const pendingCount = doctorsList.filter(d => !d.isApproved).length;
  const verifiedCount = doctorsList.filter(d => d.isVerified).length;
  const activeCount = doctorsList.filter(d => d.isActive).length;

  const columns = [
    {
      header: 'الطبيب',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">
              {row.name?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{row.name}</p>
            <p className="text-xs text-gray-500">ID: {row.id.substring(0, 8)}...</p>
          </div>
        </div>
      )
    },
    {
      header: 'البريد الإلكتروني',
      accessor: 'email',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
            <Mail className="text-primary-600" size={18} />
          </div>
          <span className="text-sm font-medium text-gray-900">{row.email}</span>
        </div>
      )
    },
    {
      header: 'التخصص',
      accessor: 'specialization',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Stethoscope size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{row.specialization || '-'}</span>
        </div>
      )
    },
    {
      header: 'التقييم',
      accessor: 'rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
            <Star className="text-yellow-600 fill-yellow-600" size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              {row.rating ? row.rating.toFixed(1) : '0.0'}
            </p>
            <p className="text-xs text-gray-500">تقييم</p>
          </div>
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status',
      sortable: false,
      render: (row) => (
        <div className="flex flex-col gap-1.5">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border inline-block w-fit ${
            row.isApproved 
              ? 'bg-green-100 text-green-700 border-green-200' 
              : 'bg-yellow-100 text-yellow-700 border-yellow-200'
          }`}>
            {row.isApproved ? 'موافق' : 'بانتظار الموافقة'}
          </span>
          {row.isVerified && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-blue-100 text-blue-700 border-blue-200 inline-block w-fit">
              موثّق
            </span>
          )}
          {!row.isActive && (
            <span className="px-3 py-1.5 rounded-lg text-sm font-semibold border bg-gray-100 text-gray-700 border-gray-200 inline-block w-fit">
              معطل
            </span>
          )}
        </div>
      )
    },
    {
      header: 'تاريخ التسجيل',
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
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => {
        navigate(`/doctors/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
    {
      label: 'تعديل',
      icon: Edit,
      onClick: (row) => {
        navigate(`/doctors/${row.id}/edit`);
      },
      className: 'text-blue-600 hover:bg-blue-50',
      show: () => true,
    },
    {
      label: 'موافقة',
      icon: Check,
      onClick: (row) => approveMutation.mutate(row.id),
      className: 'text-green-600 hover:bg-green-50',
      show: (row) => !row.isApproved,
    },
    {
      label: 'رفض',
      icon: X,
      onClick: (row) => {
        rejectMutation.mutate(row.id);
      },
      className: 'text-red-600 hover:bg-red-50',
      show: (row) => !row.isApproved,
    },
    {
      label: (row) => row.isVerified ? 'إلغاء التوثيق' : 'توثيق',
      icon: (row) => row.isVerified ? ShieldOff : Shield,
      onClick: (row) => {
        if (row.isVerified) {
          unverifyMutation.mutate(row.id);
        } else {
          verifyMutation.mutate(row.id);
        }
      },
      className: (row) => row.isVerified 
        ? 'text-orange-600 hover:bg-orange-50' 
        : 'text-blue-600 hover:bg-blue-50',
      show: (row) => row.isApproved,
    },
    {
      label: (row) => row.isActive ? 'تعطيل' : 'تفعيل',
      icon: (row) => row.isActive ? UserX : UserCheck,
      onClick: (row) => {
        if (row.isActive) {
          deactivateMutation.mutate(row.id);
        } else {
          activateMutation.mutate(row.id);
        }
      },
      className: (row) => row.isActive 
        ? 'text-orange-600 hover:bg-orange-50' 
        : 'text-green-600 hover:bg-green-50',
      show: (row) => row.isApproved,
    },
    {
      label: 'حذف',
      icon: Trash2,
      onClick: (row) => {
        deleteMutation.mutate(row.id);
      },
      className: 'text-red-600 hover:bg-red-50',
      show: () => canDeleteDoctor,
    },
  ];

  return (
    <div className="page-shell">
      <PageHeader
        title="الأطباء"
        description="إدارة جميع الأطباء في النظام"
        actions={<Button icon={Plus} onClick={() => navigate('/doctors/new')}>إضافة طبيب</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="إجمالي الأطباء" value={total} icon={Stethoscope} tone="violet" />
        <StatCard title="موافق عليهم" value={approvedCount} icon={Check} tone="emerald" />
        <StatCard title="بانتظار الموافقة" value={pendingCount} icon={AlertCircle} tone="amber" />
        <StatCard title="موثقين" value={verifiedCount} icon={Shield} tone="sky" />
        <StatCard title="نشطين" value={activeCount} icon={UserCheck} tone="fuchsia" />
      </div>

      {/* Data Table */}
      <DataTable
        data={doctorsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا يوجد أطباء"
        title="قائمة الأطباء"
        actions={actions}
        filters={[
          {
            key: 'isApproved',
            label: 'الموافقة',
            type: 'boolean'
          },
          {
            key: 'isVerified',
            label: 'التوثيق',
            type: 'boolean'
          },
          {
            key: 'isActive',
            label: 'النشاط',
            type: 'boolean'
          },
          {
            key: 'specialization',
            label: 'التخصص',
            type: 'text'
          },
          {
            key: 'rating',
            label: 'التقييم',
            type: 'numberRange'
          },
          {
            key: 'createdAt',
            label: 'تاريخ التسجيل',
            type: 'dateRange'
          }
        ]}
      />
    </div>
  );
};

export default Doctors;
