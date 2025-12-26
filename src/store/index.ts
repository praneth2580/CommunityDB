import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import peopleReducer from './slices/peopleSlice'
import eventsReducer from './slices/eventsSlice'
import filterReducer from './slices/filterSlice'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        people: peopleReducer,
        events: eventsReducer,
        filters: filterReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
