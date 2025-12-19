import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  onAction?: (action: string) => void
  activeFilterCount?: number
}

const routeMap: Record<Page, string> = {
  dashboard: '/admin',
  people: '/admin/people',
  volunteers: '/admin/volunteers',
  analytics: '/admin/analytics',
  profile: '/admin/profile',
  settings: '/admin/settings',
}

export function FloatingNav({
  onAction,
  activeFilterCount = 0,
}: FloatingNavProps) {
  const [showActions, setShowActions] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const currentPage = (Object.keys(routeMap) as Page[]).find(
    (key) => routeMap[key] === location.pathname
  )

  const navItems: {
    id: Page
    icon: React.ElementType
    label: string
  }[] = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'people', icon: Users, label: 'People' },
      { id: 'volunteers', icon: HeartHandshake, label: 'Volunteers' },
      { id: 'analytics', icon: BarChart3, label: 'Analytics' },
      { id: 'profile', icon: UserCircle, label: 'Profile' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 px-4">

      {/* 🔎 Contextual Actions */}
      <div
        className={`
          flex items-center gap-2 transition-all duration-300 overflow-hidden
          ${showActions ? 'opacity-100 translate-y-0 h-auto' : 'opacity-0 translate-y-4 h-0 pointer-events-none'}
        `}
      >
        <div className="flex items-center p-1.5 bg-slate-900/90 backdrop-blur-md rounded-full shadow-xl">
          <ActionButton icon={Search} onClick={() => onAction?.('search')} />
          <ActionButton icon={Filter} onClick={() => onAction?.('filter')}>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full" />
            )}
          </ActionButton>
          <ActionButton
            icon={Plus}
            onClick={() => onAction?.('add')}
            highlight
          />
        </div>
      </div>

      {/* 🧭 Main Nav */}
      <nav className="flex items-center p-1.5 bg-white/90 dark:bg-neutral-900/90  backdrop-blur-md border border-slate-200 dark:border-neutral-800 rounded-full shadow-2xl">
        {navItems.map((item) => {
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => navigate(routeMap[item.id])}
              className={`
                flex items-center gap-2 px-3 py-2.5 rounded-full transition-all
                ${isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'}
              `}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block text-xs font-medium">
                {item.label}
              </span>

              {/* Tooltip - Only on mobile now */}
              <span className="md:hidden absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-900 dark:bg-white text-white dark:text-black text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap font-medium shadow-lg">
                {item.label}
              </span>
            </button>
          )
        })}

        {/* Divider */}
        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* Action Toggle */}
        <button
          onClick={() => setShowActions(!showActions)}
          className={`
            p-3 rounded-full transition
            ${showActions
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-neutral-800'}
          `}
        >
          {showActions ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </button>
      </nav>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  onClick,
  highlight,
  children,
}: {
  icon: React.ElementType
  onClick?: () => void
  highlight?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative p-2.5 rounded-full transition
        ${highlight
          ? 'bg-rose-600 text-white hover:bg-rose-700'
          : 'text-white hover:bg-slate-800'}
      `}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  )
}
