import React, { useState } from 'react'
import { X, Shield, ShieldCheck, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react'
import { peopleModel } from '../models/peopleModel'

interface PromoteModalProps {
    isOpen: boolean
    onClose: () => void
    personId: string | null
    personName: string
    onSuccess: () => void
}

type Role = 'volunteer' | 'admin' | 'super_admin'

interface RoleOption {
    id: Role
    title: string
    description: string
    icon: React.ReactNode
    accent: string
}

const ROLES: RoleOption[] = [
    {
        id: 'volunteer',
        title: 'Verified Volunteer',
        description: 'Grants access to field operations, attendance tracking, and resource collection.',
        icon: <Shield className="w-6 h-6" />,
        accent: 'rose'
    },
    {
        id: 'admin',
        title: 'Registry Admin',
        description: 'Full control over people records, event management, and assistance requests.',
        icon: <ShieldCheck className="w-6 h-6" />,
        accent: 'blue'
    },
    {
        id: 'super_admin',
        title: 'Super Executive',
        description: 'Unrestricted terminal access, including bulk operations and user permission management.',
        icon: <ShieldAlert className="w-6 h-6" />,
        accent: 'slate'
    }
]

export function PromoteModal({ isOpen, onClose, personId, personName, onSuccess }: PromoteModalProps) {
    const [selectedRole, setSelectedRole] = useState<Role | null>(null)
    const [isPromoting, setIsPromoting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    if (!isOpen) return null

    const handlePromote = async () => {
        if (!personId || !selectedRole) return
        setIsPromoting(true)
        setError(null)

        try {
            await peopleModel.promoteToAdmin(personId, selectedRole)
            setSuccess(true)
            setTimeout(() => {
                onSuccess()
                handleClose()
            }, 1500)
        } catch (err: any) {
            console.error('Promotion failed:', err)
            setError(err.message || 'Transmission failed. Ensure the user has a registered digital identity.')
        } finally {
            setIsPromoting(false)
        }
    }

    const handleClose = () => {
        setSuccess(false)
        setError(null)
        setSelectedRole(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 animate-in zoom-in-95 duration-300 ease-out">
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50 dark:border-neutral-800">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Clearance Elevation</h2>
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mt-1">Target Identity: {personName}</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-neutral-800 rounded-2xl transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-8">
                    {success ? (
                        <div className="py-12 flex flex-col items-center text-center animate-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Access Granted</h3>
                            <p className="text-slate-500 font-medium text-sm mt-2">New clearance levels have been synchronized.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Clearance Tier</p>

                            <div className="grid gap-3">
                                {ROLES.map((role) => (
                                    <button
                                        key={role.id}
                                        onClick={() => setSelectedRole(role.id)}
                                        className={`group relative flex items-center gap-5 p-5 rounded-3xl border-2 transition-all text-left ${selectedRole === role.id
                                                ? 'bg-slate-900 dark:bg-white border-slate-900 dark:border-white'
                                                : 'bg-white dark:bg-neutral-800 border-slate-100 dark:border-neutral-800 hover:border-slate-200 dark:hover:border-neutral-700'
                                            }`}
                                    >
                                        <div className={`p-3 rounded-2xl transition-colors ${selectedRole === role.id
                                                ? 'bg-white/10 text-white dark:bg-slate-900/10 dark:text-slate-900'
                                                : 'bg-slate-50 dark:bg-neutral-900 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                            }`}>
                                            {role.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`text-sm font-black uppercase tracking-tight ${selectedRole === role.id ? 'text-white dark:text-slate-900' : 'text-slate-900 dark:text-white'
                                                }`}>
                                                {role.title}
                                            </h4>
                                            <p className={`text-[10px] font-medium leading-relaxed mt-1 line-clamp-2 ${selectedRole === role.id ? 'text-white/60 dark:text-slate-900/60' : 'text-slate-500'
                                                }`}>
                                                {role.description}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {error && (
                                <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/20 rounded-2xl flex items-center gap-3 animate-in shake duration-500">
                                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
                                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-wide">{error}</p>
                                </div>
                            )}

                            <div className="pt-6">
                                <button
                                    onClick={handlePromote}
                                    disabled={!selectedRole || isPromoting}
                                    className="w-full py-5 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                                >
                                    {isPromoting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Synchronizing...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-5 h-5" />
                                            Authorize Elevation
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
