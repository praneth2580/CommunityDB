import { Outlet } from "react-router-dom";
import { FloatingNav } from "../components/FloatingNav";
import { SearchOverlay } from "../components/SearchOverlay";
import { PersonForm } from "../components/PersonForm";
import type { Page } from '../components/FloatingNav'
import { useEffect, useState } from "react";
import { FilterPanel } from "../components/FilterPanel";
import { useAppDispatch, useAppSelector } from "../store";
import { fetchPeople, setOpenEditModal } from "../store/slices/peopleSlice";
import { fetchEvents, setOpenEditModal as setOpenEventEditModal } from "../store/slices/eventsSlice";
import { EventForm } from "../components/EventForm";

export default function AdminLayout() {
    // App View State
    const [currentPage] = useState<Page>('dashboard')
    const dispatch = useAppDispatch()

    // Overlay States
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    // People Modal States
    const [isAddPersonOpen, setIsAddPersonOpen] = useState(false)
    const isEditPersonOpen = useAppSelector(state => state.people.openEditModal)
    const editingPerson = useAppSelector(state => state.people.editingPerson)

    // Event Modal States
    const [isAddEventOpen, setIsAddEventOpen] = useState(false)
    const isEditEventOpen = useAppSelector(state => state.events.openEditModal)
    const editingEvent = useAppSelector(state => state.events.editingEvent)

    // Filter State (from Redux)
    const activeFilters = useAppSelector(state => state.filters.activeFilters)

    // Keyboard shortcuts for global actions
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsSearchOpen((prev) => !prev)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

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

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 md:pb-24">
            {/* Background Branding Watermark */}
            <div className="fixed top-6 right-6 opacity-5 pointer-events-none z-0">
                <h1 className="text-6xl font-black tracking-tighter">CommunityDB</h1>
            </div>

            <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 flex transition-all duration-300">
                {/* Main Application Interface */}
                <main className="flex-1 flex flex-col relative min-h-screen overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                        <Outlet />
                    </div>
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
                />

                <PersonForm
                    isOpen={isAddPersonOpen || isEditPersonOpen}
                    onClose={() => {
                        setIsAddPersonOpen(false)
                        dispatch(setOpenEditModal(false))
                    }}
                    editData={editingPerson}
                    onSuccess={() => dispatch(fetchPeople({ force: true }))}
                />

                <EventForm
                    isOpen={isAddEventOpen || isEditEventOpen}
                    onClose={() => {
                        setIsAddEventOpen(false)
                        dispatch(setOpenEventEditModal(false))
                    }}
                    editData={editingEvent}
                    onSuccess={() => dispatch(fetchEvents({ force: true }))}
                />
            </div>
        </div>
    )
}
