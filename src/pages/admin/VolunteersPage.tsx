import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  Star,
  MoreHorizontal,
  Loader2,
  Users,
} from 'lucide-react'
import { peopleModel, type PersonData } from '../../models/peopleModel'

export function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<PersonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVolunteers() {
      try {
        setLoading(true)
        const data = await peopleModel.getVolunteers()
        setVolunteers(data)
      } catch (err) {
        console.error('Failed to fetch volunteers', err)
        setError('Could not load volunteer roster.')
      } finally {
        setLoading(false)
      }
    }
    fetchVolunteers()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
        <p className="text-slate-500 text-sm italic font-medium">Loading volunteer roster...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-end justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-500" />
            Volunteers
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active volunteer roster and records.
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          {volunteers.length} Active Agents
        </div>
      </div>

      {error ? (
        <div className="p-12 text-center bg-slate-50 dark:bg-neutral-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-neutral-800">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((volunteer) => (
            <Link
              key={volunteer.id}
              to={`/admin/people/${volunteer.id}`}
              className="group p-5 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-[2rem] hover:border-rose-200 dark:hover:border-rose-900/50 transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-lg font-black text-slate-900 dark:text-white border border-slate-100 dark:border-neutral-800">
                    {volunteer.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                      {volunteer.full_name}
                    </h3>
                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                      {volunteer.admins?.role || 'Volunteer'}
                    </p>
                  </div>
                </div>
                <button className="text-slate-300 hover:text-rose-500 transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-xs font-bold text-slate-500">
                  <Phone className="w-3.5 h-3.5 mr-2 text-rose-500/50" />
                  {volunteer.phone}
                </div>
                {volunteer.email && (
                  <div className="flex items-center text-xs font-bold text-slate-500">
                    <Mail className="w-3.5 h-3.5 mr-2 text-rose-500/50" />
                    <span className="truncate">{volunteer.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-neutral-800">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-[0.15em]
                  ${volunteer.is_blocked ? 'bg-red-50 text-red-600 dark:bg-red-950/30' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30'}
                `}
                >
                  {volunteer.is_blocked ? 'Restricted' : 'Operational'}
                </span>
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400" />
                  Profile Details
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}