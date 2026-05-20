import { cn } from './cn';

export function Card({ className, children, hover = false, padding = true, ...props }) {
  return (
    <div
      className={cn(
        'surface-card rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/60 dark:bg-slate-900/80',
        hover && 'transition-all duration-200 hover:border-primary-300/60 hover:shadow-md dark:hover:border-primary-500/30',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, action }) {
  return (
    <div className={cn('mb-5 flex items-start justify-between gap-3', className)}>
      <div className="min-w-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-bold text-slate-900 dark:text-white', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('mt-1 text-sm text-slate-500 dark:text-slate-400', className)}>{children}</p>;
}
