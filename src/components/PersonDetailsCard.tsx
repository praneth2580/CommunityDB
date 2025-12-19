import { useEffect, useState } from 'react'
import { X, Phone, Mail, MapPin, Heart, Shield, Activity } from 'lucide-react'
import { peopleModel, type PersonData } from '../models/peopleModel'

interface PersonDetailsCardProps {
    personId: string | null
    onClose: () => void
}

export function PersonDetailsCard({ personId, onClose }: PersonDetailsCardProps) {
    const [person, setPerson] = useState<PersonData | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchPerson() {
            if (!personId) return
            setLoading(true)
            try {
                const data = await peopleModel.getPersonById(personId)
                setPerson(data)
            } catch (err) {
                console.error("Failed to fetch person details", err)
            } finally {
                setLoading(false)
            }
        }

        if (personId) {
            fetchPerson()
        } else {
            setPerson(null)
        }
    }, [personId])

    if (!personId) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Card */}
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl ring-1 ring-slate-900/5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-md z-50"
                    aria-label="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Single Scrollable Container */}
                <div className="overflow-y-auto custom-scrollbar flex-1">

                    {/* Header Image */}
                    <div className="h-32 bg-slate-900 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-slate-900/0" />
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8">
                        {/* Avatar & Identity - Overlaps Header */}
                        <div className="relative -mt-12 mb-8 flex flex-col sm:flex-row items-start sm:items-end gap-6 z-10">
                            <div className="h-24 w-24 rounded-2xl ring-4 ring-white dark:ring-neutral-900 bg-white dark:bg-neutral-800 flex items-center justify-center text-3xl font-bold font-serif text-slate-900 dark:text-white shadow-lg flex-shrink-0">
                                {person?.full_name ? person.full_name.charAt(0).toUpperCase() : '?'}
                            </div>
                            <div className="mb-1 flex-1 min-w-0"> {/* min-w-0 ensures truncation works */}
                                {loading ? (
                                    <div className="space-y-2 animate-pulse pt-12 sm:pt-0">
                                        <div className="h-8 w-48 bg-slate-200 dark:bg-neutral-800 rounded-lg" />
                                        <div className="h-4 w-24 bg-slate-100 dark:bg-neutral-800 rounded" />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
                                                {person?.full_name}
                                            </h2>
                                            {person && (
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${person.is_blocked
                                                    ? 'bg-red-100 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                                                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
                                                    }`}>
                                                    {person.is_blocked ? 'Blocked' : 'Active'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${person?.is_volunteer
                                                ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
                                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                                }`}>
                                                {person?.is_volunteer ? 'Volunteer' : 'Resident'}
                                            </span>
                                            {person?.blood_group && (
                                                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium dark:bg-neutral-800 dark:text-slate-400 dark:border-neutral-700">
                                                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                                    {person.blood_group}
                                                </span>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse mt-8">
                                <div className="h-24 bg-slate-50 dark:bg-neutral-800 rounded-xl" />
                                <div className="h-24 bg-slate-50 dark:bg-neutral-800 rounded-xl" />
                            </div>
                        ) : person && (
                            <div className="grid grid-cols-1 gap-8">
                                {/* Contact Section */}
                                <section>
                                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Contact Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <a
                                            href={`tel:${person.phone}`}
                                            className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-600 transition-colors group"
                                        >
                                            <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-sm border border-slate-100 dark:border-neutral-700 text-slate-500 group-hover:text-blue-500 transition-colors">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">Phone</p>
                                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{person.phone}</p>
                                            </div>
                                        </a>

                                        {person.email && (
                                            <a
                                                href={`mailto:${person.email}`}
                                                className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-600 transition-colors group"
                                            >
                                                <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-sm border border-slate-100 dark:border-neutral-700 text-slate-500 group-hover:text-blue-500 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Email</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{person.email}</p>
                                                </div>
                                            </a>
                                        )}

                                        {(person.address_line || person.locality_area) && (
                                            <a
                                                href={`https://maps.google.com/?q=${encodeURIComponent([person.address_line, person.locality_area].filter(Boolean).join(', '))}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="sm:col-span-2 flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800 hover:border-slate-300 dark:hover:border-neutral-600 transition-colors group"
                                            >
                                                <div className="p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-sm border border-slate-100 dark:border-neutral-700 text-slate-500 group-hover:text-blue-500 transition-colors">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">Address</p>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                                                        {[person.address_line, person.locality_area].filter(Boolean).join(', ')}
                                                    </p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </section>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {/* Recent Activity */}
                                    <section>
                                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Recent Participation
                                        </h3>
                                        <div className="rounded-xl border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
                                            {person.participation && person.participation.length > 0 ? (
                                                <ul className="divide-y divide-slate-100 dark:divide-neutral-800">
                                                    {person.participation.map((p, idx) => (
                                                        <li key={idx} className="p-3 text-sm flex justify-between items-center hover:bg-slate-50 dark:hover:bg-neutral-800/50">
                                                            <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">{p.event.title}</span>
                                                            <span className="text-xs text-slate-500">
                                                                {new Date(p.event.start_time).toLocaleDateString()}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <div className="p-4 text-center text-xs text-slate-400">
                                                    No recent activity recorded
                                                </div>
                                            )}
                                        </div>
                                        {person.last_donation_date && (
                                            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                                <Heart className="w-3.5 h-3.5 text-rose-500" />
                                                Last Donation: <span className="font-medium text-slate-700 dark:text-slate-300">{new Date(person.last_donation_date).toLocaleDateString()}</span>
                                            </div>
                                        )}
                                    </section>

                                    {/* Volunteer Information */}
                                    {person.is_volunteer && (
                                        <section>
                                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Volunteer Profile</h3>
                                            <div className="p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-900/5">
                                                <div className="flex gap-4">
                                                    <div className="p-2 h-fit rounded-lg bg-white dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/50 text-rose-600 dark:text-rose-400">
                                                        <Shield className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium text-slate-900 dark:text-rose-100 mb-1">Active Volunteer</h4>

                                                        {person.skills && person.skills.length > 0 ? (
                                                            <div className="flex flex-wrap gap-2 mt-3">
                                                                {person.skills.map(skill => (
                                                                    <span key={skill} className="px-2 py-1 bg-white dark:bg-rose-950/30 text-slate-700 dark:text-rose-200 text-[10px] font-medium rounded-md border border-rose-100 dark:border-rose-900/30 shadow-sm">
                                                                        {skill}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-xs text-slate-400 italic block mt-1">No skills listed</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
