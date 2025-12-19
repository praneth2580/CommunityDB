import { useState } from 'react'
import {
  Calendar,
  MapPin,
  Users,
} from 'lucide-react'

type ActivityType = 'donation' | 'awareness' | 'volunteer' | 'emergency'

interface Activity {
  id: number
  title: string
  type: ActivityType
  date: string
  location: string
  description: string
  participants: number
  status: 'upcoming' | 'ongoing' | 'completed'
}

/* -------- MOCK DATA (Replace with API later) -------- */

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    title: 'Blood Donation Camp',
    type: 'donation',
    date: '24 Mar 2025',
    location: 'Community Hall, Vijayawada',
    description:
      'Open blood donation camp organized with local hospitals.',
    participants: 120,
    status: 'upcoming',
  },
  {
    id: 2,
    title: 'Emergency O- Blood Request',
    type: 'emergency',
    date: 'Today',
    location: 'Govt Hospital, Guntur',
    description:
      'Urgent requirement for O- blood. Volunteers coordinating donors.',
    participants: 18,
    status: 'ongoing',
  },
  {
    id: 3,
    title: 'Volunteer Orientation Meet',
    type: 'volunteer',
    date: '18 Mar 2025',
    location: 'Online / Zoom',
    description:
      'Introduction session for new volunteers and coordinators.',
    participants: 45,
    status: 'completed',
  },
  {
    id: 4,
    title: 'Blood Donation Awareness Walk',
    type: 'awareness',
    date: '30 Mar 2025',
    location: 'MG Road, Tenali',
    description:
      'Community walk to spread awareness about regular blood donation.',
    participants: 200,
    status: 'upcoming',
  },
]

export default function ActivitiesPage() {
  const [filter, setFilter] = useState<ActivityType | 'all'>('all')

  const filteredActivities =
    filter === 'all'
      ? ACTIVITIES
      : ACTIVITIES.filter(a => a.type === filter)

  return (
    <div className="min-h-screen bg-[#FFF8F6] text-slate-800">

      {/* HEADER */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-6">
          Community Activities
        </h1>
        <p className="text-lg text-slate-600">
          Donation drives, emergencies, volunteer work, and awareness events
          happening across our community.
        </p>
      </section>

      {/* FILTER BAR */}
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          <FilterButton label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterButton label="Donation" active={filter === 'donation'} onClick={() => setFilter('donation')} />
          <FilterButton label="Emergency" active={filter === 'emergency'} onClick={() => setFilter('emergency')} />
          <FilterButton label="Volunteer" active={filter === 'volunteer'} onClick={() => setFilter('volunteer')} />
          <FilterButton label="Awareness" active={filter === 'awareness'} onClick={() => setFilter('awareness')} />
        </div>
      </div>

      {/* ACTIVITIES GRID */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {filteredActivities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </section>
    </div>
  )
}

/* ---------------- COMPONENTS ---------------- */

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-white rounded-3xl border overflow-hidden hover:shadow-xl transition">

      {/* IMAGE PLACEHOLDER */}
      <div className="h-44 bg-gradient-to-br from-rose-100 to-orange-100 flex items-center justify-center text-sm text-slate-500">
        Activity image coming soon
      </div>

      <div className="p-6">
        <StatusBadge status={activity.status} />

        <h3 className="text-xl font-bold mt-4 mb-2">
          {activity.title}
        </h3>

        <p className="text-slate-600 mb-4">
          {activity.description}
        </p>

        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {activity.date}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {activity.location}
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {activity.participants} people involved
          </div>
        </div>

        <button className="mt-6 w-full py-3 rounded-full bg-rose-500 text-white font-semibold hover:bg-rose-600">
          View Details
        </button>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Activity['status'] }) {
  const styles = {
    upcoming: 'bg-sky-100 text-sky-700',
    ongoing: 'bg-rose-100 text-rose-700',
    completed: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
    >
      {status.toUpperCase()}
    </span>
  )
}

function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded-full border font-medium transition
        ${active
          ? 'bg-rose-500 text-white border-rose-500'
          : 'bg-white hover:bg-rose-50'
        }`}
    >
      {label}
    </button>
  )
}
