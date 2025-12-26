import React, { useState } from 'react'
import { Plus, X, Search, Check, Droplets, Banknote, Utensils, Package, Box } from 'lucide-react'
import type { PersonData } from '../models/peopleModel'
import type { ResourceData } from '../models/resourcesModel'

interface DonationFormProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (data: Omit<ResourceData, 'id' | 'collected_at' | 'donor'>) => void
    people: PersonData[]
    eventId: string
}

const resourceTypes: { id: ResourceData['type']; label: string; icon: React.ElementType }[] = [
    { id: 'money', label: 'Financial', icon: Banknote },
    { id: 'blood', label: 'Blood Donation', icon: Droplets },
    { id: 'food', label: 'Food/Supplies', icon: Utensils },
    { id: 'kits', label: 'Medical/Utility Kits', icon: Package },
    { id: 'other', label: 'Other', icon: Box },
]

export function DonationForm({ isOpen, onClose, onAdd, people, eventId }: DonationFormProps) {
    const [step, setStep] = useState<'donor' | 'details'>('donor')
    const [selectedDonor, setSelectedDonor] = useState<PersonData | null>(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
        type: 'money' as ResourceData['type'],
        quantity: 0,
        unit: '',
        status: 'collected' as ResourceData['status']
    })

    if (!isOpen) return null

    const filteredPeople = people.filter(p =>
        p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.phone.includes(searchQuery)
    ).slice(0, 5)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedDonor?.id) return

        onAdd({
            event_id: eventId,
            donor_id: selectedDonor.id,
            type: formData.type,
            quantity: Number(formData.quantity),
            unit: formData.unit || (formData.type === 'money' ? 'Currency' : 'Units'),
            status: formData.status
        })
        resetForm()
    }

    const resetForm = () => {
        setStep('donor')
        setSelectedDonor(null)
        setSearchQuery('')
        setFormData({
            type: 'money',
            quantity: 0,
            unit: '',
            status: 'collected'
        })
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/20 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 dark:border-neutral-800 flex items-center justify-between bg-slate-50 dark:bg-neutral-800/50">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
                        {step === 'donor' ? '1. Select Contributor' : '2. Contribution Details'}
                    </h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8">
                    {step === 'donor' ? (
                        <div className="space-y-6">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Find person by name or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-neutral-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-rose-500/20"
                                />
                            </div>

                            <div className="space-y-2">
                                {filteredPeople.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => { setSelectedDonor(p); setStep('details'); }}
                                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-900 border border-slate-100 dark:border-neutral-800 rounded-2xl hover:border-rose-500 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-slate-500">
                                                {p.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{p.full_name}</p>
                                                <p className="text-xs text-slate-400 font-medium">{p.phone}</p>
                                            </div>
                                        </div>
                                        <Check className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                                {searchQuery && filteredPeople.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">No matching records</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-neutral-800 rounded-2xl animate-in fade-in">
                                <div className="w-12 h-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-black text-xl">
                                    {selectedDonor?.full_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Selected Donor</p>
                                    <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedDonor?.full_name}</p>
                                </div>
                                <button type="button" onClick={() => setStep('donor')} className="ml-auto text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Change</button>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {resourceTypes.map(rt => {
                                    const Icon = rt.icon
                                    const isSelected = formData.type === rt.id
                                    return (
                                        <button
                                            key={rt.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: rt.id })}
                                            className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all ${isSelected
                                                ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-xl scale-105'
                                                : 'bg-white dark:bg-neutral-800 text-slate-400 border-slate-100 dark:border-neutral-800 hover:border-slate-200'
                                                }`}
                                        >
                                            <Icon className="w-6 h-6" />
                                            <span className="text-[10px] font-black uppercase tracking-widest">{rt.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Quantity</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                        className="w-full p-4 bg-slate-50 dark:bg-neutral-800 border-none rounded-2xl text-xl font-black focus:ring-2 focus:ring-rose-500/20"
                                    />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Unit (e.g. units, liters)</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Currency / Kg / Unit"
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                        className="w-full p-4 bg-slate-50 dark:bg-neutral-800 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-rose-500/20 uppercase"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-5 bg-rose-500 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Plus className="w-5 h-5" />
                                Record Donation
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
