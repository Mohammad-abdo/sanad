import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Check, Star, Trash2, User, Calendar, Plus, Eye, TrendingUp, FileText, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { tips } from '../../api/admin';
import DataTable from '../../components/common/DataTable';

const Tips = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-tips', page],
    queryFn: async () => {
      const response = await tips.getAll({ page, limit });
      return response.data;
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (id) => tips.verify(id),
    onSuccess: () => {
      toast.success('تم تحديث حالة التوثيق');
      refetch();
    },
    onError: () => {
      toast.error('فشل التحديث');
    },
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }) => tips.feature(id, { isFeatured }),
    onSuccess: () => {
      toast.success('تم تحديث حالة التمييز');
      refetch();
    },
    onError: () => {
      toast.error('فشل التحديث');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tips.delete,
    onSuccess: () => {
      toast.success('تم حذف النصيحة');
      refetch();
    },
    onError: () => {
      toast.error('فشل حذف النصيحة');
    },
  });

  const tipsList = data?.data?.tips || [];

  const columns = [
    {
      header: 'المحتوى',
      accessor: 'content',
      render: (row) => (
        <div className="max-w-md">
          <div className="flex items-start gap-2">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="text-yellow-600" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 text-sm font-medium line-clamp-2">{row.content}</p>
              {row.postId && (
                <p className="text-xs text-gray-500 mt-1">منشور: {row.postId.substring(0, 8)}...</p>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'الطبيب',
      accessor: 'doctor',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
            <User className="text-primary-600" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{row.doctor?.name || 'غير محدد'}</p>
            {row.doctor?.specialization && (
              <p className="text-xs text-gray-500">{row.doctor.specialization}</p>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'الإعجابات',
      accessor: 'likes',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
            <Heart className="text-red-600 fill-red-600" size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{row.likes || 0}</p>
            <p className="text-xs text-gray-500">إعجاب</p>
          </div>
        </div>
      )
    },
    {
      header: 'الحالة',
      accessor: 'status',
      render: (row) => (
        <div className="flex flex-col gap-1.5">
          {row.isVerified && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-200 w-fit">
              موثّق
            </span>
          )}
          {row.isFeatured && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 w-fit">
              مميز
            </span>
          )}
          {!row.isVerified && !row.isFeatured && (
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 w-fit">
              عادي
            </span>
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
        navigate(`/tips/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
    {
      label: (row) => row.isVerified ? 'إلغاء التوثيق' : 'توثيق',
      icon: Check,
      onClick: (row) => verifyMutation.mutate(row.id),
      className: (row) => row.isVerified 
        ? 'text-green-600 hover:bg-green-50' 
        : 'text-gray-400 hover:bg-gray-50',
      show: () => true,
    },
    {
      label: (row) => row.isFeatured ? 'إلغاء التمييز' : 'تمييز',
      icon: Star,
      onClick: (row) => featureMutation.mutate({ id: row.id, isFeatured: !row.isFeatured }),
      className: (row) => row.isFeatured 
        ? 'text-yellow-600 hover:bg-yellow-50' 
        : 'text-gray-400 hover:bg-gray-50',
      show: () => true,
    },
    {
      label: 'حذف',
      icon: Trash2,
      onClick: (row) => {
        if (window.confirm('هل أنت متأكد من حذف هذه النصيحة؟')) {
          deleteMutation.mutate(row.id);
        }
      },
      className: 'text-red-600 hover:bg-red-50',
      show: () => true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">النصائح</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة جميع النصائح المقدمة من الأطباء</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <Lightbulb className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{tipsList.length}</p>
              <p className="text-xs text-gray-500">إجمالي النصائح</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
              <Check className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tipsList.filter(t => t.isVerified).length}
              </p>
              <p className="text-xs text-gray-500">نصائح موثقة</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 border border-yellow-200 flex items-center justify-center">
              <Star className="text-yellow-600 fill-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tipsList.filter(t => t.isFeatured).length}
              </p>
              <p className="text-xs text-gray-500">نصائح مميزة</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
              <Heart className="text-red-600 fill-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {tipsList.reduce((sum, tip) => sum + (tip.likes || 0), 0)}
              </p>
              <p className="text-xs text-gray-500">إجمالي الإعجابات</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={tipsList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد نصائح"
        title="قائمة النصائح"
        actions={actions}
        filters={[
          {
            key: 'isVerified',
            label: 'التحقق',
            type: 'boolean'
          },
          {
            key: 'isFeatured',
            label: 'مميز',
            type: 'boolean'
          },
          {
            key: 'likes',
            label: 'الإعجابات',
            type: 'numberRange'
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

export default Tips;
