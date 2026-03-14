import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { contentModeration } from '../../api/admin';
import { 
  Shield, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  TestTube,
  FileText,
  Image,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../components/common/Modal';

const ContentModeration = () => {
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newWordLanguage, setNewWordLanguage] = useState('english');
  const [testText, setTestText] = useState('');
  const [testResult, setTestResult] = useState(null);

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['content-moderation-stats'],
    queryFn: async () => {
      const response = await contentModeration.getStats();
      return response.data;
    },
  });

  const { data: bannedWords, isLoading: wordsLoading, refetch: refetchWords } = useQuery({
    queryKey: ['banned-words'],
    queryFn: async () => {
      const response = await contentModeration.getBannedWords();
      return response.data;
    },
  });

  const addWordMutation = useMutation({
    mutationFn: (data) => contentModeration.addBannedWord(data),
    onSuccess: () => {
      toast.success('تم إضافة الكلمة المحظورة بنجاح');
      setShowAddWordModal(false);
      setNewWord('');
      refetchWords();
      refetchStats();
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || 'فشل إضافة الكلمة');
    },
  });

  const removeWordMutation = useMutation({
    mutationFn: (data) => contentModeration.removeBannedWord(data),
    onSuccess: () => {
      toast.success('تم حذف الكلمة المحظورة بنجاح');
      refetchWords();
      refetchStats();
    },
    onError: () => {
      toast.error('فشل حذف الكلمة');
    },
  });

  const testMutation = useMutation({
    mutationFn: (data) => contentModeration.testModeration(data),
    onSuccess: (response) => {
      setTestResult(response.data.data);
      if (response.data.data.isSafe) {
        toast.success('المحتوى آمن');
      } else {
        toast.error(response.data.data.message || 'المحتوى غير آمن');
      }
    },
    onError: () => {
      toast.error('فشل اختبار المحتوى');
    },
  });

  const handleAddWord = (e) => {
    e.preventDefault();
    if (!newWord.trim()) {
      toast.error('يرجى إدخال كلمة');
      return;
    }
    addWordMutation.mutate({ word: newWord.trim(), language: newWordLanguage });
  };

  const handleTest = (e) => {
    e.preventDefault();
    if (!testText.trim()) {
      toast.error('يرجى إدخال نص للاختبار');
      return;
    }
    testMutation.mutate({ text: testText });
  };

  if (statsLoading || wordsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="glass-card p-8 rounded-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-gray-700 font-medium">جاري التحميل...</div>
        </div>
      </div>
    );
  }

  const statsData = stats || {};
  const wordsData = bannedWords || { arabic: [], english: [] };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">فلترة المحتوى</h2>
          <p className="text-sm text-gray-500 mt-1">إدارة نظام فلترة المحتوى الحساس وغير المناسب</p>
        </div>
        <button
          onClick={() => setShowAddWordModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          إضافة كلمة محظورة
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary-50 border border-primary-200 flex items-center justify-center">
              <Shield className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.bannedWordsCount || 0}
              </p>
              <p className="text-xs text-gray-500">إجمالي الكلمات المحظورة</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <FileText className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.arabicWordsCount || 0}
              </p>
              <p className="text-xs text-gray-500">كلمات عربية</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-green-50 border border-green-200 flex items-center justify-center">
              <FileText className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.englishWordsCount || 0}
              </p>
              <p className="text-xs text-gray-500">كلمات إنجليزية</p>
            </div>
          </div>
        </div>
        <div className="glass-card rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center">
              <AlertTriangle className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {statsData.patternsCount || 0}
              </p>
              <p className="text-xs text-gray-500">أنماط حساسة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Status */}
      <div className="glass-card rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={24} className="text-primary-600" />
          حالة الميزات
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {statsData.features?.textModeration ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-semibold text-gray-900">فلترة النصوص</p>
              <p className="text-xs text-gray-500">
                {statsData.features?.textModeration ? 'مفعل' : 'معطل'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {statsData.features?.imageModeration ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-semibold text-gray-900">فلترة الصور</p>
              <p className="text-xs text-gray-500">
                {statsData.features?.imageModeration ? 'مفعل' : 'معطل'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            {statsData.features?.spamDetection ? (
              <CheckCircle className="text-green-600" size={24} />
            ) : (
              <XCircle className="text-red-600" size={24} />
            )}
            <div>
              <p className="font-semibold text-gray-900">كشف الرسائل المزعجة</p>
              <p className="text-xs text-gray-500">
                {statsData.features?.spamDetection ? 'مفعل' : 'معطل'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="glass-card rounded-2xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TestTube size={24} className="text-primary-600" />
          اختبار المحتوى
        </h3>
        <form onSubmit={handleTest} className="space-y-4">
          <div>
            <label className="label">النص للاختبار</label>
            <textarea
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
              placeholder="أدخل النص لاختبار الفلترة..."
              className="input min-h-[100px]"
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2"
            disabled={testMutation.isPending}
          >
            <TestTube size={18} />
            {testMutation.isPending ? 'جاري الاختبار...' : 'اختبار المحتوى'}
          </button>
          {testResult && (
            <div className={`p-4 rounded-lg border ${
              testResult.isSafe 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {testResult.isSafe ? (
                  <CheckCircle className="text-green-600" size={20} />
                ) : (
                  <XCircle className="text-red-600" size={20} />
                )}
                <span className={`font-semibold ${
                  testResult.isSafe ? 'text-green-700' : 'text-red-700'
                }`}>
                  {testResult.isSafe ? 'المحتوى آمن' : 'المحتوى غير آمن'}
                </span>
              </div>
              {testResult.reason && (
                <p className="text-sm text-gray-600">السبب: {testResult.reason}</p>
              )}
              {testResult.message && (
                <p className="text-sm text-gray-600 mt-1">{testResult.message}</p>
              )}
            </div>
          )}
        </form>
      </div>

      {/* Banned Words Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arabic Words */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={24} className="text-primary-600" />
            الكلمات المحظورة (عربي) ({wordsData.arabic?.length || 0})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {wordsData.arabic && wordsData.arabic.length > 0 ? (
              wordsData.arabic.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{word}</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف "${word}"؟`)) {
                        removeWordMutation.mutate({ word, language: 'arabic' });
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد كلمات محظورة</p>
            )}
          </div>
        </div>

        {/* English Words */}
        <div className="glass-card rounded-2xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={24} className="text-primary-600" />
            الكلمات المحظورة (إنجليزي) ({wordsData.english?.length || 0})
          </h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {wordsData.english && wordsData.english.length > 0 ? (
              wordsData.english.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900">{word}</span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${word}"?`)) {
                        removeWordMutation.mutate({ word, language: 'english' });
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">لا توجد كلمات محظورة</p>
            )}
          </div>
        </div>
      </div>

      {/* Add Word Modal */}
      <Modal
        isOpen={showAddWordModal}
        onClose={() => {
          setShowAddWordModal(false);
          setNewWord('');
        }}
        title="إضافة كلمة محظورة"
        size="md"
      >
        <form onSubmit={handleAddWord} className="space-y-4">
          <div>
            <label className="label">الكلمة</label>
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="أدخل الكلمة المحظورة"
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">اللغة</label>
            <select
              value={newWordLanguage}
              onChange={(e) => setNewWordLanguage(e.target.value)}
              className="input"
            >
              <option value="arabic">عربي</option>
              <option value="english">إنجليزي</option>
            </select>
          </div>
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={addWordMutation.isPending}
            >
              {addWordMutation.isPending ? 'جاري الإضافة...' : 'إضافة'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddWordModal(false);
                setNewWord('');
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

export default ContentModeration;

