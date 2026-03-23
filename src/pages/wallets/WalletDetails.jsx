import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/common/DataTable';
import Modal from '../../components/common/Modal';
import { wallets, withdrawals } from '../../api/admin';
import {
  ArrowRight,
  Wallet,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Building2,
  Eye,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAppCurrency } from '../../utils/currency';

const WalletDetails = () => {
  const { formatMoney } = useAppCurrency();
  const { id } = useParams();
  const navigate = useNavigate();

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['wallet-details', id],
    queryFn: async () => {
      const response = await wallets.getDoctorWalletDetails(id);
      return response.data.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: (withdrawalId) => withdrawals.approve(withdrawalId),
    onSuccess: () => {
      toast.success('تمت الموافقة على طلب السحب');
      refetch();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || 'فشل الموافقة');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ withdrawalId, reason }) => withdrawals.reject(withdrawalId, { reason }),
    onSuccess: () => {
      toast.success('تم رفض طلب السحب');
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedWithdrawalId(null);
      refetch();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error?.message || 'فشل رفض طلب السحب');
    },
  });

  const getMethodBadge = (method) => {
    const methods = {
      BANK_ACCOUNT: { label: 'حساب بنكي', icon: Building2, color: 'bg-blue-50 border-blue-200 text-blue-600' },
      E_WALLET: { label: 'محفظة إلكترونية', icon: Wallet, color: 'bg-green-50 border-green-200 text-green-600' },
      PAYPAL: { label: 'PayPal', icon: CreditCard, color: 'bg-purple-50 border-purple-200 text-purple-600' },
      VODAFONE_CASH: { label: 'فودافون كاش', icon: Wallet, color: 'bg-red-50 border-red-200 text-red-600' },
      FAWRY: { label: 'فوري', icon: CreditCard, color: 'bg-orange-50 border-orange-200 text-orange-600' },
      INSTAPAY: { label: 'انستا باي', icon: Wallet, color: 'bg-indigo-50 border-indigo-200 text-indigo-600' },
    };

    const config = methods[method] || { label: method || '-', icon: CreditCard, color: 'bg-gray-50 border-gray-200 text-gray-600' };
    const Icon = config.icon;

    return (
      <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center ${config.color}`}>
        <Icon size={32} />
      </div>
    );
  };

  const getStatusBadge = (tx) => {
    const { type, status } = tx;

    const badges = {
      PAYMENT: {
        PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'معلق' },
        COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'مكتمل' },
        FAILED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'فشل' },
        REFUNDED: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200', icon: XCircle, label: 'مسترد' },
      },
      WITHDRAWAL: {
        PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock, label: 'معلق' },
        PROCESSING: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200', icon: Clock, label: 'قيد المعالجة' },
        COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200', icon: CheckCircle, label: 'مكتمل' },
        REJECTED: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', icon: XCircle, label: 'مرفوض' },
      }
    };

    const conf = badges[type]?.[status] || badges[type]?.PENDING || badges.PAYMENT.PENDING;
    const Icon = conf.icon;
    return (
      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 inline-flex items-center gap-2 ${conf.bg} ${conf.text} ${conf.border}`}>
        <Icon size={18} />
        {conf.label}
      </span>
    );
  };

  const columns = [
    {
      header: 'النوع',
      accessor: 'type',
      render: (row) => (
        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${
          row.type === 'PAYMENT' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {row.type === 'PAYMENT' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          {row.type === 'PAYMENT' ? 'تحصيل' : 'سحب'}
        </span>
      ),
    },
    {
      header: 'المبلغ',
      accessor: 'amount',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
            row.type === 'PAYMENT' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-red-50 border-red-200 text-red-600'
          }`}>
            <DollarSign size={18} />
          </div>
          <div>
            <p className={`text-lg font-bold ${row.type === 'PAYMENT' ? 'text-green-700' : 'text-red-700'}`}>
              {formatMoney(row.amount || 0)}
            </p>
            <p className="text-xs text-gray-500">{row.type === 'PAYMENT' ? 'مبلغ الدفع' : 'مبلغ السحب'}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'نسبة النظام',
      accessor: 'systemShare',
      render: (row) => {
        if (row.type !== 'PAYMENT') {
          return <span className="text-sm text-gray-400">-</span>;
        }

        return (
          <div>
            <p className="text-sm font-semibold text-red-700">
              {formatMoney(row.systemShare || 0)}
            </p>
            <p className="text-xs text-gray-500">
              للطبيب: {formatMoney(row.doctorShare || 0)}
            </p>
          </div>
        );
      },
    },
    {
      header: 'الحالة',
      accessor: 'status',
      render: (row) => getStatusBadge(row),
    },
    {
      header: 'الطريقة',
      accessor: 'method',
      render: (row) => getMethodBadge(row.method),
    },
    {
      header: 'المرجع',
      accessor: 'reference',
      render: (row) => {
        if (row.type === 'PAYMENT') {
          return (
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {row.booking?.user?.username || '-'}
              </p>
              <p className="text-xs text-gray-500">
                {row.booking?.id ? `Booking #${row.booking.id}` : ''}
              </p>
            </div>
          );
        }

        return (
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {row.accountDetails ? 'تفاصيل الحساب' : '-'}
            </p>
            <p className="text-xs text-gray-500">بيانات الحساب/التحويل</p>
          </div>
        );
      },
    },
    {
      header: 'التاريخ',
      accessor: 'createdAt',
      render: (row) => {
        const date = row.processedAt || row.createdAt;
        return (
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {date ? new Date(date).toLocaleDateString('ar-EG') : '-'}
            </p>
            <p className="text-xs text-gray-500">
              {date ? new Date(date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
            </p>
          </div>
        );
      },
    },
  ];

  const actions = [
    {
      label: 'موافقة',
      icon: CheckCircle,
      onClick: (row) => approveMutation.mutate(row.id),
      className: 'text-green-600 hover:bg-green-50',
      show: (row) => row.type === 'WITHDRAWAL' && row.status === 'PENDING',
    },
    {
      label: 'رفض',
      icon: XCircle,
      onClick: (row) => {
        setSelectedWithdrawalId(row.id);
        setRejectModalOpen(true);
      },
      className: 'text-red-600 hover:bg-red-50',
      show: (row) => row.type === 'WITHDRAWAL' && row.status === 'PENDING',
    },
  ];

  const transactions = data?.transactions || [];
  const pendingWithdrawals = transactions.filter(
    (tx) => tx.type === 'WITHDRAWAL' && tx.status === 'PENDING'
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <div className="text-gray-700 font-medium">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl text-center">
          <XCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">تعذر تحميل المحفظة</h3>
          <p className="text-gray-600 mb-4">يرجى المحاولة لاحقاً أو التأكد من رقم الطبيب.</p>
          <button
            onClick={() => navigate('/wallets')}
            className="btn-primary flex items-center gap-2 mx-auto"
            type="button"
          >
            <ArrowRight size={18} />
            العودة إلى قائمة المحافظ
          </button>
        </div>
      </div>
    );
  }

  const doctor = data.doctor || {};
  const summary = data.summary || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/wallets')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          type="button"
        >
          <ArrowRight size={20} />
          <span>العودة</span>
        </button>
      </div>

      {/* Wallet Summary */}
      <div className="glass-card rounded-2xl p-8 bg-white border border-primary-200">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-xl bg-primary-50 border border-primary-200 flex items-center justify-center">
            <Wallet size={30} className="text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-4 flex-wrap mb-3">
              <h1 className="text-4xl font-bold text-gray-900">{doctor.name || '-'}</h1>
              <span className="px-4 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-700">
                {formatMoney(summary.walletBalance || 0)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <DollarSign className="text-green-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">إجمالي التحصيل (قبل نسبة النظام)</p>
                  <p className="text-xl font-bold text-green-700">{formatMoney(summary.grossEarnings || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <DollarSign className="text-red-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">ربح النظام</p>
                  <p className="text-xl font-bold text-red-700">
                    {formatMoney(summary.systemProfit || 0)}
                    <span className="text-xs text-gray-500 mr-2">({summary.systemCommissionRate ?? 0}%)</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <DollarSign className="text-blue-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">صافي أرباح الطبيب</p>
                  <p className="text-xl font-bold text-blue-700">{formatMoney(summary.totalEarnings || 0)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <DollarSign className="text-orange-600" size={20} />
                <div>
                  <p className="text-sm text-gray-600">إجمالي السحوبات</p>
                  <p className="text-xl font-bold text-red-700">{formatMoney(summary.totalWithdrawals || 0)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <p className="text-sm">{doctor.email || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="glass-card rounded-2xl p-6 bg-white border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">معاملات المحفظة</h3>
        <DataTable
          data={transactions}
          columns={columns}
          isLoading={false}
          searchable={true}
          exportable={false}
          filterable={false}
          pagination={true}
          pageSize={10}
          emptyMessage="لا توجد معاملات للمحفظة"
          title="Transactions"
          actions={actions}
          filters={[]}
        />
      </div>

      {/* Pending Withdrawals (Dedicated Block) */}
      <div className="glass-card rounded-2xl p-6 bg-white border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">طلبات السحب (معلقة)</h3>
        <DataTable
          data={pendingWithdrawals}
          columns={columns}
          isLoading={false}
          searchable={false}
          exportable={false}
          filterable={false}
          pagination={true}
          pageSize={10}
          emptyMessage="لا توجد طلبات سحب معلقة"
          title="Pending Withdrawals"
          actions={actions}
          filters={[]}
        />
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setRejectReason('');
          setSelectedWithdrawalId(null);
        }}
        title="تأكيد رفض طلب السحب"
        size="sm"
      >
        <div className="space-y-3 text-gray-700" dir="rtl">
          <p className="text-sm">يرجى كتابة سبب الرفض:</p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            placeholder="سبب الرفض..."
            rows={4}
          />
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => {
                setRejectModalOpen(false);
                setRejectReason('');
                setSelectedWithdrawalId(null);
              }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              type="button"
              disabled={rejectMutation.isPending}
            >
              إلغاء
            </button>
            <button
              onClick={() => {
                if (!rejectReason.trim()) {
                  toast.error('يرجى إدخال سبب الرفض');
                  return;
                }
                if (selectedWithdrawalId) {
                  rejectMutation.mutate({ withdrawalId: selectedWithdrawalId, reason: rejectReason });
                }
              }}
              className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              type="button"
              disabled={rejectMutation.isPending || !selectedWithdrawalId}
            >
              {rejectMutation.isPending ? 'جاري الرفض...' : 'رفض'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default WalletDetails;

