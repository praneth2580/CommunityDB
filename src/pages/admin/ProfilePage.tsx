import { Mail, Phone, MapPin, Shield, Key, LogOut, Loader2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { peopleModel, type PersonData } from '../../models/peopleModel'
import { useAppSelector } from '../../store'

export function ProfilePage() {
  const navigate = useNavigate()
  const { role, user: authUser } = useAppSelector(state => state.auth)
  const [profile, setProfile] = useState<PersonData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await peopleModel.getMyProfile()
        setProfile(data)
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-sm text-slate-500 animate-pulse font-medium">Synchronizing profile...</p>
      </div>
    )
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : authUser?.email?.slice(0, 2).toUpperCase() || '??'

  const roleLabel = role === 'super_admin' ? 'Super Administrator' : role === 'admin' ? 'Administrator' : 'Volunteer'

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 p-2 md:p-0">
      <div className="flex items-end justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Administrative Profile
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-widest font-bold">
            Identity & Authorization Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col: Hero Card */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-8 flex flex-col items-center text-center shadow-sm">
          <div className="w-32 h-32 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-4xl font-black text-rose-500 border-4 border-rose-500/10 shadow-inner">
            {initials}
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {profile?.full_name || 'System User'}
          </h2>
          <p className="text-sm font-bold text-rose-500 uppercase tracking-widest mt-1">
            {roleLabel}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-rose-500 text-white text-[10px] rounded-full font-black uppercase tracking-tighter">
              Verified {role?.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] rounded-full font-black uppercase tracking-tighter border border-emerald-500/20">
              Session Active
            </span>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              Registry Information
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <ProfileItem icon={Mail} label="Email Address" value={profile?.email || authUser?.email || 'Not verified'} />
              <ProfileItem icon={Phone} label="Primary Phone" value={profile?.phone || 'Not provided'} />
              <ProfileItem icon={MapPin} label="Service Location" value={profile?.locality_area || profile?.address_line || 'Global'} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              Security Protocol
            </h3>
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
              <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-neutral-800 transition-all text-left group">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg group-hover:bg-rose-500 transition-colors">
                    <Key className="w-4 h-4 text-slate-500 group-hover:text-white" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Credentials</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-tighter">Change Account Password</span>
                  </div>
                </div>
              </button>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg">
                    <Shield className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 dark:text-white">Access Level</span>
                    <span className="block text-[10px] text-slate-500 uppercase font-black tracking-tighter">System-Wide Authorization</span>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded uppercase tracking-tighter">
                  Full Grant
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full p-5 flex items-center justify-center space-x-3 text-rose-500 hover:bg-rose-500 hover:text-white border-2 border-dashed border-rose-500/20 hover:border-rose-500 rounded-2xl transition-all font-black uppercase tracking-widest text-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </div>
  )
}

function ProfileItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="p-4 flex items-center justify-between border-b last:border-0 border-slate-100 dark:border-neutral-800">
      <div className="flex items-center space-x-4">
        <div className="p-2 bg-slate-100 dark:bg-neutral-800 rounded-lg">
          <Icon className="w-4 h-4 text-slate-500" />
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
          {label}
        </span>
      </div>
      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
        {value}
      </span>
    </div>
  )
}