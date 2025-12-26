import { useEffect, useState } from 'react'
import { DataTable } from '../../components/DataTable'
import { type PersonData, type DeletedPersonData, peopleModel } from '../../models/peopleModel'
import { Users, AlertCircle, Edit2, Trash2, Eye, History, Shield } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '../../store'
import {
  setOpenEditModal,
  setEditingPerson,
  fetchPeople
} from '../../store/slices/peopleSlice'
import { PromoteModal } from '../../components/PromoteModal'

export function PeoplePage() {
  const dispatch = useAppDispatch()
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active')
  const [promoteModal, setPromoteModal] = useState<{ isOpen: boolean; personId: string | null; personName: string }>({
    isOpen: false,
    personId: null,
    personName: ''
  })

  const { role: currentUserRole } = useAppSelector(state => state.auth)
  const loading = useAppSelector(state => state.people.loading)
  const error = useAppSelector(state => state.people.error)
  const people = useAppSelector(state => state.people.persons)
  const deletedPeople = useAppSelector(state => state.people.deletedPersons)

  const openPersonDetails = (id: string) => {
    window.open(`#/admin/people/${id}`, '_blank')
  }

  const activeFilters = useAppSelector(state => state.filters.activeFilters)

  useEffect(() => {
    dispatch(fetchPeople())
  }, [dispatch, activeFilters])

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this person? They will be archived in the deleted people section.')) return

    try {
      await peopleModel.deletePerson(id)
      dispatch(fetchPeople({ force: true }))
    } catch (err) {
      console.error('Error in handleDelete:', err)
      alert('Failed to delete person. Please try again.')
    }
  }

  async function handleRestore(person: DeletedPersonData) {
    try {
      await peopleModel.restorePerson(person)
      dispatch(fetchPeople({ force: true }))
    } catch (err) {
      console.error('Failed to restore person:', err)
      alert('Failed to restore person. Please try again.')
    }
  }

  async function handlePromote(personId: string, personName: string) {
    setPromoteModal({ isOpen: true, personId, personName })
  }

  const columns = [
    { key: 'full_name', header: 'Name' },
    { key: 'phone', header: 'Phone', nowrap: true },
    { key: 'locality_area', header: 'Area' },
    { key: 'blood_group', header: 'Blood Group' },
    { key: 'is_volunteer', header: 'Role', render: (row: PersonData) => row.is_volunteer ? 'Volunteer' : 'Resident' },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: PersonData) => {
        const isTargetAdmin = !!row.admins?.role && ['super_admin', 'admin'].includes(row.admins.role)
        const canEdit = currentUserRole === 'super_admin' || (currentUserRole === 'admin' && !isTargetAdmin)
        const canDelete = currentUserRole === 'super_admin' || (currentUserRole === 'admin' && !isTargetAdmin)

        return (
          <div className="flex items-center justify-start space-x-1">
            <button
              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="View"
              onClick={() => row.id && openPersonDetails(row.id)}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {canEdit && (
              <button
                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Edit"
                onClick={() => {
                  dispatch(setEditingPerson(row))
                  dispatch(setOpenEditModal(true))
                }}
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}

            {canDelete && (
              <button
                className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Delete"
                onClick={() => row.id && handleDelete(row.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            {currentUserRole === 'super_admin' && !isTargetAdmin && (
              <button
                className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Promote"
                onClick={() => row.id && handlePromote(row.id, row.full_name)}
              >
                <Shield className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )
      }
    }
  ]

  const deletedColumns = [
    { key: 'full_name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'locality_area', header: 'Area' },
    {
      key: 'deleted_at',
      header: 'Deleted At',
      render: (row: DeletedPersonData) => new Date(row.deleted_at).toLocaleDateString()
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row: DeletedPersonData) => {
        const canRestore = currentUserRole === 'super_admin' || currentUserRole === 'admin'

        return (
          <div className="flex items-center justify-start space-x-1">
            {canRestore && (
              <button
                className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded hover:bg-slate-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Restore"
                onClick={() => handleRestore(row)}
              >
                <History className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-end justify-between pb-3 border-b border-slate-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-500" />
            People
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage donors and recipients database.
          </p>
        </div>
        <div className="text-[10px] font-mono text-slate-400">
          {loading ? 'Loading...' : `${activeTab === 'active' ? people.length : deletedPeople.length} Records`}
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-neutral-800">
        <button
          className={`pb-2 px-1 text-xs font-semibold transition-colors relative ${activeTab === 'active'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          onClick={() => setActiveTab('active')}
        >
          Active People
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
        <button
          className={`pb-2 px-1 text-xs font-semibold transition-colors relative ${activeTab === 'deleted'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          onClick={() => setActiveTab('deleted')}
        >
          Deleted People
          {activeTab === 'deleted' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
          )}
        </button>
      </div>

      {error ? (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      ) : activeTab === 'active' ? (
        <DataTable
          data={people}
          columns={columns}
          loading={loading}
        />
      ) : (
        <DataTable
          data={deletedPeople}
          columns={deletedColumns}
          loading={loading}
        />
      )}

      <PromoteModal
        isOpen={promoteModal.isOpen}
        onClose={() => setPromoteModal({ ...promoteModal, isOpen: false })}
        personId={promoteModal.personId}
        personName={promoteModal.personName}
        onSuccess={() => dispatch(fetchPeople({ force: true }))}
      />
    </div>
  )
}