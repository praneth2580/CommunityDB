import { useEffect, useState, useRef } from 'react'
import {
  Search,
  X,
  User,
  Calendar,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { peopleModel, type PersonData } from '../models/peopleModel'
import { eventsModel, type EventData } from '../models/eventsModel'
interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<PersonData[]>([])
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeResult, setActiveResult] = useState(0)

  // Fetch results when query changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (!query.trim()) {
        setPeople([])
        setEvents([])
        return
      }

      setLoading(true)
      try {
        const [peopleResults, eventsResults] = await Promise.all([
          peopleModel.searchPeople(query),
          eventsModel.getAllEvents({ search: query })
        ])
        setPeople(peopleResults)
        setEvents(eventsResults)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setLoading(false)
      }
    }, 300) // Debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (!isOpen) {
          // This would be handled by parent usually, but good for local toggle if needed
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
  if (!isOpen) return null

  const results = [
    ...(people.map(p => ({
      type: p.admins ? (p.admins.role === 'super_admin' ? 'Super Admin' : p.admins.role === 'admin' ? 'Admin' : 'Volunteer') : 'Person',
      title: p.full_name,
      subtitle: `${p.phone || ''} • ${p.blood_group || ''}`,
      icon: User,
      link: `/admin/people/${p.id}`
    }))),
    ...(events.map(e => ({
      type: 'Event',
      title: e.title,
      subtitle: `${new Date(e.start_time).toLocaleDateString()} • ${e.location_name || ''}`,
      icon: Calendar,
      link: `/admin/events/${e.id}`
    })))
  ]

  const filteredResults = results

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in slide-in-from-bottom-8 duration-300 ease-out border border-slate-200 dark:border-neutral-800">
        {/* Search Header */}
        <div className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-neutral-800">
          <Search className="w-5 h-5 text-slate-400 ml-2" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search community registry & events..."
            className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
          />
          {loading && <Loader2 className="w-4 h-4 text-rose-500 animate-spin mr-2" />}
          <div className="hidden sm:flex items-center gap-2 mr-2">
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 px-2 font-mono text-[10px] font-medium text-slate-500 dark:text-slate-400">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-2 min-h-[200px]">
          {filteredResults.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                {query ? 'Intelligent Search Results' : 'Recent Directory Entries'}
              </div>
              {filteredResults.map((result, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-colors group
                    ${index === activeResult ? 'bg-slate-50 dark:bg-neutral-800' : 'hover:bg-slate-50 dark:hover:bg-neutral-800'}
                  `}
                  onMouseEnter={() => setActiveResult(index)}
                  onClick={() => {
                    navigate(result.link)
                    onClose()
                  }}
                >
                  <div
                    className={`p-2.5 rounded-xl transition-all ${index === activeResult ? 'bg-rose-500 text-white shadow-lg rotate-3' : 'bg-slate-100 dark:bg-neutral-800 text-slate-400'}`}
                  >
                    <result.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                      {result.title}
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${result.type === 'Event' ? 'bg-blue-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {result.type}
                      </span>
                    </h4>
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 uppercase tracking-tight">
                      {result.subtitle}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-rose-500 transition-transform ${index === activeResult ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-slate-50 dark:bg-neutral-800 rounded-2xl flex items-center justify-center">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {query ? `Zero matches for "${query}"` : "Global Registry Search"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-neutral-900/50 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex gap-4">
            <span>
              <strong className="font-medium text-slate-700 dark:text-slate-300">
                Enter
              </strong>{' '}
              to select
            </span>
            <span>
              <strong className="font-medium text-slate-700 dark:text-slate-300">
                ↑↓
              </strong>{' '}
              to navigate
            </span>
            <span>
              <strong className="font-medium text-slate-700 dark:text-slate-300">
                Esc
              </strong>{' '}
              to close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}