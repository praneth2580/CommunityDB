import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { peopleModel, type PersonData, type DeletedPersonData } from '../../models/peopleModel'


export interface PeopleState {
    persons: PersonData[]
    deletedPersons: DeletedPersonData[]
    editingPerson: PersonData | null
    personLastFetched: number | null
    loading: boolean
    openEditModal: boolean,
    error: string | null
    initialized: boolean
}

const initialState: PeopleState = {
    persons: [],
    deletedPersons: [],
    editingPerson: null,
    personLastFetched: null,
    loading: false,
    openEditModal: false,
    error: null,
    initialized: false,
}

const PEOPLE_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const fetchPeople = createAsyncThunk(
    'people/fetchPeople',
    async (args: { force?: boolean } | undefined, { getState, rejectWithValue }) => {
        const rootState = getState() as any
        const peopleState = rootState.people as PeopleState
        const activeFilters = rootState.filters.activeFilters
        const now = Date.now()

        const hasActiveFilters = Object.values(activeFilters).some((v: any) => v.length > 0)

        // Cache valid check: Not forced, no active filters, and within TTL
        if (!args?.force && !hasActiveFilters && peopleState.personLastFetched && (now - peopleState.personLastFetched < PEOPLE_CACHE_TTL)) {
            return rejectWithValue('CACHE_VALID')
        }

        try {
            const [persons, deletedPersons] = await Promise.all([
                peopleModel.getAllPeople(activeFilters),
                peopleModel.getDeletedPeople()
            ])

            return {
                persons,
                deletedPersons,
            }
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch people')
        }
    }
)

export const initPeople = fetchPeople // Alias for backward compatibility if needed

const peopleSlice = createSlice({
    name: 'people',
    initialState,
    reducers: {
        setPersons: (
            state,
            action: PayloadAction<{ persons: PersonData[] }>
        ) => {
            state.persons = action.payload.persons
            state.error = null
            state.initialized = true
        },
        clearPersons: (state) => {
            state.persons = []
            state.error = null
            state.initialized = true
        },
        setDeletedPersons: (
            state,
            action: PayloadAction<{ deletedPersons: DeletedPersonData[] }>
        ) => {
            state.deletedPersons = action.payload.deletedPersons
            state.error = null
            state.initialized = true
        },
        clearDeletedPersons: (state) => {
            state.deletedPersons = []
            state.error = null
            state.initialized = true
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setOpenEditModal: (state, action: PayloadAction<boolean>) => {
            state.openEditModal = action.payload
        },
        setEditingPerson: (state, action: PayloadAction<PersonData | null>) => {
            state.editingPerson = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPeople.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchPeople.fulfilled, (state, action) => {
                state.persons = action.payload.persons
                state.deletedPersons = action.payload.deletedPersons
                state.loading = false
                state.error = null
                state.initialized = true
                state.personLastFetched = Date.now()
            })
            .addCase(fetchPeople.rejected, (state, action) => {
                state.loading = false
                if (action.payload !== 'CACHE_VALID') {
                    state.error = (action.payload as string) || action.error.message || 'People fetch failed'
                }
                state.initialized = true
            })
    },
})

export const { setPersons, clearPersons, setLoading, setError, setOpenEditModal, setDeletedPersons, clearDeletedPersons, setEditingPerson } = peopleSlice.actions
export default peopleSlice.reducer
