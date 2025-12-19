import React, { useState } from 'react'
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  BarChart3,
  UserCircle,
  Settings,
  Plus,
  Search,
  Filter,
  X,
} from 'lucide-react'
export type Page =
  | 'dashboard'
  | 'people'
  | 'volunteers'
  | 'analytics'
  | 'profile'
  | 'settings'
interface FloatingNavProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  onAction?: (action: string) => void
  activeFilterCount?: number
}
export function FloatingNav({
  currentPage,
  onNavigate,
  onAction,
  activeFilterCount = 0,
}: FloatingNavProps) {
  const [showActions, setShowActions] = useState(false)
  const navItems: {
    id: Page
    icon: React.ElementType
    label: string
  }[] = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      id: 'people',
      icon: Users,
      label: 'People',
    },
    {
      id: 'volunteers',
      icon: HeartHandshake,
      label: 'Volunteers',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      label: 'Analytics',
    },
    {
      id: 'profile',
      icon: UserCircle,
      label: 'Profile',
    },
    {
      id: 'settings',
      icon: Settings,
      label: 'Settings',
    },
  ]
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 w-full max-w-fit px-4">
      {/* Contextual Actions (Expandable) */}
      <div
        className={`
        flex items-center gap-2 transition-all duration-300 ease-out overflow-hidden
        ${showActions ? 'opacity-100 translate-y-0 h-auto mb-1' : 'opacity-0 translate-y-4 h-0 pointer-events-none'}
      `}
      >
        <div className="flex items-center p-1.5 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md border border-slate-800 dark:border-slate-200 rounded-full shadow-xl">
          <button
            onClick={() => onAction?.('search')}
            className="p-2.5 rounded-full text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors relative group"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Search (⌘K)
            </span>
          </button>
          <button
            onClick={() => onAction?.('filter')}
            className="p-2.5 rounded-full text-white dark:text-black hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors relative group"
            aria-label="Filter"
          >
            <div className="relative">
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-slate-900 dark:border-white"></span>
              )}
            </div>
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Filter
            </span>
          </button>
          <button
            onClick={() => onAction?.('add')}
            className="p-2.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors relative group"
            aria-label="Add New"
          >
            <Plus className="w-4 h-4" />
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Add New
            </span>
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex items-center p-1.5 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-full shadow-2xl shadow-slate-200/50 dark:shadow-black/50 overflow-x-auto max-w-full scrollbar-hide">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex items-center gap-2 px-3 py-2.5 rounded-full transition-all duration-300 group relative
              ${currentPage === item.id ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'}
            `}
            aria-label={item.label}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />

            {/* Label - Hidden on mobile, visible on desktop */}
            <span
              className={`
              hidden md:block text-xs font-medium whitespace-nowrap transition-all duration-300
              ${currentPage === item.id ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0 md:max-w-xs md:opacity-100'}
            `}
            >
              {item.label}
            </span>

            {/* Tooltip - Only on mobile now */}
            <span className="md:hidden absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium shadow-lg">
              {item.label}
            </span>
          </button>
        ))}

        {/* Separator */}
        <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-1.5 flex-shrink-0" />

        {/* Action Toggle */}
        <button
          onClick={() => setShowActions(!showActions)}
          className={`
            p-3 rounded-full transition-all duration-200 relative flex-shrink-0
            ${showActions ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'}
          `}
          aria-label="Actions"
        >
          {showActions ? (
            <X className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}

          {/* Badge for active filters if actions are collapsed */}
          {!showActions && activeFilterCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-black"></span>
          )}
        </button>
      </nav>
    </div>
  )
}