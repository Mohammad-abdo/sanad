import { cn } from './cn';
import { Card } from './Card';

const iconTones = {
  violet: 'bg-violet-100 text-primary-600 dark:bg-violet-950/50 dark:text-primary-300',
  emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300',
  sky: 'bg-sky-100 text-sky-600 dark:bg-sky-950/50 dark:text-sky-300',
  amber: 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300',
  fuchsia: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/50 dark:text-fuchsia-300',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-300',
};

export function StatCard({ title, value, subtitle, icon: Icon, tone = 'violet', footer, className }) {
  return (
    <Card hover className={cn('group', className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105',
            iconTones[tone]
          )}
        >
          {Icon && <Icon size={22} strokeWidth={2} />}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
      </div>
      {footer && (
        <div className="mt-4 border-t border-slate-100 pt-3 dark:border-slate-700/60">{footer}</div>
      )}
    </Card>
  );
}

export function MiniStat({ label, value, icon: Icon, tone = 'primary' }) {
  const iconClass =
    tone === 'success'
      ? 'text-emerald-600 dark:text-emerald-400'
      : tone === 'warning'
        ? 'text-amber-600 dark:text-amber-400'
        : tone === 'danger'
          ? 'text-red-600 dark:text-red-400'
          : 'text-primary-600 dark:text-primary-400';

  return (
    <Card padding className="flex items-center gap-4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
        {Icon && <Icon className={iconClass} size={20} />}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
      </div>
    </Card>
  );
}
