import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { cn } from './cn';
import { Card } from './Card';
import { Button } from './Button';

export function DetailPageLayout({
  backTo,
  backLabel = 'رجوع',
  title,
  subtitle,
  badges,
  actions,
  children,
  isLoading,
  error,
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <Card className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          {onRetry && (
            <Button className="mt-4" onClick={onRetry}>
              إعادة المحاولة
            </Button>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {backTo && (
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
        >
          <ArrowRight size={16} />
          {backLabel}
        </Link>
      )}

      <Card className="!p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
            {badges && <div className="mt-3 flex flex-wrap gap-2">{badges}</div>}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
        </div>
      </Card>

      {children}
    </div>
  );
}

export function DetailSection({ title, description, children, className }) {
  return (
    <Card className={cn('!p-5', className)}>
      {(title || description) && (
        <div className="mb-4 border-b border-slate-100 pb-4 dark:border-slate-700/60">
          {title && <h2 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h2>}
          {description && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </Card>
  );
}
