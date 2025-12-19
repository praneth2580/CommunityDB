import { Outlet, useNavigation } from "react-router-dom";
import { FloatingNav } from "../components/FloatingNav";
import { SearchOverlay } from "../components/SearchOverlay";
import { AddPersonForm } from "../components/AddPersonForm";
import type { Page } from '../components/FloatingNav'
import { useEffect, useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { PersonDetailsCard } from "../components/PersonDetailsCard";

export default function AdminLayout() {
    // App View State
    const [view] = useState<'landing' | 'app'>('landing')
    const [currentPage] = useState<Page>('dashboard')
    const [isLoading, setIsLoading] = useState(true)
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)

    // Overlay States
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
    // Filter State
    const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>(
        {},
    )

    // Initial Session Check
    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                if (!session) {
                    // Redirect to login if no session
                    window.location.href = '/#/login' // Using hash router
                }
            } catch (error) {
                console.error("Session check failed", error)
            } finally {
                // Add a small artificial delay for smooth UX if it loads too fast
                setTimeout(() => setIsLoading(false), 800)
            }
        }
        checkSession()

        // Listen for auth changes (sign out, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                window.location.href = '/#/login'
            }
        })

        return () => subscription.unsubscribe()
    }, [])


    // Keyboard shortcuts for global actions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                if (view === 'app') setIsSearchOpen((prev) => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [view])


    const handleApplyFilter = (category: string, value: string) => {
        setActiveFilters((prev) => {
            const current = prev[category] || []
            const updated = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]
            return {
                ...prev,
                [category]: updated,
            }
        })
    }
    const handleClearFilters = () => {
        setActiveFilters({})
    }

    const handleAction = (action: string) => {
        switch (action) {
            case 'search':
                setIsSearchOpen(true)
                break
            case 'filter':
                setIsFilterOpen(true)
                break
            case 'add':
                setIsAddPersonOpen(true)
                break
            default:
                console.log('Unknown action:', action)
        }
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-500" />
                    <p className="text-sm font-medium text-slate-500 animate-pulse">Initializing CommunityDB...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-32">
            {/* Background Branding Watermark */}
            <div className="fixed top-6 right-6 opacity-5 pointer-events-none z-0">
                <h1 className="text-6xl font-black tracking-tighter">HB</h1>
            </div>

            <main className="max-w-5xl mx-auto px-4 py-8 relative z-10">
                <Outlet context={{ openPersonDetails: (id: string) => setSelectedPersonId(id) }} />
            </main>

            <FloatingNav
                onAction={handleAction}
                activeFilterCount={Object.values(activeFilters).reduce(
                    (acc, curr) => acc + curr.length,
                    0,
                )}
            />

            <SearchOverlay
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            <FilterPanel
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                currentPage={currentPage}
                activeFilters={activeFilters}
                onApplyFilter={handleApplyFilter}
                onClearFilters={handleClearFilters}
            />

            <AddPersonForm
                isOpen={isAddPersonOpen}
                onClose={() => setIsAddPersonOpen(false)}
            />

            <PersonDetailsCard
                personId={selectedPersonId}
                onClose={() => setSelectedPersonId(null)}
            />
        </div>
    );
}
