import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Eye, DollarSign, Wallet } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { wallets } from '../../api/admin';
import { useAppCurrency } from '../../utils/currency';

const Wallets = () => {
  const { formatMoney } = useAppCurrency();
  const navigate = useNavigate();
  const [page] = useState(1);
  const limit = 20;

  const { data, isLoading } = useQuery({
    queryKey: ['wallets', page],
    queryFn: async () => {
      const response = await wallets.getActiveDoctorWallets({ page, limit });
      return response.data.data;
    },
  });

  const walletsList = data?.wallets || [];

  const totalBalance = walletsList.reduce((sum, w) => sum + (w.walletBalance || 0), 0);
  const totalDoctors = walletsList.length;

  const columns = [
    {
      header: 'الطبيب',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">
              {row.name?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-lg">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'الرصيد',
      accessor: 'walletBalance',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
            <DollarSign className="text-green-600" size={18} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{formatMoney(row.walletBalance || 0)}</p>
            <p className="text-xs text-gray-500">الرصيد المتاح</p>
          </div>
        </div>
      ),
    },
    {
      header: 'إجمالي التحصيل',
      accessor: 'totalEarnings',
      render: (row) => (
        <span className="text-sm font-semibold text-green-700">
          {formatMoney(row.totalEarnings || 0)}
        </span>
      ),
    },
    {
      header: 'إجمالي السحوبات',
      accessor: 'totalWithdrawals',
      render: (row) => (
        <span className="text-sm font-semibold text-red-700">
          {formatMoney(row.totalWithdrawals || 0)}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: 'عرض التفاصيل',
      icon: Eye,
      onClick: (row) => navigate(`/wallets/${row.doctorId}`),
      className: 'text-primary-600 hover:bg-primary-50',
      show: () => true,
    },
  ];

  const tableData = walletsList.map((w) => ({
    doctorId: w.doctorId,
    name: w.doctor?.name || '-',
    email: w.doctor?.email || '-',
    walletBalance: w.walletBalance || 0,
    totalEarnings: w.totalEarnings || 0,
    totalWithdrawals: w.totalWithdrawals || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">محافظ الأطباء</h1>
          <p className="text-sm text-gray-600">إدارة رصيد الطبيب + معاملات المحفظة</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-6 text-center border border-gray-200">
          <div className="w-16 h-16 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
            <DollarSign className="text-green-600" size={32} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{formatMoney(totalBalance)}</p>
          <p className="text-sm text-gray-500">إجمالي الرصيد</p>
        </div>
        <div className="glass-card rounded-xl p-6 text-center border border-gray-200">
          <div className="w-16 h-16 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center mx-auto mb-3">
            <Wallet className="text-primary-600" size={32} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{totalDoctors}</p>
          <p className="text-sm text-gray-500">أطباء نشطين</p>
        </div>
        <div className="glass-card rounded-xl p-6 text-center border border-gray-200">
          <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-3">
            <Eye className="text-blue-600" size={32} />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{tableData.length}</p>
          <p className="text-sm text-gray-500">سجلات في الصفحة</p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={tableData}
        columns={columns}
        isLoading={isLoading}
        searchable={true}
        exportable={true}
        filterable={false}
        pagination={true}
        pageSize={limit}
        emptyMessage="لا توجد محافظ"
        title="قائمة محافظ الأطباء"
        actions={actions}
        filters={[]}
      />
    </div>
  );
};

export default Wallets;

