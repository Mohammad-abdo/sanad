import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctors } from '../../api/admin';
import { ArrowRight, Plus, Trash2, Save, Stethoscope } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiErrorMessage } from '../../utils/apiError';

const DAY_LABELS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

function emptyWeekAvailability() {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    isActive: false,
    slotsText: '',
  }));
}

function parseSlotsText(timeSlots) {
  try {
    const arr = typeof timeSlots === 'string' ? JSON.parse(timeSlots) : timeSlots;
    return Array.isArray(arr) ? arr.join(', ') : '';
  } catch {
    return typeof timeSlots === 'string' ? timeSlots : '';
  }
}

const DoctorForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hydratedRef = useRef(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [bio, setBio] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [isApproved, setIsApproved] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [featuredOrder, setFeaturedOrder] = useState('');
  const [bookingsPaused, setBookingsPaused] = useState(false);
  const [walletFrozen, setWalletFrozen] = useState(false);
  const [cancellationPolicy, setCancellationPolicy] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [sessionRows, setSessionRows] = useState([{ duration: '', price: '' }]);
  const [weekAvail, setWeekAvail] = useState(() => emptyWeekAvailability());

  const { data: doctor, isLoading } = useQuery({
    queryKey: ['doctor-details', id],
    queryFn: async () => {
      const response = await doctors.getById(id);
      return response.data.data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    hydratedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (!isEdit || !doctor || hydratedRef.current) return;
    hydratedRef.current = true;
    setName(doctor.name || '');
    setEmail(doctor.email || '');
    setPhone(doctor.phone || '');
    setPassword('');
    setSpecialization(doctor.specialization || '');
    setBio(doctor.bio || '');
    setIsVerified(Boolean(doctor.isVerified));
    setIsApproved(Boolean(doctor.isApproved));
    setIsActive(Boolean(doctor.isActive));
    setIsFeatured(Boolean(doctor.isFeatured));
    setFeaturedOrder(
      doctor.featuredOrder !== null && doctor.featuredOrder !== undefined
        ? String(doctor.featuredOrder)
        : ''
    );
    setBookingsPaused(Boolean(doctor.bookingsPaused));
    setWalletFrozen(Boolean(doctor.walletFrozen));
    setCancellationPolicy(doctor.cancellationPolicy || '');
    setSpecialtiesText((doctor.specialties || []).map((s) => s.specialty).join('\n'));

    const nextWeek = emptyWeekAvailability();
    (doctor.availability || []).forEach((a) => {
      const d = a.dayOfWeek;
      if (d < 0 || d > 6) return;
      nextWeek[d] = {
        dayOfWeek: d,
        isActive: Boolean(a.isActive),
        slotsText: parseSlotsText(a.timeSlots),
      };
    });
    setWeekAvail(nextWeek);

    const prices = doctor.sessionPrices || [];
    if (prices.length) {
      setSessionRows(
        prices.map((sp) => ({ duration: String(sp.duration), price: String(sp.price) }))
      );
    } else {
      setSessionRows([{ duration: '', price: '' }]);
    }
  }, [isEdit, doctor]);

  const createMutation = useMutation({
    mutationFn: doctors.create,
    onSuccess: (axiosRes) => {
      toast.success('تم إضافة الطبيب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      const newId = axiosRes?.data?.data?.id;
      if (newId) navigate(`/doctors/${newId}`);
      else navigate('/doctors');
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'فشل إضافة الطبيب')),
  });

  const updateMutation = useMutation({
    mutationFn: ({ doctorId, data }) => doctors.update(doctorId, data),
    onSuccess: () => {
      toast.success('تم تحديث الطبيب بنجاح');
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctor-details', id] });
      navigate(`/doctors/${id}`);
    },
    onError: (e) => toast.error(getApiErrorMessage(e, 'فشل تحديث الطبيب')),
  });

  const buildPayload = () => {
    const sessionPrices = sessionRows
      .filter((r) => r.duration !== '' && r.price !== '')
      .map((r) => ({
        duration: parseInt(r.duration, 10),
        price: parseFloat(r.price),
      }))
      .filter((r) => !Number.isNaN(r.duration) && !Number.isNaN(r.price));

    const availability = weekAvail.map((d) => ({
      dayOfWeek: d.dayOfWeek,
      isActive: d.isActive,
      timeSlots: d.slotsText
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
    }));

    const specialties = specialtiesText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

    const base = {
      name,
      email,
      phone,
      specialization: specialization || null,
      bio: bio || null,
      isVerified,
      isApproved,
      isActive,
      isFeatured,
      featuredOrder: featuredOrder === '' ? null : featuredOrder,
      bookingsPaused,
      walletFrozen,
      cancellationPolicy: cancellationPolicy || null,
      sessionPrices,
      availability,
      specialties,
    };

    if (password.trim()) {
      base.password = password;
    }

    return base;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = buildPayload();

    if (!payload.name?.trim() || !payload.email?.trim()) {
      toast.error('الاسم والبريد مطلوبان');
      return;
    }

    if (!isEdit) {
      if (!password || password.length < 6) {
        toast.error('كلمة مرور لا تقل عن 6 أحرف مطلوبة للطبيب الجديد');
        return;
      }
      if (!payload.phone?.trim()) {
        toast.error('رقم الهاتف مطلوب');
        return;
      }
      createMutation.mutate({ ...payload, password });
      return;
    }

    if (password && password.length < 6) {
      toast.error('كلمة المرور يجب ألا تقل عن 6 أحرف');
      return;
    }

    updateMutation.mutate({ doctorId: id, data: payload });
  };

  const addSessionRow = () => {
    setSessionRows((rows) => [...rows, { duration: '', price: '' }]);
  };

  const removeSessionRow = (index) => {
    setSessionRows((rows) => rows.filter((_, i) => i !== index));
  };

  const updateSessionRow = (index, field, value) => {
    setSessionRows((rows) =>
      rows.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const updateWeekDay = (day, patch) => {
    setWeekAvail((w) => w.map((d) => (d.dayOfWeek === day ? { ...d, ...patch } : d)));
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4" />
          <div className="text-gray-700 font-medium">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const pending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate(isEdit ? `/doctors/${id}` : '/doctors')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowRight size={20} />
          <span>{isEdit ? 'العودة للتفاصيل' : 'العودة للقائمة'}</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Stethoscope className="text-primary-600" size={28} />
          {isEdit ? 'تعديل بيانات الطبيب' : 'إضافة طبيب جديد'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass-card rounded-2xl p-6 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            البيانات الأساسية
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">الاسم *</label>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">البريد الإلكتروني *</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">رقم الهاتف *</label>
              <input
                type="tel"
                className="input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="label">التخصص</label>
              <input
                className="input"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">
                كلمة المرور {isEdit && '(اتركها فارغة إن لم ترد تغييرها)'}
                {!isEdit && ' *'}
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={isEdit ? 0 : 6}
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">السيرة / نبذة</label>
              <textarea
                className="input min-h-[100px]"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            الحالة والظهور
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isApproved}
                onChange={(e) => setIsApproved(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">موافق عليه</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">موثّق</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">نشط</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">مميز في القائمة</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={bookingsPaused}
                onChange={(e) => setBookingsPaused(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">إيقاف الحجوزات</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={walletFrozen}
                onChange={(e) => setWalletFrozen(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm text-gray-800">تجميد المحفظة / السحب</span>
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">ترتيب الظهور (مميز)</label>
              <input
                type="number"
                className="input"
                value={featuredOrder}
                onChange={(e) => setFeaturedOrder(e.target.value)}
                placeholder="فارغ = بدون ترتيب"
              />
            </div>
            <div className="md:col-span-2">
              <label className="label">سياسة الإلغاء</label>
              <textarea
                className="input min-h-[80px]"
                rows={3}
                value={cancellationPolicy}
                onChange={(e) => setCancellationPolicy(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            التخصصات الفرعية
          </h3>
          <p className="text-sm text-gray-500">سطر أو فاصلة لكل تخصص</p>
          <textarea
            className="input min-h-[100px]"
            value={specialtiesText}
            onChange={(e) => setSpecialtiesText(e.target.value)}
            placeholder={'قلق\nاكتئاب'}
          />
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-200 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h3 className="text-lg font-semibold text-gray-900">أسعار الجلسات (بالدقيقة)</h3>
            <button type="button" onClick={addSessionRow} className="btn-secondary flex items-center gap-1 text-sm">
              <Plus size={16} />
              صف
            </button>
          </div>
          <p className="text-sm text-gray-500">مثال: 30 دقيقة بسعر محدد — لا تكرار لنفس المدة</p>
          <div className="space-y-2">
            {sessionRows.map((row, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-[120px]">
                  <label className="label text-xs">المدة (دقيقة)</label>
                  <input
                    type="number"
                    className="input"
                    value={row.duration}
                    onChange={(e) => updateSessionRow(index, 'duration', e.target.value)}
                    min={1}
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="label text-xs">السعر</label>
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={row.price}
                    onChange={(e) => updateSessionRow(index, 'price', e.target.value)}
                    min={0}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSessionRow(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg mb-0.5"
                  disabled={sessionRows.length === 1}
                  aria-label="حذف الصف"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
            المواعيد الأسبوعية
          </h3>
          <p className="text-sm text-gray-500">
            فعّل اليوم ثم اكتب الفترات مفصولة بفاصلة أو سطر (مثل 09:00-12:00، 15:00-18:00)
          </p>
          <div className="space-y-4">
            {weekAvail.map((d) => (
              <div
                key={d.dayOfWeek}
                className="border border-gray-100 rounded-xl p-4 bg-gray-50/50"
              >
                <div className="flex items-center gap-3 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-900">
                    <input
                      type="checkbox"
                      checked={d.isActive}
                      onChange={(e) => updateWeekDay(d.dayOfWeek, { isActive: e.target.checked })}
                    />
                    {DAY_LABELS[d.dayOfWeek]}
                  </label>
                </div>
                <textarea
                  className="input min-h-[72px] text-sm"
                  placeholder="09:00-12:00, 15:00-18:00"
                  value={d.slotsText}
                  onChange={(e) => updateWeekDay(d.dayOfWeek, { slotsText: e.target.value })}
                  disabled={!d.isActive}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="btn-primary flex items-center gap-2" disabled={pending}>
            <Save size={18} />
            {isEdit ? 'حفظ التعديلات' : 'إنشاء الطبيب'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate(isEdit ? `/doctors/${id}` : '/doctors')}
            disabled={pending}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;
