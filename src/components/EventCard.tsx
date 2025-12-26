import { Calendar, MapPin, Clock, ArrowRight } from 'lucide-react'
import type { EventData } from '../models/eventsModel'
import { ShareButton } from './ShareButton'

interface EventCardProps {
    event: EventData
    onClick: (id: string) => void
    onEdit: (event: EventData) => void
}

export function EventCard({ event, onClick, onEdit }: EventCardProps) {
    const startTime = new Date(event.start_time)
    const isUpcoming = startTime > new Date()

    const typeColors = {
        donation_drive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        cleanup: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        emergency: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        workshop: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }

    const typeLabel = (event.type || 'other').replace('_', ' ')

    const shareUrl = `${window.location.origin}${window.location.pathname}#/admin/events?id=${event.id}`
    const shareText = `Join us for "${event.title}" at ${event.location_name || 'TBD'} on ${startTime.toLocaleDateString()}!`

    return (
        <div className="group relative bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
            {/* Header / Type Badge */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeColors[event.type || 'other']}`}>
                        {typeLabel}
                    </span>
                    <ShareButton
                        title={event.title}
                        text={shareText}
                        url={shareUrl}
                    />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1">
                    {event.title}
                </h3>
            </div>

            {/* Content */}
            <div className="px-5 pb-5 flex-1 space-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
                    {event.description || 'No description provided.'}
                </p>

                <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{startTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{startTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    {event.location_name && (
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                            <span className="truncate">{event.location_name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Action */}
            <div className="px-2 py-2 border-t border-slate-50 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-800/30 mt-auto flex gap-2">
                <button
                    onClick={() => event.id && onEdit(event)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-neutral-800 rounded-lg transition-all"
                >
                    Modify
                </button>
                <button
                    onClick={() => event.id && onClick(event.id)}
                    className="flex-[1.5] flex items-center justify-center gap-2 py-2 text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg hover:shadow-lg transition-all active:scale-95"
                >
                    View Details
                    <ArrowRight className="w-3 h-3" />
                </button>
            </div>


            {/* Status Ribbon if not Upcoming */}
            {!isUpcoming && event.status !== 'active' && (
                <div className="absolute top-0 right-12">
                    {/* Optional Ribbon for Past Events */}
                </div>
            )}
        </div>
    )
}
