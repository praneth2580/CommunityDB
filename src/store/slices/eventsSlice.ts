import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { eventsModel, type EventData, type EventFilters } from '../../models/eventsModel'

export interface EventsState {
    events: EventData[]
    filters: EventFilters
    loading: boolean
    error: string | null
    eventsLastFetched: number | null
    editingEvent: EventData | null
    openEditModal: boolean
    initialized: boolean
}

const initialState: EventsState = {
    events: [],
    filters: {
        dateRange: 'upcoming'
    },
    loading: false,
    error: null,
    eventsLastFetched: null,
    editingEvent: null,
    openEditModal: false,
    initialized: false,
}

const EVENTS_CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (args: { force?: boolean } | undefined, { getState, rejectWithValue }) => {
        const rootState = getState() as any
        const eventsState = rootState.events as EventsState
        const globalFilters = rootState.filters.activeFilters
        const now = Date.now()

        const hasGlobalFilters = Object.values(globalFilters).some((v: any) => v.length > 0)

        // Cache valid check: Not forced, no active global filters, and within TTL
        if (!args?.force && !hasGlobalFilters && eventsState.eventsLastFetched && (now - eventsState.eventsLastFetched < EVENTS_CACHE_TTL)) {
            return rejectWithValue('CACHE_VALID')
        }

        try {
            // Merge local slice filters with global filters
            const combinedFilters = {
                ...eventsState.filters,
                ...globalFilters
            }
            const data = await eventsModel.getAllEvents(combinedFilters)
            return data
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch events')
        }
    }
)

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<EventFilters>) => {
            state.filters = action.payload
            state.eventsLastFetched = null // Invalidate cache on filter change
        },
        clearFilters: (state) => {
            state.filters = initialState.filters
            state.eventsLastFetched = null
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
        setEditingEvent: (state, action: PayloadAction<EventData | null>) => {
            state.editingEvent = action.payload
        },
        setOpenEditModal: (state, action: PayloadAction<boolean>) => {
            state.openEditModal = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.events = action.payload
                state.loading = false
                state.error = null
                state.initialized = true
                state.eventsLastFetched = Date.now()
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false
                if (action.payload !== 'CACHE_VALID') {
                    state.error = (action.payload as string) || action.error.message || 'Events fetch failed'
                }
                state.initialized = true
            })
    },
})

export const { setFilters, clearFilters, setLoading, setError, setEditingEvent, setOpenEditModal } = eventsSlice.actions
export default eventsSlice.reducer
