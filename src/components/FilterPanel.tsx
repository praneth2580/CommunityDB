
import { X, Check, RotateCcw } from 'lucide-react'
import type { Page } from './FloatingNav'
interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
  currentPage: Page
  activeFilters: Record<string, string[]>
  onApplyFilter: (category: string, value: string) => void
  onClearFilters: () => void
}
export function FilterPanel({
  isOpen,
  onClose,
  currentPage,
  activeFilters,
  onApplyFilter,
  onClearFilters,
}: FilterPanelProps) {
  // Define filters based on page context
  const getFiltersForPage = (page: Page) => {
    switch (page) {
      case 'dashboard':
      case 'people':
        return [
          {
            category: 'Blood Type',
            options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          },
          {
            category: 'Status',
            options: ['Active', 'Inactive', 'Urgent', 'Reserved'],
          },
          {
            category: 'Location',
            options: [
              'Main Center',
              'Mobile Unit A',
              'Mobile Unit B',
              'Downtown Clinic',
            ],
          },
        ]
      case 'volunteers':
        return [
          {
            category: 'Role',
            options: ['Coordinator', 'Driver', 'Nurse', 'General'],
          },
          {
            category: 'Availability',
            options: ['Available Now', 'This Week', 'Weekends Only'],
          },
          {
            category: 'Status',
            options: ['Active', 'On Leave', 'Inactive'],
          },
        ]
      case 'analytics':
        return [
          {
            category: 'Time Range',
            options: [
              'Last 24h',
              'Last 7 Days',
              'Last 30 Days',
              'Year to Date',
            ],
          },
          {
            category: 'Metric Type',
            options: ['Donations', 'Inventory', 'Volunteers', 'Shortages'],
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
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Filters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Refine {currentPage} view
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
                <div key={group.category} className="space-y-3">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {group.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {group.options.map((option) => {
                      const isActive =
                        activeFilters[group.category]?.includes(option)
                      return (
                        <button
                          key={option}
                          onClick={() => onApplyFilter(group.category, option)}
                          className={`
                          px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                          ${isActive ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-black dark:border-white' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 dark:bg-neutral-900 dark:text-slate-400 dark:border-neutral-800 dark:hover:border-neutral-700'}
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
              <div className="text-center py-12 text-slate-500">
                No filters available for this page.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/50">
            <div className="flex gap-3">
              <button
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                className="flex-1 px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-lg hover:bg-slate-50 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={onClose}
                className="flex-[2] px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-white bg-slate-900 dark:bg-white dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-200/50 dark:shadow-black/50"
              >
                <Check className="w-4 h-4" />
                Show Results
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}