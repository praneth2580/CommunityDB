import { useEffect } from 'react'
import { Calendar, Plus, AlertCircle } from 'lucide-react'
import { EventCard } from '../../components/EventCard'
import { EventFilters } from '../../components/EventFilters'
import { useAppSelector, useAppDispatch } from '../../store'
import { fetchEvents, setFilters, clearFilters, setEditingEvent, setOpenEditModal } from '../../store/slices/eventsSlice'

export function EventsPage() {
    const dispatch = useAppDispatch()
    const { events, loading, error, filters } = useAppSelector(state => state.events)

    // Check for ID in URL on load (for legacy share compatibility)
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.split('?')[1])
        const id = params.get('id')
        if (id) {
            window.open(`#/admin/events/${id}`, '_blank')
        }
    }, [])

    const activeFilters = useAppSelector(state => state.filters.activeFilters)

    useEffect(() => {
        dispatch(fetchEvents())
    }, [dispatch, filters, activeFilters])

    const handleClearFilters = () => {
        dispatch(clearFilters())
    }

    const handleAddEvent = () => {
        dispatch(setEditingEvent(null))
        dispatch(setOpenEditModal(true))
    }

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-slate-200 dark:border-neutral-800">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-rose-500" />
                        Events
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Organize and track community activities and meetings.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:block text-[10px] font-mono text-slate-400">
                        {loading ? 'Refreshing...' : `${events.length} Events Found`}
                    </div>
                    <button
                        onClick={handleAddEvent}
                        className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-semibold hover:shadow-lg transition-all active:scale-95"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        New Event
                    </button>
                </div>
            </div>

            {/* Filters */}
            <EventFilters
                filters={filters}
                onFilterChange={(newFilters) => dispatch(setFilters(newFilters))}
                onClear={handleClearFilters}
            />

            {/* Main Content */}
            {error ? (
                <div className="p-6 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/30 flex flex-col items-center text-center">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                    <p className="font-bold text-sm">Error</p>
                    <p className="text-xs opacity-80">{error}</p>
                    <button
                        onClick={() => dispatch(fetchEvents({ force: true }))}
                        className="mt-3 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-lg text-[10px] font-bold shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            ) : loading && events.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 rounded-2xl bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 animate-pulse" />
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center mb-3">
                        <Calendar className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-md font-bold text-slate-900 dark:text-white">No events found</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs max-w-xs mt-1">
                        Try adjusting your filters or create a new event.
                    </p>
                    <button
                        onClick={handleClearFilters}
                        className="mt-4 text-xs font-bold text-rose-500 hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            onClick={(id) => window.open(`#/admin/events/${id}`, '_blank')}
                            onEdit={(e) => {
                                dispatch(setEditingEvent(e))
                                dispatch(setOpenEditModal(true))
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
