import { useEffect, useState } from 'react'
import {
  Moon,
  Sun,
  Bell,
  Globe,
  ShieldCheck,
  User,
  Shield,
  RefreshCw,
} from 'lucide-react'
import { useAppSelector } from '../../store'
import { peopleModel, type PersonData } from '../../models/peopleModel'

interface SettingsProps {
  isDark: boolean
  toggleTheme: () => void
}

export function SettingsPage({ isDark, toggleTheme }: SettingsProps) {
  const { user, role } = useAppSelector((state) => state.auth)
  const [profile, setProfile] = useState<PersonData | null>(null)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    if (user?.id) {
      peopleModel.getMyProfile().then(setProfile).catch(console.error)
    }
  }, [user?.id])

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 1500)
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Configuration
          </h1>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-black uppercase tracking-[0.2em]">
            System Preferences & Logic
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account & Security */}
        <div className="lg:col-span-1 space-y-6">
          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Active Identity
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{profile?.full_name || 'Administrator'}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{user?.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-neutral-800 rounded-xl border border-slate-100 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">Access Level</span>
                  </div>
                  <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                    {role?.replace('_', ' ')}
                  </span>
                </div>
                <button className="w-full py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                  Manage Security
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Data Synchronization
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2rem] p-6 shadow-sm">
              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full p-4 flex items-center justify-between bg-slate-50 dark:bg-neutral-800 rounded-2xl border border-slate-100 dark:border-neutral-700 hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <RefreshCw className={`w-4 h-4 text-emerald-500 ${syncing ? 'animate-spin' : ''}`} />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Sync Global State</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Last checked: Just now</p>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>

        {/* Right Columns: Preferences */}
        <div className="lg:col-span-2 space-y-8">
          {/* Appearance Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Interface & Appearance
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-sm">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer" onClick={toggleTheme}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${isDark ? 'bg-slate-800 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Dark Mode Spectrum</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Adjust standard ocular comfort levels</p>
                  </div>
                </div>
                <div
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${isDark ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]' : 'bg-slate-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
                </div>
              </div>
            </div>
          </section>

          {/* Logic & Filters */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Operational Logic
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2.5rem] divide-y divide-slate-100 dark:divide-neutral-800 shadow-sm">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Critical Notifications</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Real-time alerts for urgent assistance</p>
                  </div>
                </div>
                <div className="w-10 h-5 bg-emerald-500/20 border border-emerald-500/30 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/50"></div>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-slate-100 dark:bg-neutral-800 text-slate-500 rounded-2xl transition-transform group-hover:scale-110">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">Regional Locale</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">English (United States)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Legal / Manifest */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">
              Manifest
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-[2.5rem] divide-y divide-slate-100 dark:divide-neutral-800 shadow-sm overflow-hidden">
              <div className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
                <div className="flex items-center space-x-4">
                  <ShieldCheck className="w-5 h-5 text-slate-400 ml-1" />
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">Privacy Policy</span>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HemoBase Operational Protocol v1.0.4</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}