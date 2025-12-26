import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface FilterState {
    activeFilters: Record<string, string[]>
}

const initialState: FilterState = {
    activeFilters: {},
}

const filterSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilter: (state, action: PayloadAction<{ category: string; value: string }>) => {
            const { category, value } = action.payload
            const current = state.activeFilters[category] || []
            const updated = current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value]

            state.activeFilters = {
                ...state.activeFilters,
                [category]: updated,
            }
        },
        clearFilters: (state) => {
            state.activeFilters = {}
        },
        resetFiltersForPage: (state) => {
            // Option to reset if navigation happens, but we might want them to persist
            state.activeFilters = {}
        }
    },
})

export const { setFilter, clearFilters, resetFiltersForPage } = filterSlice.actions
export default filterSlice.reducer
