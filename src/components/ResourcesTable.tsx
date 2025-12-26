import { DataTable } from './DataTable'
import type { ResourceData } from '../models/resourcesModel'
import { Package, Banknote, Droplets, Utensils, Box, CheckCircle2, Truck, Timer } from 'lucide-react'

interface ResourcesTableProps {
    resources: ResourceData[]
    loading?: boolean
    onStatusUpdate?: (resourceId: string, status: ResourceData['status']) => void
}

const typeIcons = {
    money: { icon: Banknote, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    blood: { icon: Droplets, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    food: { icon: Utensils, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    kits: { icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    other: { icon: Box, color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-neutral-800' }
}

const statusConfig = {
    pledged: { color: 'text-amber-600 dark:text-amber-400', icon: Timer, label: 'Pledged' },
    collected: { color: 'text-blue-600 dark:text-blue-400', icon: CheckCircle2, label: 'Collected' },
    distributed: { color: 'text-emerald-600 dark:text-emerald-400', icon: Truck, label: 'Distributed' }
}

export function ResourcesTable({ resources, loading, onStatusUpdate }: ResourcesTableProps) {
    const columns = [
        {
            key: 'donor',
            header: 'Contributor',
            render: (row: ResourceData) => (
                <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight text-xs">
                        {row.donor?.full_name || 'Anonymous'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                        {row.donor?.phone || row.donor?.email || 'No contact'}
                    </span>
                </div>
            )
        },
        {
            key: 'type',
            header: 'Resource',
            render: (row: ResourceData) => {
                const config = typeIcons[row.type] || typeIcons.other
                return (
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${config.bg} ${config.color}`}>
                            <config.icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">
                            {row.type}
                        </span>
                    </div>
                )
            }
        },
        {
            key: 'quantity',
            header: 'Amount',
            render: (row: ResourceData) => (
                <div>
                    <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">
                        {row.quantity}
                    </span>
                    <span className="text-[10px] ml-1 text-slate-400 font-bold uppercase">
                        {row.unit}
                    </span>
                </div>
            )
        },
        {
            key: 'status',
            header: 'Status',
            render: (row: ResourceData) => {
                const config = statusConfig[row.status]
                return (
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${config.color}`}>
                        <config.icon className="w-3.5 h-3.5" />
                        {config.label}
                    </div>
                )
            }
        },
        {
            key: 'actions',
            header: 'Manage',
            render: (row: ResourceData) => (
                <div className="flex items-center gap-1">
                    {row.status === 'pledged' && (
                        <button
                            onClick={() => onStatusUpdate?.(row.id, 'collected')}
                            className="px-2 py-1 bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-all"
                        >
                            Collect
                        </button>
                    )}
                    {row.status === 'collected' && (
                        <button
                            onClick={() => onStatusUpdate?.(row.id, 'distributed')}
                            className="px-2 py-1 bg-rose-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all"
                        >
                            Distribute
                        </button>
                    )}
                </div>
            )
        }
    ]

    return (
        <DataTable
            data={resources as any}
            columns={columns as any}
            loading={loading}
        />
    )
}
