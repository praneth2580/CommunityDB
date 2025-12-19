
import { MetricCard } from '../../components/MetricCard'
import { Calendar } from 'lucide-react'
export function Analytics() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Performance metrics and trends.
          </p>
        </div>
        <button className="flex items-center px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-md hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
          <Calendar className="w-3.5 h-3.5 mr-2" />
          Last 30 Days
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Total Donations"
          value="1,248"
          trend="up"
          trendValue="12%"
        />
        <MetricCard label="New Donors" value="84" trend="up" trendValue="5%" />
        <MetricCard
          label="Units Used"
          value="956"
          trend="neutral"
          trendValue="0%"
        />
        <MetricCard
          label="Critical Shortages"
          value="2"
          trend="down"
          trendValue="-1"
          urgent
        />
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-6">
          Donation Trends
        </h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[40, 65, 45, 80, 55, 70, 45, 60, 75, 50, 65, 85].map((h, i) => (
            <div
              key={i}
              className="w-full bg-slate-100 dark:bg-neutral-800 rounded-t-sm relative group"
            >
              <div
                className="absolute bottom-0 left-0 right-0 bg-slate-900 dark:bg-white rounded-t-sm transition-all duration-500 group-hover:bg-rose-500"
                style={{
                  height: `${h}%`,
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-slate-400 font-mono">
          <span>JAN</span>
          <span>FEB</span>
          <span>MAR</span>
          <span>APR</span>
          <span>MAY</span>
          <span>JUN</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-slate-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Blood Type Distribution
          </h4>
          <div className="space-y-3">
            {[
              {
                label: 'O Positive',
                val: 38,
                color: 'bg-rose-500',
              },
              {
                label: 'A Positive',
                val: 34,
                color: 'bg-orange-500',
              },
              {
                label: 'B Positive',
                val: 9,
                color: 'bg-amber-500',
              },
              {
                label: 'Others',
                val: 19,
                color: 'bg-slate-500',
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    {item.label}
                  </span>
                  <span className="font-mono text-slate-500">{item.val}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{
                      width: `${item.val}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border border-slate-200 dark:border-neutral-800 rounded-lg bg-white dark:bg-neutral-900">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Recent Activity
          </h4>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-500"></div>
                <div>
                  <p className="text-xs text-slate-900 dark:text-white font-medium">
                    New donation received
                  </p>
                  <p className="text-[10px] text-slate-500">
                    2 hours ago • Center A
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}