import { AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

export function PageError({ message = 'خطأ في تحميل البيانات', detail, onRetry }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <Card className="max-w-md text-center">
        <AlertCircle className="mx-auto mb-4 text-red-500" size={40} />
        <p className="font-semibold text-red-600 dark:text-red-400">{message}</p>
        {detail && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{detail}</p>}
        {onRetry && (
          <Button className="mt-4" onClick={onRetry}>
            إعادة المحاولة
          </Button>
        )}
      </Card>
    </div>
  );
}
