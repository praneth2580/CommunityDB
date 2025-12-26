import { ArrowUpRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  urgent?: boolean
  icon?: LucideIcon
  description?: string
  variant?: 'rose' | 'blue' | 'emerald' | 'amber' | 'default'
}

export function MetricCard({
  label,
  value,
  trend,
  trendValue,
  urgent,
  icon: Icon,
  description,
  variant = 'default',
}: MetricCardProps) {
  const variantStyles = {
    rose: 'border-rose-100 dark:border-rose-900/30 text-rose-600',
    blue: 'border-blue-100 dark:border-blue-900/30 text-blue-600',
    emerald: 'border-emerald-100 dark:border-emerald-900/30 text-emerald-600',
    amber: 'border-amber-100 dark:border-amber-900/30 text-amber-600',
    default: 'border-slate-200 dark:border-neutral-800 text-slate-900 dark:text-white',
  }

  const iconBgStyles = {
    rose: 'bg-rose-500/10 text-rose-500',
    blue: 'bg-blue-500/10 text-blue-500',
    emerald: 'bg-emerald-500/10 text-emerald-500',
    amber: 'bg-amber-500/10 text-amber-500',
    default: 'bg-slate-100 dark:bg-neutral-800 text-slate-500',
  }

  return (
    <div
      className={`
      group flex flex-col p-5 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20
      ${urgent ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50' : 'bg-white dark:bg-neutral-900'}
      ${variantStyles[variant as keyof typeof variantStyles]}
    `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${iconBgStyles[variant as keyof typeof iconBgStyles]}`}>
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        {trend && (
          <div
            className={`flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : trend === 'down' ? 'bg-rose-500/10 text-rose-600' : 'bg-slate-100 text-slate-500'}`}
          >
            {trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {trendValue}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-black tabular-nums tracking-tighter">
          {value}
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em]">
            {label}
          </span>
          {description && (
            <span className="text-[10px] font-bold text-slate-400/60 lowercase italic">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
