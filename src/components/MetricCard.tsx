
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
interface MetricCardProps {
  label: string
  value: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  urgent?: boolean
}
export function MetricCard({
  label,
  value,
  trend,
  trendValue,
  urgent,
}: MetricCardProps) {
  return (
    <div
      className={`
      flex flex-col p-3 rounded-lg border transition-colors duration-200
      ${urgent ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50' : 'bg-white border-slate-200 dark:bg-neutral-900 dark:border-neutral-800'}
    `}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        {trend && (
          <div
            className={`flex items-center text-xs ${trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
            {trendValue}
          </div>
        )}
      </div>
      <div
        className={`text-2xl font-semibold tabular-nums tracking-tight ${urgent ? 'text-red-700 dark:text-red-400' : 'text-slate-900 dark:text-white'}`}
      >
        {value}
      </div>
    </div>
  )
}
