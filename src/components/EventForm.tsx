import { X, Calendar, MapPin, AlignLeft, Type as TypeIcon, Save, Loader2, Edit3 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { eventsModel, type EventData } from '../models/eventsModel'
import { useAppSelector } from '../store'

interface EventFormProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    editData?: EventData | null
}

export function EventForm({ isOpen, onClose, onSuccess, editData }: EventFormProps) {
    const { user } = useAppSelector(state => state.auth)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<Omit<EventData, 'id' | 'created_at'>>({
        title: '',
        description: '',
        start_time: new Date().toISOString().slice(0, 16),
        end_time: '',
        type: 'other',
        status: 'draft',
        location_name: '',
        organizer_id: user?.id
    })

    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || '',
                description: editData.description || '',
                start_time: editData.start_time ? new Date(editData.start_time).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
                end_time: editData.end_time ? new Date(editData.end_time).toISOString().slice(0, 16) : '',
                type: editData.type || 'other',
                status: editData.status || 'draft',
                location_name: editData.location_name || '',
                organizer_id: editData.organizer_id || user?.id
            })
        } else {
            setFormData({
                title: '',
                description: '',
                start_time: new Date().toISOString().slice(0, 16),
                end_time: '',
                type: 'other',
                status: 'draft',
                location_name: '',
                organizer_id: user?.id
            })
        }
    }, [editData, isOpen, user?.id])

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const processedData = {
                ...formData,
                start_time: new Date(formData.start_time).toISOString(),
                end_time: formData.end_time ? new Date(formData.end_time).toISOString() : undefined,
                organizer_id: formData.organizer_id || user?.id
            }

            if (editData?.id) {
                await eventsModel.updateEvent(editData.id, processedData)
            } else {
                await eventsModel.createEvent(processedData)
            }

            onSuccess()
            onClose()
        } catch (err: any) {
            console.error('Failed to save event:', err)
            setError(err.message || 'Failed to save event. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/50">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${editData ? 'bg-blue-500/10 text-blue-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {editData ? <Edit3 className="w-5 h-5" /> : <Calendar className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                                {editData ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {editData ? 'Update activity details' : 'Add a new community activity'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-neutral-700 rounded-full transition-colors text-slate-400">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="p-3 bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 text-xs rounded-lg border border-rose-100 dark:border-rose-900/30">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <TypeIcon className="w-3 h-3" /> Event Title
                            </label>
                            <input
                                required
                                type="text"
                                placeholder="e.g., Annual Spring Cleanup Drive"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <AlignLeft className="w-3 h-3" /> Description
                            </label>
                            <textarea
                                rows={3}
                                placeholder="Describe the event purpose and goals..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all cursor-pointer"
                                >
                                    <option value="donation_drive">Donation Drive</option>
                                    <option value="cleanup">Cleanup</option>
                                    <option value="emergency">Emergency</option>
                                    <option value="workshop">Workshop</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all cursor-pointer"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Time */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> Start Date & Time
                                </label>
                                <input
                                    required
                                    type="datetime-local"
                                    value={formData.start_time}
                                    onChange={e => setFormData({ ...formData, start_time: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                />
                            </div>

                            {/* End Time */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Calendar className="w-3 h-3" /> End Date & Time (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.end_time}
                                    onChange={e => setFormData({ ...formData, end_time: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <MapPin className="w-3 h-3" /> Location Name
                            </label>
                            <input
                                type="text"
                                placeholder="Venue name or address..."
                                value={formData.location_name}
                                onChange={e => setFormData({ ...formData, location_name: e.target.value })}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-neutral-800 rounded-xl border-none text-sm focus:ring-2 focus:ring-rose-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-xl transition-colors border border-slate-200 dark:border-neutral-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-rose-500 hover:bg-rose-600 text-white px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? (editData ? 'Saving...' : 'Creating...') : (editData ? 'Save Changes' : 'Create Event')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
