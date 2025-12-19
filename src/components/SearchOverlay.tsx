import { useEffect, useState, useRef } from 'react'
import {
  Search,
  X,

  User,
  HeartHandshake,
  Package,
  Clock,
  ChevronRight,
} from 'lucide-react'
interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}
export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeResult, setActiveResult] = useState(0)
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
  // Mock results
  const results = [
    {
      type: 'Donor',
      title: 'Sarah Jenkins',
      subtitle: 'O+ • Last donation 2m ago',
      icon: User,
    },
    {
      type: 'Inventory',
      title: 'A- Blood Units',
      subtitle: '5 units expiring soon',
      icon: Package,
    },
    {
      type: 'Volunteer',
      title: 'Michael Chen',
      subtitle: 'Driver • Available now',
      icon: HeartHandshake,
    },
    {
      type: 'History',
      title: 'Recent Activity Report',
      subtitle: 'Generated yesterday',
      icon: Clock,
    },
  ]
  const filteredResults = query
    ? results.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
    : results
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
            placeholder="Search donors, inventory, volunteers..."
            className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-lg text-slate-900 dark:text-white placeholder:text-slate-400"
          />
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
        <div className="overflow-y-auto p-2">
          {filteredResults.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {query ? 'Top Results' : 'Recent'}
              </div>
              {filteredResults.map((result, index) => (
                <button
                  key={index}
                  className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl text-left transition-colors group
                    ${index === activeResult ? 'bg-slate-50 dark:bg-neutral-800' : 'hover:bg-slate-50 dark:hover:bg-neutral-800'}
                  `}
                  onMouseEnter={() => setActiveResult(index)}
                >
                  <div
                    className={`p-2.5 rounded-full ${index === activeResult ? 'bg-white dark:bg-neutral-700 shadow-sm' : 'bg-slate-100 dark:bg-neutral-800'}`}
                  >
                    <result.icon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      {result.title}
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-500">
                        {result.type}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {result.subtitle}
                    </p>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-slate-400 transition-transform ${index === activeResult ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`}
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                No results found for "{query}"
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