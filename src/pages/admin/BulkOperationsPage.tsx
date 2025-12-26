import React, { useState } from 'react'
import {
    FileSpreadsheet,
    Upload,
    Download,
    CheckCircle2,
    AlertCircle,
    Loader2,
    ArrowRight,
    Search,
    Info
} from 'lucide-react'
import { bulkModel } from '../../models/bulkModel'

type ImportType = 'people' | 'events' | 'attendance' | 'admins'

interface ImportResult {
    success: boolean
    message: string
    details?: string
}

const SAMPLES: Record<ImportType, string> = {
    people: 'full_name,phone,email,blood_group,is_volunteer,skills\nJohn Doe,1234567890,john@example.com,A+,true,"first-aid,driving"',
    events: 'title,description,location,start_time,end_time,status\nCommunity Meetup,Monthly gathering,Central Park,2025-01-01T10:00:00Z,2025-01-01T12:00:00Z,active',
    attendance: 'event_id,person_id,role,status\nuuid-of-event,uuid-of-person,attendee,attended',
    admins: 'user_id,role\nuuid-of-user,admin'
}

export function BulkOperationsPage() {
    const [selectedType, setSelectedType] = useState<ImportType>('people')
    const [allowUpdate, setAllowUpdate] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<ImportResult | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setResult(null)
        }
    }

    const downloadSample = () => {
        const blob = new Blob([SAMPLES[selectedType]], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `sample_${selectedType}.csv`
        a.click()
    }

    const parseCSV = (csvText: string) => {
        const lines = csvText.split(/\r?\n/)
        if (lines.length < 2) return []

        const rawHeaders = lines[0].split(',').map(h => h.trim())

        // Define aliases for common headers
        const ALIAS_MAP: Record<string, string> = {
            'event_name': 'title',
            'name': 'title',
            'city': 'location_name',
            'area': 'location_name',
            'event_date': 'start_time',
            'date': 'start_time',
            'event_id': 'id',
            'person_id': 'id', // Only for people sector
            'user_id': 'id',    // Only for admins sector
            'is_active': 'status'
        }

        const VALID_COLUMNS: Record<ImportType, string[]> = {
            people: ['id', 'user_id', 'full_name', 'first_name', 'middle_name', 'last_name', 'email', 'phone', 'address_line', 'locality_area', 'blood_group', 'is_blood_donor', 'last_donation_date', 'is_volunteer', 'skills', 'marital_status', 'children_count'],
            events: ['id', 'title', 'description', 'start_time', 'end_time', 'type', 'status', 'location_name', 'organizer_id'],
            attendance: ['event_id', 'person_id', 'role', 'status'],
            admins: ['id', 'user_id', 'person_id', 'role', 'department']
        }

        const headers = rawHeaders.map(h => ALIAS_MAP[h.toLowerCase()] || h)
        const data = []

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue
            const values = lines[i].split(',').map(v => {
                let cleaned = (v || '').trim()
                // Remove outer quotes if present
                if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                    cleaned = cleaned.substring(1, cleaned.length - 1)
                }
                return cleaned
            })

            const obj: any = {}
            headers.forEach((header, idx) => {
                let val: any = values[idx]

                // Handle empty strings as null for database compatibility
                if (val === '' || val === undefined) {
                    val = null
                } else {
                    // Type conversions
                    if (val === 'true') val = true
                    else if (val === 'false') val = false
                    else if (header === 'skills' && val) val = val.split(';')
                }

                // Value normalization for status (if mapped from is_active)
                if (header === 'status' && typeof val === 'boolean') {
                    val = val ? 'active' : 'cancelled'
                }

                // Categorical Normalization (Constraint Guard)
                if (val && typeof val === 'string') {
                    const cleanVal = val.trim().toLowerCase()

                    if (header === 'status') {
                        const STATUS_MAP: Record<string, string> = {
                            'in progress': 'active',
                            'processing': 'active',
                            'done': 'completed',
                            'finished': 'completed',
                            'passed': 'completed',
                            'stopped': 'cancelled',
                            'inactive': 'cancelled'
                        }
                        const allowed = ['draft', 'active', 'completed', 'cancelled']
                        val = STATUS_MAP[cleanVal] || (allowed.includes(cleanVal) ? cleanVal : 'draft')
                    }

                    if (header === 'type' && selectedType === 'events') {
                        const TYPE_MAP: Record<string, string> = {
                            'drive': 'donation_drive',
                            'donation': 'donation_drive',
                            'cleaning': 'cleanup',
                            'urgent': 'emergency',
                            'class': 'workshop',
                            'seminar': 'workshop'
                        }
                        const allowed = ['donation_drive', 'cleanup', 'emergency', 'workshop', 'other']
                        val = TYPE_MAP[cleanVal] || (allowed.includes(cleanVal) ? cleanVal : 'other')
                    }
                }

                // UUID Guard: Validate and sanitize UUID columns
                const UUID_COLUMNS = ['id', 'user_id', 'person_id', 'event_id', 'organizer_id', 'requestor_id', 'assigned_volunteer_id', 'donor_id']
                const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

                if (UUID_COLUMNS.includes(header) && val && typeof val === 'string') {
                    if (!UUID_REGEX.test(val)) {
                        // If it's the primary 'id', strip it so DB can generate a new one
                        // If it's a foreign key, we keep it as null if invalid (to avoid 22P02)
                        // but for 'id' it's safer to just remove the key entirely
                        if (header === 'id') {
                            return // Don't even add the 'id' key to the object
                        } else {
                            val = null // Map invalid foreign keys to null
                        }
                    }
                }

                // Only include known valid columns
                if (VALID_COLUMNS[selectedType].includes(header)) {
                    obj[header] = val
                }
            })

            if (Object.keys(obj).length > 0) {
                data.push(obj)
            }
        }
        return data
    }

    const handleUpload = async () => {
        if (!file) return
        setIsProcessing(true)
        setResult(null)

        try {
            const text = await file.text()
            const data = parseCSV(text)

            if (data.length === 0) {
                setResult({ success: false, message: 'The CSV file appears to be empty.' })
                return
            }

            let response
            switch (selectedType) {
                case 'people':
                    response = await bulkModel.bulkUpsertPeople(data, allowUpdate)
                    break
                case 'events':
                    response = await bulkModel.bulkCreateEvents(data, allowUpdate)
                    break
                case 'attendance':
                    response = await bulkModel.bulkRecordAttendance(data, allowUpdate)
                    break
                case 'admins':
                    response = await bulkModel.bulkUpsertAdmins(data, allowUpdate)
                    break
            }

            setResult({
                success: true,
                message: `Successfully processed ${data.length} records.`,
                details: Array.isArray(response) ? `Imported IDs: ${(response as any[]).map(r => r.id || r.person_id).slice(0, 3).join(', ')}...` : undefined
            })
            setFile(null)
        } catch (err: any) {
            console.error('Import Error:', err)
            setResult({
                success: false,
                message: 'Failed to process import.',
                details: err.message || 'Check browser console for details.'
            })
        } finally {
            setIsProcessing(false)
        }
    }


    return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
                <div>
                    <div className="flex items-center gap-3 text-rose-500 mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-2xl">
                            <FileSpreadsheet className="w-8 h-8" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase dark:text-white">Bulk Intelligence</h1>
                    </div>
                    <p className="text-slate-500 font-medium max-w-lg">
                        Perform massive data synchronization across the community ecosystem. restricted to high-clearance personnel.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={downloadSample}
                        className="px-6 py-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl transition-all active:scale-95 flex items-center gap-2 dark:text-white"
                    >
                        <Download className="w-4 h-4" />
                        Get Schema
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Config Panel */}
                <div className="lg:col-span-4 space-y-6">
                    <section className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-neutral-800 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 px-1">1. Select Target Sector</h3>
                        <div className="space-y-3">
                            {(['people', 'events', 'attendance', 'admins'] as const).map(type => (
                                <button
                                    key={type}
                                    onClick={() => setSelectedType(type)}
                                    className={`w-full p-6 rounded-3xl border-2 transition-all text-left group ${selectedType === type
                                        ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white text-white dark:text-black shadow-xl ring-4 ring-slate-900/10 dark:ring-white/10'
                                        : 'bg-slate-50 dark:bg-neutral-800/50 border-transparent hover:border-slate-200 text-slate-400'
                                        }`}
                                >
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-60">Database Sector</p>
                                    <p className="text-2xl font-black uppercase tracking-tighter leading-none">{type}</p>
                                </button>
                            ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50 dark:border-neutral-800">
                            <div className="flex items-center justify-between p-4 bg-rose-50/50 dark:bg-rose-950/10 rounded-2xl border border-rose-100/50 dark:border-rose-900/20">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-rose-600">Safety Protocol</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400">Update existing records</p>
                                </div>
                                <button
                                    onClick={() => setAllowUpdate(!allowUpdate)}
                                    className={`w-12 h-6 rounded-full transition-all relative ${allowUpdate ? 'bg-rose-500' : 'bg-slate-300 dark:bg-neutral-800'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${allowUpdate ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>
                            <p className="mt-3 text-[9px] text-slate-400 leading-relaxed italic">
                                * When disabled, the system will only perform new inserts and fail on conflicts.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Upload Panel */}
                <div className="lg:col-span-8 space-y-6">
                    <section className="bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-neutral-800 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center relative overflow-hidden group">
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-slate-50 dark:bg-neutral-800" />

                        {!result && !isProcessing && (
                            <>
                                <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mb-8 rotate-3 transition-transform group-hover:rotate-0">
                                    <Upload className="w-10 h-10 text-rose-500" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Transmission Terminal</h2>
                                <p className="text-slate-500 max-w-sm font-medium mb-10">
                                    Upload your synchronized CSV document here for processing.
                                </p>

                                <label className="relative cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <div className="px-12 py-5 bg-rose-500 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all hover:scale-105 active:scale-95 flex items-center gap-3">
                                        <Search className="w-5 h-5" />
                                        Select File
                                    </div>
                                </label>
                                {file && <p className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Ready: {file.name}
                                </p>}
                            </>
                        )}

                        {isProcessing && (
                            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                <Loader2 className="w-20 h-20 animate-spin text-rose-500 mb-8" />
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Syncing Core...</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-4 italic">Writing entries to high-availability storage</p>
                            </div>
                        )}

                        {result && (
                            <div className="flex flex-col items-center animate-in zoom-in fade-in duration-500">
                                <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-8 ${result.success ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                                    {result.success ? <CheckCircle2 className="w-12 h-12" /> : <AlertCircle className="w-12 h-12" />}
                                </div>
                                <h3 className={`text-3xl font-black uppercase tracking-tighter mb-4 ${result.success ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {result.success ? 'Sync Completed' : 'Transmission Failure'}
                                </h3>
                                <p className="text-slate-500 font-medium max-w-sm mb-2">{result.message}</p>
                                {result.details && <p className="text-[10px] font-mono bg-slate-100 dark:bg-neutral-800 p-4 rounded-xl text-slate-500 max-w-md break-all">{result.details}</p>}

                                <button
                                    onClick={() => setResult(null)}
                                    className="mt-10 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                                >
                                    New Session
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="bg-slate-900 dark:bg-neutral-800 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl text-white">
                        <div className="flex items-center gap-4 mb-6">
                            <Info className="w-6 h-6 text-rose-500" />
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Security Protocol</p>
                        </div>
                        <p className="text-lg font-black leading-tight tracking-tight uppercase max-w-md">
                            Bulk imports override existing registry records based on unique identifiers (Phone/UUID).
                        </p>

                        {!result && file && (
                            <button
                                onClick={handleUpload}
                                disabled={isProcessing}
                                className="mt-8 w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-4"
                            >
                                Initiate Global Sync
                                <ArrowRight className="w-5 h-5 text-rose-500" />
                            </button>
                        )}
                    </section>
                </div>
            </div>
        </div>
    )
}
