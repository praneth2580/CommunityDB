import { useEffect, useState } from 'react'
import { MetricCard } from '../../components/MetricCard'
import { Calendar, Users, Activity, Heart, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react'
import { analyticsModel, type BloodTypeDistribution, type DashboardStats } from '../../models/analyticsModel'

export function AnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bloodTypes, setBloodTypes] = useState<BloodTypeDistribution[]>([])
  const [trends, setTrends] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, bloodData, trendData] = await Promise.all([
          analyticsModel.getDashboardStats(),
          analyticsModel.getBloodTypeDistribution(),
          analyticsModel.getMonthlyTrends()
        ])
        setStats(statsData)
        setBloodTypes(bloodData)
        setTrends(trendData)
      } catch (error) {
        console.error('Analytics load failed:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-500 animate-pulse font-medium">Processing demographic intelligence...</p>
      </div>
    )
  }

  // Find the max trend value for scaling the chart
  const maxTrend = trends.length > 0 ? Math.max(...trends.map(t => t.value), 1) : 1

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Demographics & Trends
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-black uppercase tracking-[0.2em]">
            Deep Data Insights
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all shadow-sm">
          <Calendar className="w-3.5 h-3.5" />
          Rolling 6 Months
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Registry Scale"
          value={stats?.totalPeople || 0}
          icon={Users}
          variant="blue"
        />
        <MetricCard
          label="Network Pulse"
          value={stats?.activeDonors || 0}
          icon={Activity}
          variant="emerald"
        />
        <MetricCard
          label="Volunteer Base"
          value={stats?.activeVolunteers || 0}
          icon={Heart}
          variant="rose"
        />
        <MetricCard
          label="Alert Level"
          value={stats?.urgentRequests || 0}
          icon={AlertCircle}
          variant="amber"
          urgent={!!stats?.urgentRequests && stats.urgentRequests > 0}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation Trends Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[3rem] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Registration Growth
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
              <ArrowUpRight className="w-3 h-3" />
              Real-time Feed
            </div>
          </div>

          <div className="h-64 flex items-end justify-between gap-4 px-2">
            {trends.map((t, i) => (
              <div
                key={i}
                className="flex-1 bg-slate-50 dark:bg-neutral-800/50 rounded-2xl relative group h-full"
              >
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-2xl transition-all duration-1000 group-hover:bg-rose-500 cursor-pointer shadow-lg shadow-blue-500/20"
                  style={{
                    height: `${(t.value / maxTrend) * 100}%`,
                    minHeight: t.value > 0 ? '4px' : '0px'
                  }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-2">
            {trends.map((t, i) => (
              <span key={i} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* Blood Type Distribution */}
        <div className="p-8 border border-slate-200 dark:border-neutral-800 rounded-[3rem] bg-white dark:bg-neutral-900 shadow-sm">
          <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8">
            Blood Type Registry
          </h4>
          <div className="space-y-6">
            {bloodTypes.length > 0 ? bloodTypes.map((item, idx) => (
              <div key={item.group} className="group cursor-default">
                <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase tracking-wide">
                  <span className="text-slate-900 dark:text-white transition-colors group-hover:text-blue-500">
                    {item.group}
                  </span>
                  <span className="text-slate-400">{item.count} Records ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-neutral-700/50">
                  <div
                    className={`h-full transition-all duration-1000 shadow-sm
                        ${idx === 0 ? 'bg-rose-500 shadow-rose-500/20' :
                        idx === 1 ? 'bg-blue-500 shadow-blue-500/20' :
                          idx === 2 ? 'bg-emerald-500 shadow-emerald-500/20' :
                            'bg-slate-400 shadow-slate-400/20'}
                    `}
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            )) : (
              <div className="text-center py-12 text-slate-400 italic text-sm">
                No blood type data available.
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-neutral-800">
            <h5 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Urgent Needs</h5>
            <div className="p-4 bg-orange-50 dark:bg-amber-950/20 border border-orange-100 dark:border-amber-900/30 rounded-2xl">
              <p className="text-[10px] font-bold text-orange-800 dark:text-amber-400 italic">
                "O Negative" and "AB Positive" types are currently below 15% threshold in local centers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}