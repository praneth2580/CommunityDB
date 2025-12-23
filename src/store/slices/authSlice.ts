import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { peopleModel } from '../../models/peopleModel'

export type UserRole = 'super_admin' | 'admin' | 'volunteer' | null

interface AuthState {
    user: {
        id: string
        email: string
    } | null
    role: UserRole
    loading: boolean
    error: string | null
    initialized: boolean
}

const initialState: AuthState = {
    user: null,
    role: null,
    loading: false,
    error: null,
    initialized: false,
}

export const initAuthUser = createAsyncThunk(
    'auth/initAuthUser',
    async (user: { id: string; email: string }) => {
        const role = await peopleModel.getCurrentUserRoleByID(user.id)

        return {
            user,
            role,
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // setUserID: (state, action: PayloadAction<{ id: string; email: string }>) => {
        //     state.user = { id: action.payload.id, email: action.payload.email }
        //     peopleModel.getCurrentUserRoleByID(action.payload.id).then(role => {
        //         state.role = role
        //     })
        //     state.error = null
        //     state.loading = false
        //     state.initialized = true
        // },
        setAuth: (
            state,
            action: PayloadAction<{ user: { id: string; email: string }; role: UserRole }>
        ) => {
            state.user = action.payload.user
            state.role = action.payload.role
            state.error = null
            state.initialized = true
        },
        clearAuth: (state) => {
            state.user = null
            state.role = null
            state.error = null
            state.initialized = true
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initAuthUser.pending, (state) => {
                state.loading = true
            })
            .addCase(initAuthUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.role = action.payload.role
                state.loading = false
                state.error = null
                state.initialized = true
            })
            .addCase(initAuthUser.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message ?? 'Auth initialization failed'
                state.initialized = true
            })
    },
})

export const { /* setUserID */ setAuth, clearAuth, setLoading, setError } = authSlice.actions
export default authSlice.reducer
