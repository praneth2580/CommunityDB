import { Search, RotateCcw, Filter } from 'lucide-react'
import type { EventFilters as FilterType } from '../models/eventsModel'

interface EventFiltersProps {
    filters: FilterType
    onFilterChange: (filters: FilterType) => void
    onClear: () => void
}

export function EventFilters({ filters, onFilterChange, onClear }: EventFiltersProps) {
    const eventTypes = [
        { value: 'donation_drive', label: 'Donation Drive' },
        { value: 'cleanup', label: 'Cleanup' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'other', label: 'Other' }
    ]

    const statuses = [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ]

    const dateRanges = [
        { value: 'upcoming', label: 'Upcoming' },
        { value: 'past', label: 'Past' },
        { value: 'all', label: 'All' }
    ]

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 p-4 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search events by title..."
                        value={filters.search || ''}
                        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-neutral-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 transition-all outline-none"
                    />
                </div>

                {/* Range Select */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {dateRanges.map((range) => (
                        <button
                            key={range.value}
                            onClick={() => onFilterChange({ ...filters, dateRange: range.value as any })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${filters.dateRange === range.value
                                    ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-200 dark:bg-neutral-800 dark:text-slate-400 dark:hover:bg-neutral-700'
                                }`}
                        >
                            {range.label}
                        </button>
                    ))}
                    <div className="w-px h-4 bg-slate-200 dark:bg-neutral-800 mx-1" />
                    <button
                        onClick={onClear}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Clear Filters"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
                    <Filter className="w-3.5 h-3.5" />
                    Quick Filters:
                </div>

                {/* Type Select */}
                <select
                    value={filters.type || ''}
                    onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs border-none focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer"
                >
                    <option value="">All Types</option>
                    {eventTypes.map((type) => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>

                {/* Status Select */}
                <select
                    value={filters.status || ''}
                    onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
                    className="px-3 py-1.5 bg-slate-50 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs border-none focus:ring-2 focus:ring-rose-500/20 outline-none cursor-pointer"
                >
                    <option value="">All Statuses</option>
                    {statuses.map((status) => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}
