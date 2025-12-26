import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store'
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Calendar,
  BarChart3,
  UserCircle,
  Settings,
  Plus,
  Search,
  Filter,
  X,
  MoreHorizontal,
  ChevronUp,
  FileSpreadsheet
} from 'lucide-react'

export type Page =
  | 'dashboard'
  | 'people'
  | 'volunteers'
  | 'events'
  | 'analytics'
  | 'profile'
  | 'settings'
  | 'bulk'

interface FloatingNavProps {
  onAction?: (action: string) => void
  activeFilterCount?: number
}

const routeMap: Record<Page, string> = {
  dashboard: '/admin',
  people: '/admin/people',
  volunteers: '/admin/volunteers',
  events: '/admin/events',
  analytics: '/admin/analytics',
  profile: '/admin/profile',
  settings: '/admin/settings',
  bulk: '/admin/bulk',
}

export function FloatingNav({
  onAction,
  activeFilterCount = 0,
}: FloatingNavProps) {
  const [showMore, setShowMore] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = useAppSelector(state => state.auth.role)

  const currentPage = (Object.keys(routeMap) as Page[]).find(
    (key) => routeMap[key] === location.pathname
  )

  const primaryItems: { id: Page; icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
    { id: 'people', icon: Users, label: 'People' },
    { id: 'events', icon: Calendar, label: 'Events' },
  ]

  const secondaryItems: { id: Page; icon: React.ElementType; label: string }[] = [
    { id: 'volunteers', icon: HeartHandshake, label: 'Volunteers' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'profile', icon: UserCircle, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    ...(userRole === 'super_admin' ? [{ id: 'bulk' as Page, icon: FileSpreadsheet, label: 'Bulk' }] : [])
  ]

  // Close menus on navigation
  useEffect(() => {
    setShowMore(false)
    setShowActions(false)
  }, [location.pathname])

  return (
    <>
      {/* 🌑 Overlay for Mobile Menus */}
      {(showMore || showActions) && (
        <div
          className="fixed inset-0 bg-slate-950/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => { setShowMore(false); setShowActions(false); }}
        />
      )}

      <div className="fixed bottom-4 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-max z-50 flex flex-col items-center px-4 md:px-0 pointer-events-none">

        {/* ⚡ Action Pop-over (Mobile & Desktop) */}
        <div
          className={`
            transition-all duration-300 mb-3 pointer-events-auto
            ${showActions ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}
          `}
        >
          <div className="flex items-center gap-1 p-1.5 bg-slate-900/90 dark:bg-neutral-800/90 backdrop-blur-2xl rounded-[1rem] shadow-2xl border border-white/10">
            <ActionButton icon={Search} label="Search" onClick={() => { onAction?.('search'); setShowActions(false); }} />
            <ActionButton icon={Filter} label="Filter" onClick={() => { onAction?.('filter'); setShowActions(false); }}>
              {activeFilterCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
              )}
            </ActionButton>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <ActionButton
              icon={Plus}
              label="Add"
              onClick={() => { onAction?.('add'); setShowActions(false); }}
              highlight
            />
          </div>
        </div>

        {/* 📱 Mobile "More" Menu Panel */}
        <div
          className={`
            md:hidden absolute bottom-24 left-4 right-4 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-neutral-800 p-2 transition-all duration-300 pointer-events-auto
            ${showMore ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
          `}
        >
          <div className="grid grid-cols-2 gap-2">
            {secondaryItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(routeMap[item.id])}
                className="flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors text-slate-600 dark:text-slate-400 font-semibold"
              >
                <div className="p-2.5 bg-slate-100 dark:bg-neutral-800 rounded-xl">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 🧭 Main Navigation Bar */}
        <nav className="w-full md:w-auto flex items-center p-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl border border-slate-200/50 dark:border-neutral-800/50 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] pointer-events-auto transition-all">

          <div className="flex items-center w-full md:w-auto justify-between md:justify-start">
            {/* Primary Nav Items */}
            <div className="flex items-center justify-around w-full md:w-auto md:gap-1">
              {primaryItems.map((item) => {
                const isActive = currentPage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(routeMap[item.id])}
                    className={`
                        group relative flex flex-col md:flex-row items-center gap-1 px-3 md:px-5 py-2 rounded-2xl md:rounded-full transition-all duration-300
                        ${isActive
                        ? 'text-rose-500 md:bg-rose-500 md:text-white shadow-rose-500/10 shadow-lg'
                        : 'text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}
                    `}
                  >
                    <item.icon className="w-6 h-6 md:w-4 md:h-4" />
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-tight md:normal-case md:font-medium md:tracking-normal">
                      {item.label}
                    </span>
                  </button>
                )
              })}

              {/* Desktop only secondary items */}
              {secondaryItems.map((item) => {
                const isActive = currentPage === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(routeMap[item.id])}
                    className={`
                        hidden md:flex flex-row items-center gap-2 px-5 py-2 rounded-full transition-all duration-300
                        ${isActive
                        ? 'bg-rose-500 text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}
                    `}
                  >
                    <item.icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile Actions Toggle */}
            <div className="flex items-center md:hidden pr-1">
              <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-1" />

              <button
                onClick={() => { setShowActions(!showActions); setShowMore(false); }}
                className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                    ${showActions ? 'text-rose-500' : 'text-slate-400'}
                `}
              >
                <div className={`p-1.5 rounded-full transition-all duration-500 ${showActions ? 'bg-rose-500 text-white rotate-45 scale-110' : 'bg-slate-100 dark:bg-neutral-800'}`}>
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-tight">Add</span>
              </button>

              <button
                onClick={() => { setShowMore(!showMore); setShowActions(false); }}
                className={`
                    flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all
                    ${showMore ? 'text-rose-500' : 'text-slate-400'}
                `}
              >
                <MoreHorizontal className={`w-6 h-6 transition-transform ${showMore ? 'rotate-90' : ''}`} />
                <span className="text-[9px] font-bold uppercase tracking-tight">More</span>
              </button>
            </div>
          </div>


          {/* Desktop Contextual Toggle */}
          <div className="hidden md:flex items-center">
            <div className="w-px h-6 bg-slate-200 dark:bg-neutral-800 mx-2" />
            <button
              onClick={() => setShowActions(!showActions)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 font-bold text-[10px] uppercase tracking-wider
                ${showActions
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg shadow-black/10'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-neutral-800'}
              `}
            >
              {showActions ? <X className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              <span>Actions</span>
            </button>
          </div>
        </nav>

      </div>
    </>
  )
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  highlight,
  children,
}: {
  icon: React.ElementType
  label: string
  onClick?: () => void
  highlight?: boolean
  children?: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`
        group relative flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-300
        ${highlight
          ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20'
          : 'text-white/70 hover:text-white hover:bg-white/10'}
      `}
    >
      <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 absolute -top-8 bg-slate-900 dark:bg-white text-white dark:text-black px-2 py-1 rounded pointer-events-none transition-all">
        {label}
      </span>
      {children}
    </button>
  )
}
