import { X, Check, RotateCcw } from 'lucide-react'
import type { Page } from './FloatingNav'
import { useAppDispatch, useAppSelector } from '../store'
import { setFilter, clearFilters } from '../store/slices/filterSlice'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  currentPage: Page
}

export function FilterPanel({
  isOpen,
  onClose,
  currentPage,
}: FilterPanelProps) {
  const dispatch = useAppDispatch()
  const activeFilters = useAppSelector(state => state.filters.activeFilters)

  // Define filters based on page context - matching technical database fields
  const getFiltersForPage = (page: Page) => {
    switch (page) {
      case 'people':
      case 'volunteers':
        return [
          {
            category: 'blood_group',
            label: 'Blood Type',
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          },
          {
            category: 'is_blood_donor',
            label: 'Donor Status',
            options: ['Donor', 'Not Donor'],
          },
          {
            category: 'is_volunteer',
            label: 'Volunteer',
            options: ['Volunteer', 'Non-Volunteer']
          }
        ]
      case 'events':
        return [
          {
            category: 'status',
            label: 'Event Status',
            options: ['Draft', 'Active', 'Completed', 'Cancelled'],
          },
          {
            category: 'type',
            label: 'Event Type',
            options: ['Donation Drive', 'Cleanup', 'Emergency', 'Workshop', 'Other'],
          },
        ]
      default:
        return []
    }
  }

  const filters = getFiltersForPage(currentPage)
  const hasActiveFilters = Object.values(activeFilters).some(
    (arr) => arr.length > 0,
  )

  const handleApplyFilter = (category: string, value: string) => {
    dispatch(setFilter({ category, value }))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm z-[90] animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
        fixed inset-y-0 right-0 z-[95] w-full max-w-sm bg-white dark:bg-neutral-900 shadow-2xl border-l border-slate-200 dark:border-neutral-800 transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Smart Filters
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                Optimizing {currentPage} view
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {filters.length > 0 ? (
              filters.map((group) => (
                <div key={group.category} className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isActive =
                        activeFilters[group.category]?.includes(option)
                      return (
                        <button
                          key={option}
                          onClick={() => handleApplyFilter(group.category, option)}
                          className={`
                          px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border transition-all
                          ${isActive
                              ? 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-neutral-900 dark:text-slate-400 dark:border-neutral-800 dark:hover:border-neutral-700'}
                        `}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 space-y-3">
                <div className="mx-auto w-12 h-12 bg-slate-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  No filter context for this module
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50">
            <div className="flex gap-4">
              <button
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 px-4 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:grayscale transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-[1.5] px-4 py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
              >
                <Check className="w-3.5 h-3.5" />
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}