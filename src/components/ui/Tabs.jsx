import { cn } from './cn';

export function Tabs({ tabs, active, onChange, className }) {
  return (
    <div className={cn('flex gap-1 border-b border-slate-200 dark:border-slate-700', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-5 py-3 text-sm font-semibold transition-colors',
            active === tab.id
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          )}
        >
          {tab.label}
          {tab.badge != null && (
            <span className="ms-2 rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-950/50 dark:text-primary-300">
              {tab.badge}
            </span>
          )}
          {active === tab.id && (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary-600 dark:bg-primary-400" />
          )}
        </button>
      ))}
    </div>
  );
}
