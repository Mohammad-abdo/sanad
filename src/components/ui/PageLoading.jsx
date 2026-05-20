import { Loader2 } from 'lucide-react';
import { Card } from './Card';

export function PageLoading({ message = 'جاري التحميل...' }) {
  return (
    <div className="flex h-64 items-center justify-center">
      <Card className="flex flex-col items-center px-10 py-8">
        <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary-500" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{message}</p>
      </Card>
    </div>
  );
}
