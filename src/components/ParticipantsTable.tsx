import { DataTable } from './DataTable'
import type { EventParticipant } from '../models/eventsModel'
import { User, Phone, Mail, CheckCircle2, XCircle } from 'lucide-react'

interface ParticipantsTableProps {
    participants: EventParticipant[]
    loading?: boolean
    eventStatus?: string
    onStatusUpdate?: (personId: string, status: 'attended' | 'noshow' | 'registered' | 'confirmed') => void
}

export function ParticipantsTable({ participants, loading, eventStatus, onStatusUpdate }: ParticipantsTableProps) {
    const isActionable = eventStatus === 'active' || eventStatus === 'completed'

    const columns = [
        {
            key: 'name',
            header: 'Participant',
            render: (row: EventParticipant) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-700">
                        {row.person?.full_name?.charAt(0) || <User className="w-4 h-4" />}
                    </div>
                    <div>
                        <div className="font-medium text-slate-900 dark:text-white">
                            {row.person?.full_name || 'Unknown'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                            {row.person?.email || 'No email'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            key: 'role',
            header: 'Role',
            render: (row: EventParticipant) => (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.role === 'organizer'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                    : row.role === 'volunteer'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                    {row.role}
                </span>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: EventParticipant) => (
                <span className={`text-[10px] font-medium ${row.status === 'attended' || row.status === 'confirmed'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : row.status === 'noshow'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-500'
                    }`}>
                    {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
            )
        },
        {
            key: 'attendance',
            header: 'Record Attendance',
            hidden: !isActionable,
            render: (row: EventParticipant) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onStatusUpdate?.(row.person_id, 'attended')}
                        disabled={row.status === 'attended'}
                        className={`p-1.5 rounded-lg transition-all ${row.status === 'attended'
                            ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                            }`}
                        title="Mark Attended"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onStatusUpdate?.(row.person_id, 'noshow')}
                        disabled={row.status === 'noshow'}
                        className={`p-1.5 rounded-lg transition-all ${row.status === 'noshow'
                            ? 'text-rose-500 bg-rose-50 dark:bg-rose-900/20'
                            : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                            }`}
                        title="Mark No-show"
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                </div>
            )
        },
        {
            key: 'contact',
            header: 'Contact',
            render: (row: EventParticipant) => (
                <div className="flex items-center gap-2">
                    {row.person?.phone && (
                        <a href={`tel:${row.person.phone}`} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                            <Phone className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {row.person?.email && (
                        <a href={`mailto:${row.person.email}`} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors">
                            <Mail className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
            )
        }
    ]

    return (
        <div className="space-y-2 mt-2 px-2 py-1">
            <div className="flex px-1 items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                    Expected Participants
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                    {participants.length} Total <span className="hidden @md:inline">Registered</span>
                </span>
            </div>

            <DataTable
                data={participants.map(p => ({ ...p, id: `${p.event_id}-${p.person_id}` })) as any}
                columns={columns.filter(c => !c.hidden) as any}
                loading={loading}
            />
        </div>
    )
}

