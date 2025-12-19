
import {
  Phone,
  Mail,
  Star,
  MoreHorizontal,
} from 'lucide-react'
const volunteers = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Coordinator',
    status: 'Active',
    hours: 124,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Driver',
    status: 'On Leave',
    hours: 45,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Jessica Dubrow',
    role: 'Nurse',
    status: 'Active',
    hours: 89,
    rating: 5.0,
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'General',
    status: 'Inactive',
    hours: 12,
    rating: 4.2,
  },
  {
    id: 5,
    name: 'Emily Ross',
    role: 'Coordinator',
    status: 'Active',
    hours: 230,
    rating: 4.9,
  },
]
export function Volunteers() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Volunteers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Active volunteer roster and schedules.
          </p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-slate-200 dark:bg-neutral-800 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold"
            >
              {String.fromCharCode(64 + i)}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-900 border-2 border-white dark:border-black flex items-center justify-center text-[10px] text-slate-500">
            +42
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {volunteers.map((volunteer) => (
          <div
            key={volunteer.id}
            className="group p-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-lg hover:border-slate-300 dark:hover:border-neutral-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300">
                  {volunteer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                    {volunteer.name}
                  </h3>
                  <p className="text-xs text-slate-500">{volunteer.role}</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center text-xs text-slate-500">
                <Phone className="w-3 h-3 mr-1.5" />
                +1 (555) 000-0000
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <Mail className="w-3 h-3 mr-1.5" />
                email@example.com
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-neutral-800">
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium
                ${volunteer.status === 'Active' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' : volunteer.status === 'Inactive' ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'}
              `}
              >
                {volunteer.status}
              </span>
              <div className="flex items-center text-xs font-medium text-slate-700 dark:text-slate-300">
                <Star className="w-3 h-3 text-amber-400 mr-1 fill-amber-400" />
                {volunteer.rating}
                <span className="mx-1.5 text-slate-300">|</span>
                {volunteer.hours} hrs
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}