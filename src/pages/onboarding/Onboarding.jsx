import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Image, Eye, Monitor, Smartphone, Globe, Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { onboarding } from '../../api/admin';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';

const Onboarding = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['onboarding', page],
    queryFn: async () => {
      const response = await onboarding.getAll({ page, limit });
      return response.data.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: onboarding.create,
    onSuccess: () => {
      toast.success('تم إنشاء عنصر التعريف بنجاح');
      setShowModal(false);
      setEditingItem(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'فشل الإنشاء');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => onboarding.update(id, data),
    onSuccess: () => {
      toast.success('تم التحديث بنجاح');
      setShowModal(false);
      setEditingItem(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'فشل التحديث');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: onboarding.delete,
    onSuccess: () => {
      toast.success('تم الحذف بنجاح');
      refetch();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'فشل الحذف');
    },
  });

  const onboardingList = data || [];

  const columns = [
    {
      header: 'الترتيب',
      accessor: 'order',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
            <span className="text-primary-600 font-bold">{row.order}</span>
          </div>
        </div>
      )
    },
    {
      header: 'العنوان',
      accessor: 'title',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img 
              src={row.image} 
              alt={row.titleAr} 
              className="w-12 h-12 object-cover rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              <Image className="text-gray-400" size={20} />
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900 text-lg">{row.titleAr}</p>
            <p className="text-xs text-gray-500">{row.title}</p>
          </div>
        </div>
      )
    },
    {
      header: 'الوصف',
      accessor: 'description',
      render: (row) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-md">
          {row.descriptionAr || row.description || 'لا يوجد وصف'}
        </p>
      )
    },
    {
      header: 'المنصة',
      accessor: 'platform',
      render: (row) => {
        const platformConfig = {
          ALL: { icon: Globe, label: 'الكل', color: 'bg-blue-50 border-blue-200 text-blue-600' },
          MOBILE: { icon: Smartphone, label: 'موبايل', color: 'bg-green-50 border-green-200 text-green-600' },
          WEB: { icon: Monitor, label: 'ويب', color: 'bg-purple-50 border-purple-200 text-purple-600' },
        };
        const config = platformConfig[row.platform] || platformConfig.ALL;
        const Icon = config.icon;
        return (
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${config.color}`}>
              <Icon size={18} />
            </div>
            <span className="text-sm font-medium text-gray-900">{config.label}</span>
          </div>
        );
      }
    },
    {
      header: 'الحالة',
      accessor: 'isActive',
      render: (row) => (
        <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${
          row.isActive 
            ? 'bg-green-100 text-green-700 border-green-200' 
            : 'bg-gray-100 text-gray-700 border-gray-200'
        }`}>
          {row.isActive ? 'نشط' : 'معطل'}
        </span>
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
        navigate(`/onboarding/${row.id}`);
      },
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
    {
      label: 'تعديل',
      icon: Edit,
      onClick: (row) => {
        setEditingItem(row);
        setShowModal(true);
      },
      className: 'text-blue-600 hover:bg-blue-50',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      title: formData.get('title'),
      titleAr: formData.get('titleAr'),
      description: formData.get('description') || undefined,
      descriptionAr: formData.get('descriptionAr') || undefined,
      image: formData.get('image') || undefined,
      order: parseInt(formData.get('order')) || 0,
      isActive: formData.get('isActive') === 'on',
      platform: formData.get('platform') || 'ALL',
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">إدارة التعريف (Onboarding)</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة شاشات التعريف للمستخدمين</p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة عنصر جديد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
              <FileText className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{onboardingList.length}</p>
              <p className="text-xs text-gray-500">إجمالي العناصر</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {onboardingList.filter(i => i.isActive).length}
              </p>
              <p className="text-xs text-gray-500">عناصر نشطة</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Globe className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {onboardingList.filter(i => i.platform === 'ALL').length}
              </p>
              <p className="text-xs text-gray-500">لجميع المنصات</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Smartphone className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {onboardingList.filter(i => i.platform === 'MOBILE').length}
              </p>
              <p className="text-xs text-gray-500">للموبايل فقط</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={onboardingList}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        filterable={true}
        exportable={true}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد عناصر تعريف"
        title="قائمة عناصر التعريف"
        actions={actions}
        filters={[
          {
            key: 'platform',
            label: 'المنصة',
            type: 'select',
            options: [
              { value: 'ALL', label: 'الكل' },
              { value: 'MOBILE', label: 'موبايل' },
              { value: 'WEB', label: 'ويب' }
            ]
          },
          {
            key: 'isActive',
            label: 'الحالة',
            type: 'boolean'
          },
          {
            key: 'order',
            label: 'الترتيب',
            type: 'numberRange'
          },
          {
            key: 'createdAt',
            label: 'تاريخ الإنشاء',
            type: 'dateRange'
          }
        ]}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        title={editingItem ? 'تعديل عنصر التعريف' : 'إضافة عنصر تعريف جديد'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">العنوان (عربي) *</label>
              <input
                name="titleAr"
                type="text"
                defaultValue={editingItem?.titleAr}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">العنوان (إنجليزي) *</label>
              <input
                name="title"
                type="text"
                defaultValue={editingItem?.title}
                className="input"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">الوصف (عربي)</label>
              <textarea
                name="descriptionAr"
                defaultValue={editingItem?.descriptionAr}
                className="input min-h-[100px]"
              />
            </div>
            <div>
              <label className="label">الوصف (إنجليزي)</label>
              <textarea
                name="description"
                defaultValue={editingItem?.description}
                className="input min-h-[100px]"
              />
            </div>
          </div>

          <div>
            <label className="label">رابط الصورة</label>
            <input
              name="image"
              type="url"
              defaultValue={editingItem?.image}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            {editingItem?.image && (
              <img 
                src={editingItem.image} 
                alt="Preview" 
                className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">الترتيب</label>
              <input
                name="order"
                type="number"
                defaultValue={editingItem?.order || 0}
                className="input"
                min="0"
              />
            </div>
            <div>
              <label className="label">المنصة</label>
              <select
                name="platform"
                defaultValue={editingItem?.platform || 'ALL'}
                className="input"
              >
                <option value="ALL">الكل</option>
                <option value="MOBILE">موبايل فقط</option>
                <option value="WEB">ويب فقط</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
            <input
              name="isActive"
              type="checkbox"
              defaultChecked={editingItem?.isActive !== false}
              className="w-5 h-5 text-primary-600 rounded"
            />
            <label className="font-semibold text-gray-900">تفعيل العنصر</label>
          </div>

          <div className="flex gap-2 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'تحديث' : 'إنشاء'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
              className="btn-secondary"
            >
              إلغاء
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Onboarding;
