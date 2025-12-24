
import { MetricCard } from '../../components/MetricCard'
import { DataTable } from '../../components/DataTable'
export function Dashboard() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Area (Minimal) */}
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time overview of blood bank operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono text-slate-500 uppercase">
            System Live
          </span>
        </div>
      </div>

      {/* Metrics Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Total Units"
          value="1,247"
          trend="up"
          trendValue="4.5%"
        />
        <MetricCard
          label="Available Volunteers"
          value="89"
          trend="neutral"
          trendValue="0%"
        />
        <MetricCard
          label="Urgent Requests"
          value="12"
          trend="up"
          trendValue="+3"
          urgent
        />
        <MetricCard
          label="Active Donors"
          value="456"
          trend="up"
          trendValue="12%"
        />
      </section>

      {/* Main Content Area */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center">
            Inventory Status
          </h2>
        </div>

        <DataTable data={[]} columns={[]} />
      </section>
    </div>
  )
}