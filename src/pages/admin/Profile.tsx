import { Mail, Phone, MapPin, Shield, Key, LogOut } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export function Profile() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Profile
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your account information.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4 text-3xl font-bold text-slate-400">
          JD
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          John Doe
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Senior Administrator
        </p>
        <div className="mt-4 flex gap-2">
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
            Admin Access
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-full font-medium">
            Active
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Contact Information
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg divide-y divide-slate-100 dark:divide-neutral-800">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Email
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              john.doe@hemobase.com
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Phone
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              +1 (555) 123-4567
            </span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Location
              </span>
            </div>
            <span className="text-sm font-medium text-slate-900 dark:text-white">
              New York, NY
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
          Security
        </h3>
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg divide-y divide-slate-100 dark:divide-neutral-800">
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Key className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Change Password
              </span>
            </div>
          </button>
          <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">
                Two-Factor Authentication
              </span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              Enabled
            </span>
          </button>
        </div>
      </div>

      <button
        onClick={handleSignOut}
        className="w-full p-4 flex items-center justify-center space-x-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-transparent hover:border-rose-200 dark:hover:border-rose-900 rounded-lg transition-all"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">Sign Out</span>
      </button>
    </div>
  )
}