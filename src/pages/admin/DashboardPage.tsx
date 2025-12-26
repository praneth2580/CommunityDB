import { useEffect, useState } from 'react'
import { MetricCard } from '../../components/MetricCard'
import { analyticsModel, type DashboardStats } from '../../models/analyticsModel'
import { Activity, Users, Heart, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, activityData] = await Promise.all([
          analyticsModel.getDashboardStats(),
          analyticsModel.getRecentActivity()
        ])
        setStats(statsData)
        setRecentActivity(activityData)
      } catch (error) {
        console.error('Dashboard load failed:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm text-slate-500 animate-pulse font-medium">Aggregating system intelligence...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Command Center
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-black uppercase tracking-[0.2em]">
            Real-time Operational Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
            Neural Link Active
          </span>
        </div>
      </div>

      {/* Hero Welcome (Minimalist/Premium) */}
      <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 text-white shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 blur-[100px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] -ml-32 -mb-32"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Welcome to the Registry Dashboard</h2>
            <p className="text-slate-400 text-sm max-w-md font-medium">
              You're currently viewing the live state of the Community Health & Emergency database.
              {stats?.urgentRequests ? ` There are ${stats.urgentRequests} urgent requests requiring intervention.` : ' System status is nominal.'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/people')}
            className="group flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all shadow-xl shadow-white/5"
          >
            Access Directory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Registry Capacity"
          value={stats?.totalPeople || 0}
          icon={Users}
          description="Total records in database"
        />
        <MetricCard
          label="Field Force"
          value={stats?.activeVolunteers || 0}
          icon={Heart}
          variant="blue"
          description="Active volunteer accounts"
        />
        <MetricCard
          label="Urgent Alerts"
          value={stats?.urgentRequests || 0}
          icon={AlertCircle}
          variant="rose"
          urgent={!!stats?.urgentRequests && stats.urgentRequests > 0}
          description="Pending critical assistance"
        />
        <MetricCard
          label="Donor Network"
          value={stats?.activeDonors || 0}
          icon={Activity}
          variant="emerald"
          description="Verified blood donors"
        />
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Real-time Registry Pulse
            </h2>
            <button
              onClick={() => navigate('/admin/people')}
              className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline"
            >
              View Logs
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100 dark:divide-neutral-800">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="p-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3
                        ${activity.is_volunteer ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}
                      `}>
                        {activity.full_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{activity.full_name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {activity.is_volunteer ? 'Registered as Volunteer' : 'Added to Registry'} • {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/people/${activity.id}`)}
                      className="p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 dark:bg-neutral-800 rounded-lg"
                    >
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-400 italic text-sm">
                  No recent activity detected.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Actions / Mini Stats */}
        <section className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
            Security & Sync
          </h2>
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Database Status</span>
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter">Healthy</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[95%]"></div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/bulk')}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 hover:border-rose-500 transition-colors group"
              >
                <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl shadow-sm text-rose-500">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Bulk Sync</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Process Datasets</p>
                </div>
              </button>
              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full p-4 flex items-center gap-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 hover:border-blue-500 transition-colors group"
              >
                <div className="p-2 bg-white dark:bg-neutral-900 rounded-xl shadow-sm text-blue-500">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Analytics</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">View Trends</p>
                </div>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}