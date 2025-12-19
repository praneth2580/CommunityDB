import { useEffect, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { peopleModel, type PersonData } from '../../models/peopleModel'
import { Users, AlertCircle, Edit2, Trash2, Eye } from 'lucide-react'
import { PersonDetailsCard } from '../../components/PersonDetailsCard'

export function People() {
  const [people, setPeople] = useState<PersonData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)

  const openPersonDetails = (id: string) => {
    setSelectedPersonId(id)
  }

  useEffect(() => {
    loadPeople()
  }, [])

  async function loadPeople() {
    try {
      setLoading(true)
      const data = await peopleModel.getAllPeople()
      setPeople(data || [])
    } catch (err) {
      console.error('Failed to load people:', err)
      setError('Failed to load people data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'full_name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'locality_area', header: 'Area' },
    { key: 'blood_group', header: 'Blood Group' },
    { key: 'is_volunteer', header: 'Role', render: (row: PersonData) => row.is_volunteer ? 'Volunteer' : 'Resident' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: PersonData) => (
        <div className="flex items-center justify-start space-x-1">
          {/* View Button */}
          <button
            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="View"
            onClick={() => row.id && openPersonDetails(row.id)}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          {/* Edit Button */}
          <button
            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Edit"
            onClick={() => console.log('Edit clicked', row.id)}
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          {/* Delete Button */}
          <button
            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Delete"
            onClick={() => console.log('Delete clicked', row.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between pb-4 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-slate-500" />
            People
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage donors and recipients database.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {loading ? 'Loading...' : `${people.length} Records`}
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      ) : (
        <DataTable
          data={people}
          columns={columns}
          loading={loading}
        />
      )}

      {selectedPersonId && (
        <PersonDetailsCard
          personId={selectedPersonId}
          onClose={() => setSelectedPersonId(null)}
        />
      )}
    </div>
  )
}