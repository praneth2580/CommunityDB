import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Heart, Shield, Activity, ArrowLeft, Loader2, ChevronRight, User, ExternalLink, MessageSquare, Edit2 } from 'lucide-react'
import { peopleModel, type PersonData } from '../../models/peopleModel'
import { PersonForm } from '../../components/PersonForm'
import { PromoteModal } from '../../components/PromoteModal'

export function PersonDetailsPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [person, setPerson] = useState<PersonData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isPromoteOpen, setIsPromoteOpen] = useState(false)

    const fetchPerson = async () => {
        if (!id) return
        setLoading(true)
        setError(null)
        try {
            const data = await peopleModel.getPersonById(id)
            if (data) {
                setPerson(data)
            } else {
                setError("Member not found in registry.")
            }
        } catch (err) {
            console.error("Failed to fetch person details", err)
            setError("Network error: Could not retrieve profile.")
        } finally {
            setLoading(false)
        }
    }

    const handlePromote = async () => {
        setIsPromoteOpen(true)
    }

    useEffect(() => {
        fetchPerson()
    }, [id])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500 mb-4" />
                <p className="text-slate-500 text-sm italic font-medium">Retrieving digital profile...</p>
            </div>
        )
    }

    if (error || !person) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white dark:bg-neutral-900 rounded-[2rem] border border-dashed border-slate-200 dark:border-neutral-800">
                <div className="w-20 h-20 bg-slate-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <User className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Record Unreachable</h3>
                <p className="text-slate-500 text-base max-w-xs font-medium">{error || 'This member profile is private or deleted.'}</p>
                <button
                    onClick={() => navigate('/admin/people')}
                    className="mt-8 px-10 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-tighter hover:shadow-xl transition-all active:scale-95 flex items-center gap-3"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Registry
                </button>
            </div>
        )
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out pb-32">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8 px-1">
                <Link to="/admin/people" className="hover:text-rose-500 transition-colors">Registry</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-slate-900 dark:text-white truncate max-w-[200px]">{person.full_name}</span>
            </nav>

            {/* Profile Hero Section */}
            <div className="relative mb-8">
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-neutral-800 overflow-hidden">
                    {/* Background Pattern/Gradient */}
                    <div className="h-32 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-slate-900/0" />
                        <div className="absolute top-8 right-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${person.is_blocked
                                ? 'bg-red-500 text-white'
                                : 'bg-emerald-500 text-white'
                                }`}>
                                {person.is_blocked ? 'RESTRICTED' : 'ACTIVE STATUS'}
                            </span>
                        </div>
                    </div>

                    <div className="px-8 pb-10">
                        {/* Identity Header */}
                        <div className="relative -mt-16 mb-8 flex flex-col md:flex-row items-end gap-6">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-tr from-rose-500 to-purple-600 rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative h-32 w-32 rounded-[2rem] bg-white dark:bg-neutral-800 border-4 border-white dark:border-neutral-900 flex items-center justify-center text-5xl font-black font-serif text-slate-900 dark:text-white shadow-2xl overflow-hidden">
                                    {person.full_name ? person.full_name.charAt(0).toUpperCase() : '?'}
                                </div>
                            </div>

                            <div className="flex-1 space-y-3 pb-2 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                    {person.full_name}
                                </h1>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                    <span className={`px-4 py-1 rounded-xl text-xs font-black uppercase tracking-widest border-2 ${person.is_volunteer
                                        ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20'
                                        : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800'
                                        }`}>
                                        {person.is_volunteer ? 'Verified Volunteer' : 'Community Member'}
                                    </span>
                                    {person.blood_group && (
                                        <span className="flex items-center gap-2 px-4 py-1 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-tighter">
                                            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                                            BP: {person.blood_group}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mb-2">
                                <button
                                    onClick={() => setIsEditOpen(true)}
                                    className="p-4 rounded-2xl bg-white dark:bg-neutral-800 text-slate-900 dark:text-white border border-slate-200 dark:border-neutral-700 hover:scale-105 transition-transform shadow-sm active:scale-95 flex items-center gap-2"
                                >
                                    <Edit2 className="w-5 h-5" />
                                    <span className="text-xs font-black uppercase tracking-tight hidden sm:inline">Edit Profile</span>
                                </button>
                                <button className="p-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform shadow-xl active:scale-95">
                                    <MessageSquare className="w-6 h-6" />
                                </button>
                                {person.admins?.role === null && (
                                    <button
                                        onClick={handlePromote}
                                        className="p-4 rounded-2xl bg-rose-500 text-white hover:scale-105 transition-transform shadow-lg active:scale-95 flex items-center gap-2 group"
                                        title="Promote to Admin/Volunteer"
                                    >
                                        <Shield className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                        <span className="text-xs font-black uppercase tracking-tight hidden sm:inline">Promote Access</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Quick Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-neutral-800/30 border border-slate-100 dark:border-neutral-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Activities</p>
                                <p className="text-2xl font-black text-slate-900 dark:text-white">{person.participation?.length || 0}</p>
                            </div>
                            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-neutral-800/30 border border-slate-100 dark:border-neutral-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Volunteering Hours</p>
                                <p className="text-2xl font-black text-rose-500">
                                    {person.participation?.reduce((acc, p) => {
                                        if (p.status === 'attended' && p.event.start_time && p.event.end_time) {
                                            const start = new Date(p.event.start_time).getTime()
                                            const end = new Date(p.event.end_time).getTime()
                                            return acc + (end - start) / (1000 * 60 * 60)
                                        }
                                        return acc
                                    }, 0).toFixed(1) || '0.0'} hrs
                                </p>
                            </div>
                            <div className="p-4 rounded-3xl bg-slate-50 dark:bg-neutral-800/30 border border-slate-100 dark:border-neutral-800">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Interaction</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white">
                                    {person.participation?.[0]?.event?.start_time ? new Date(person.participation[0].event.start_time).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No History'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Contact & Info */}
                <div className="lg:col-span-8 space-y-6">
                    <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1">Verified Contact Channels</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <a
                                href={`tel:${person.phone}`}
                                className="group flex items-center gap-5 p-6 rounded-3xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition-all hover:shadow-xl hover:-translate-y-1"
                            >
                                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Mobile Access</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white truncate">{person.phone}</p>
                                </div>
                            </a>

                            {person.email && (
                                <a
                                    href={`mailto:${person.email}`}
                                    className="group flex items-center gap-5 p-6 rounded-3xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">Email Terminal</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white truncate">{person.email}</p>
                                    </div>
                                </a>
                            )}

                            {(person.address_line || person.locality_area) && (
                                <a
                                    href={`https://maps.google.com/?q=${encodeURIComponent([person.address_line, person.locality_area].filter(Boolean).join(', '))}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group md:col-span-2 flex items-center gap-5 p-6 rounded-3xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:bg-white dark:hover:bg-neutral-800 transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800 shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Registered Address</p>
                                            <ExternalLink className="w-4 h-4 text-slate-300" />
                                        </div>
                                        <p className="text-xl font-black text-slate-900 dark:text-white">
                                            {[person.address_line, person.locality_area].filter(Boolean).join(', ')}
                                        </p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </section>

                    <section className="bg-white dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1 flex items-center gap-3">
                            <Activity className="w-5 h-5 text-rose-500" /> Interaction Log
                        </h3>
                        <div className="space-y-4">
                            {person.participation && person.participation.length > 0 ? (
                                person.participation.map((p, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 dark:bg-neutral-800/30 border border-slate-100 dark:border-neutral-800 group hover:bg-white transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center font-black text-rose-500 shadow-sm border border-slate-100 dark:border-neutral-800">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-slate-900 dark:text-white">{p.event.title}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">{p.status}</span>
                                                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(p.event.start_time).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                ))
                            ) : (
                                <div className="py-20 text-center bg-slate-50 dark:bg-neutral-800/20 rounded-3xl border border-dashed border-slate-200 dark:border-neutral-800">
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No entries found in registry log</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right: Volunteer Intelligence */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-white dark:bg-neutral-900 p-6 rounded-[2rem] border border-slate-100 dark:border-neutral-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1 flex items-center gap-3">
                            <Shield className="w-5 h-5 text-rose-500" /> Volunteer Profile
                        </h3>
                        {person.is_volunteer || person.admins?.role === 'volunteer' ? (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                                    <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl text-rose-600 shadow-sm">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Duty</h4>
                                        <p className="text-xs text-slate-500 font-medium">Clearance: {person.admins?.role ? person.admins.role.replace('_', ' ').toUpperCase() : 'VERIFIED'}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Specializations</p>
                                    {person.skills && person.skills.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {person.skills.map(skill => (
                                                <span key={skill} className="px-4 py-2 bg-slate-50 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-xs text-slate-400 italic px-1">General Operations</div>
                                    )}
                                </div>

                                {person.availability && (
                                    <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-neutral-800">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 text-emerald-600">Availability Log</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {Object.entries(person.availability).map(([day, time]) => (
                                                <div key={day} className="p-3 rounded-xl bg-slate-50 dark:bg-neutral-800/50 flex justify-between items-center text-[10px] font-black uppercase">
                                                    <span className="text-slate-400">{day}</span>
                                                    <span className="text-slate-700 dark:text-slate-300">{String(time)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="py-12 px-6 text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                    Member has not applied for volunteer certification yet.
                                </p>
                            </div>
                        )}
                    </section>

                    {person.last_donation_date && (
                        <section className="bg-gradient-to-br from-rose-500 to-rose-600 p-8 rounded-[2.5rem] shadow-xl text-white">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Philanthropy Record</h3>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-3xl font-black leading-none">Last Gift</p>
                                    <p className="text-sm font-bold opacity-80 mt-1">{new Date(person.last_donation_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                </div>
                                <Heart className="w-12 h-12 opacity-30" />
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <PersonForm
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                editData={person}
                onSuccess={fetchPerson}
            />
            <PromoteModal
                isOpen={isPromoteOpen}
                onClose={() => setIsPromoteOpen(false)}
                personId={person.id || null}
                personName={person.full_name}
                onSuccess={fetchPerson}
            />
        </div>
    )
}
