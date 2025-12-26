import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { eventsModel, type EventData, type EventParticipant } from '../../models/eventsModel'
import { peopleModel, type PersonData } from '../../models/peopleModel'
import { resourcesModel, type ResourceData } from '../../models/resourcesModel'
import { ShareButton } from '../../components/ShareButton'
import { ParticipantsTable } from '../../components/ParticipantsTable'
import { ResourcesTable } from '../../components/ResourcesTable'
import { DonationForm } from '../../components/DonationForm'
import {
    Calendar,
    MapPin,
    Clock,
    Info,
    Users,
    ExternalLink,
    Loader2,
    AlertCircle,
    ArrowLeft,
    ChevronRight,
    Search,
    Plus,
    X,
    Package
} from 'lucide-react'

export function EventDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [event, setEvent] = useState<EventData | null>(null)
    const [participants, setParticipants] = useState<EventParticipant[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Resource State
    const [resources, setResources] = useState<ResourceData[]>([])
    const [isDonationFormOpen, setIsDonationFormOpen] = useState(false)

    // Registration State
    const [isRegistering, setIsRegistering] = useState(false)
    const [allPeople, setAllPeople] = useState<PersonData[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isActionLoading, setIsActionLoading] = useState(false)

    const fetchDetails = async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const [eventData, participantData, resourceData, peopleData] = await Promise.all([
                eventsModel.getEventById(id),
                eventsModel.getEventParticipants(id),
                resourcesModel.getResourcesByEvent(id),
                peopleModel.getAllPeople()
            ])
            setEvent(eventData)
            setParticipants(participantData)
            setResources(resourceData)
            setAllPeople(peopleData)
        } catch (err: any) {
            console.error("Failed to fetch event details", err)
            setError("Could not load event details. It may have been deleted.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDetails()
    }, [id])

    const handleUpdateStatus = async (personId: string, status: string) => {
        if (!id) return
        setIsActionLoading(true)
        try {
            await eventsModel.updateParticipantStatus(id, personId, status)
            const updated = await eventsModel.getEventParticipants(id)
            setParticipants(updated)
        } catch (err) {
            console.error("Failed to update status", err)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleRegister = async (personId: string) => {
        if (!id) return
        // Check if already registered
        if (participants.some(p => p.person_id === personId)) {
            alert("Already registered for this event")
            return
        }

        setIsActionLoading(true)
        try {
            await eventsModel.registerForEvent(id, personId)
            const updated = await eventsModel.getEventParticipants(id)
            setParticipants(updated)
            setIsRegistering(false)
        } catch (err) {
            console.error("Failed to register participant", err)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleAddDonation = async (data: Omit<ResourceData, 'id' | 'collected_at' | 'donor'>) => {
        setIsActionLoading(true)
        try {
            await resourcesModel.addResource(data)
            if (id) {
                const updated = await resourcesModel.getResourcesByEvent(id)
                setResources(updated)
            }
            setIsDonationFormOpen(false)
        } catch (err) {
            console.error("Failed to add resource", err)
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleUpdateResourceStatus = async (resourceId: string, status: ResourceData['status']) => {
        setIsActionLoading(true)
        try {
            await resourcesModel.updateResourceStatus(resourceId, status)
            if (id) {
                const updated = await resourcesModel.getResourcesByEvent(id)
                setResources(updated)
            }
        } catch (err) {
            console.error("Failed to update resource status", err)
        } finally {
            setIsActionLoading(false)
        }
    }

    const filteredPeople = allPeople.filter(p =>
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery) ||
        p.email?.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)

    const startTime = event ? new Date(event.start_time) : null
    const endTime = event?.end_time ? new Date(event.end_time) : null
    const isPast = startTime ? startTime < new Date() : false

    const canRegister = event?.status === 'draft' || event?.status === 'active'

    const typeColors = {
        donation_drive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800',
        cleanup: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
        emergency: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800',
        workshop: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800',
        other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
    }

    const shareUrl = window.location.href
    const shareText = event ? `Join us for "${event.title}" on ${startTime?.toLocaleDateString()}!` : ''

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
                <p className="text-slate-500 text-sm italic font-medium">Loading event details...</p>
            </div>
        )
    }

    if (error || !event) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-slate-200 dark:border-neutral-800">
                <AlertCircle className="w-16 h-16 text-rose-500 mb-6 opacity-20" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Event Not Found</h3>
                <p className="text-slate-500 text-base max-w-xs">{error || 'This event may have been removed or does not exist.'}</p>
                <button
                    onClick={() => navigate('/admin/events')}
                    className="mt-8 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:shadow-xl transition-all active:scale-95 flex items-center gap-3"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Events
                </button>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out pb-32">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 px-1">
                <Link to="/admin/events" className="hover:text-rose-500 transition-colors">Events</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{event.title}</span>
            </nav>

            {/* Hero Header Section */}
            <div className="relative mb-8 group">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-purple-600 rounded-[2.5rem] blur opacity-15 dark:opacity-25 transition-opacity duration-1000 group-hover:opacity-30" />
                <div className="relative bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
                    <div className="h-40 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/30 to-slate-900/0" />
                        <div className="absolute top-8 right-8 flex gap-3 z-20">
                            <ShareButton
                                title={event.title}
                                text={shareText}
                                url={shareUrl}
                                className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md px-5"
                            />
                        </div>
                        <div className="absolute bottom-10 left-10">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${typeColors[event.type || 'other']}`}>
                                {event?.type?.replace('_', ' ') || 'Event'}
                            </span>
                        </div>
                    </div>

                    <div className="px-8 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                            <div className="space-y-4 max-w-2xl">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                    {event.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-6 text-sm font-bold">
                                    <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.6)] animate-pulse" />
                                        {event.status === 'active' ? 'LIVE NOW' : event.status?.toUpperCase()}
                                    </div>
                                    {isPast && (
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-neutral-800 text-slate-500 rounded-lg text-[10px] tracking-widest uppercase">
                                            Archived Event
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 min-w-[200px]">
                                <div className="p-4 bg-slate-50 dark:bg-neutral-800/30 rounded-2xl border border-slate-100 dark:border-neutral-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendance</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white">{participants.length} Registered</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Descriptions & Details */}
                <div className="lg:col-span-7 space-y-6">
                    <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm transition-all hover:shadow-md">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                            <Info className="w-5 h-5 text-rose-500" /> Executive Summary
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed font-medium">
                            {event.description || 'No detailed briefing available for this activity.'}
                        </p>
                    </section>

                    {/* Resource Management Section */}
                    <section className="bg-white dark:bg-neutral-900 rounded-[2.5rem] border border-slate-100 dark:border-neutral-800 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-neutral-800/50 flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <Package className="w-5 h-5 text-rose-500" /> Contributions & Logistics
                            </h3>
                            <button
                                onClick={() => setIsDonationFormOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                Record Donation
                            </button>
                        </div>
                        <div className="px-2 py-4">
                            <ResourcesTable
                                resources={resources}
                                loading={isActionLoading}
                                onStatusUpdate={handleUpdateResourceStatus}
                            />
                            {resources.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No contributions recorded yet</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Schedule Card */}
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm group hover:border-rose-200 dark:hover:border-rose-900/50 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-900/20 group-hover:scale-110 transition-transform">
                                    <Calendar className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Timeline</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white">
                                        {startTime?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                                    <div className="flex items-center gap-2 text-base font-bold text-slate-600 dark:text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {endTime && ` — ${endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Card */}
                        <div className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm group hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 rounded-2xl bg-blue-50 text-blue-500 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Deployment</h4>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Venue</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white truncate">
                                        {event.location_name || 'TBD'}
                                    </p>
                                </div>
                                {event.location_name && (
                                    <a
                                        href={`https://maps.google.com/?q=${encodeURIComponent(event.location_name)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-blue-100 transition-colors"
                                    >
                                        Navigation Link <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Deployment Roster (Full Height Table) */}
                <div className="lg:col-span-5">
                    <section className="bg-white dark:bg-neutral-900 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm overflow-hidden flex flex-col h-full min-h-[400px]">
                        <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                <Users className="w-5 h-5 text-rose-500" /> Deployment Roster
                            </h3>
                            <div className="flex items-center gap-3">
                                {canRegister && (
                                    <button
                                        onClick={() => setIsRegistering(true)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Register
                                    </button>
                                )}
                                <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors">
                                    Export
                                </button>
                            </div>
                        </div>

                        {/* Search & Register Overlay */}
                        {isRegistering && (
                            <div className="p-4 bg-slate-50 dark:bg-neutral-800/50 border-b border-slate-100 dark:border-neutral-800 animate-in slide-in-from-top duration-300">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            autoFocus
                                            type="text"
                                            placeholder="Search registry by name, phone, or email..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                        />
                                    </div>
                                    <button
                                        onClick={() => setIsRegistering(false)}
                                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {filteredPeople.map(person => (
                                        <button
                                            key={person.id}
                                            onClick={() => person.id && handleRegister(person.id)}
                                            disabled={isActionLoading || participants.some(p => p.person_id === person.id)}
                                            className="w-full flex items-center justify-between p-3 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-xl hover:border-rose-200 dark:hover:border-rose-900/50 transition-all text-left group disabled:opacity-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-slate-500">
                                                    {person.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{person.full_name}</p>
                                                    <p className="text-[10px] text-slate-400">{person.phone || person.email}</p>
                                                </div>
                                            </div>
                                            <Plus className="w-4 h-4 text-slate-300 group-hover:text-rose-500 transition-colors" />
                                        </button>
                                    ))}
                                    {searchQuery && filteredPeople.length === 0 && (
                                        <p className="text-center py-4 text-xs text-slate-400 italic">No matches found in registry.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 overflow-auto custom-scrollbar">
                            <ParticipantsTable
                                participants={participants}
                                loading={loading || isActionLoading}
                                eventStatus={event.status}
                                onStatusUpdate={handleUpdateStatus}
                            />
                        </div>
                    </section>
                </div>
            </div>
            <DonationForm
                isOpen={isDonationFormOpen}
                onClose={() => setIsDonationFormOpen(false)}
                onAdd={handleAddDonation}
                people={allPeople}
                eventId={id || ''}
            />
        </div>
    )
}
