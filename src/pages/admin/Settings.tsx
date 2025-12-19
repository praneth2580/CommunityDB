
import {
  Moon,
  Sun,
  Bell,
  Smartphone,
  Globe,
  Database,
  ShieldCheck,
} from 'lucide-react'
interface SettingsProps {
  isDark: boolean
  toggleTheme: () => void
}
export function Settings({ isDark, toggleTheme }: SettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            App preferences and configuration.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Appearance
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isDark ? (
                <Moon className="w-5 h-5 text-slate-900 dark:text-white" />
              ) : (
                <Sun className="w-5 h-5 text-slate-900 dark:text-white" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  Dark Mode
                </p>
                <p className="text-xs text-slate-500">
                  Adjust the appearance of the application
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-black ${isDark ? 'bg-slate-900 dark:bg-white' : 'bg-slate-200'}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Notifications
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg divide-y divide-slate-100 dark:divide-neutral-800">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Push Notifications
              </span>
            </div>
            <div className="w-9 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                SMS Alerts
              </span>
            </div>
            <div className="w-9 h-5 bg-slate-200 dark:bg-slate-700 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          System
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg divide-y divide-slate-100 dark:divide-neutral-800">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <Database className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Data Sync
              </span>
            </div>
            <span className="text-xs text-slate-400">Last synced 2m ago</span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Language
              </span>
            </div>
            <span className="text-xs text-slate-400">English (US)</span>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Privacy Policy
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <p className="text-xs text-slate-400">HemoBase v1.0.4</p>
      </div>
    </div>
  )
}