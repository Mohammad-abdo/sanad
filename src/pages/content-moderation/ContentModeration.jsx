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
import { PageHeader, StatCard, Button, PageLoading, Card, CardTitle } from '../../components/ui';

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

  if (statsLoading || wordsLoading) return <PageLoading />;

  const statsData = stats || {};
  const wordsData = bannedWords || { arabic: [], english: [] };

  return (
    <div className="page-shell">
      <PageHeader
        title="فلترة المحتوى"
        description="إدارة نظام فلترة المحتوى الحساس وغير المناسب"
        actions={<Button icon={Plus} onClick={() => setShowAddWordModal(true)}>إضافة كلمة محظورة</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="كلمات محظورة" value={statsData.bannedWordsCount || 0} icon={Shield} tone="violet" />
        <StatCard title="كلمات عربية" value={statsData.arabicWordsCount || 0} icon={FileText} tone="sky" />
        <StatCard title="كلمات إنجليزية" value={statsData.englishWordsCount || 0} icon={FileText} tone="emerald" />
        <StatCard title="أنماط حساسة" value={statsData.patternsCount || 0} icon={AlertTriangle} tone="fuchsia" />
      </div>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white">
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
      </Card>

      <Card>
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
      </Card>

      {/* Banned Words Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Arabic Words */}
        <Card>
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
                      removeWordMutation.mutate({ word, language: 'arabic' });
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
        </Card>

        <Card>
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
                      removeWordMutation.mutate({ word, language: 'english' });
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
        </Card>
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

