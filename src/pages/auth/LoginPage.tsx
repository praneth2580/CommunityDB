import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Loader2, LogIn, AlertCircle } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store'
import { setAuth, setLoading, setError as setReduxError } from '../../store/slices/authSlice'
import { peopleModel } from '../../models/peopleModel'

export function LoginPage() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const location = useLocation()

    const { initialized, role, user, loading } = useAppSelector(state => state.auth)

    // Redirect if already logged in
    useEffect(() => {
        if (initialized && role) navigate('/admin', { replace: true })
    }, [initialized, role, navigate])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        dispatch(setLoading(true))
        setError(null)

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (authError) throw authError
            if (!data.user) throw new Error('No user returned from Supabase.')

            // Fetch role from your backend table
            const userRole = await peopleModel.getCurrentUserRole()
            // if (roleError) throw roleError

            if (!userRole) throw new Error('You are not authorized to access the admin panel.')

            // Dispatch to Redux
            dispatch(setAuth({
                user: { id: data.user.id, email: data.user.email || '' },
                role: userRole
            }))

            navigate('/admin')
        } catch (err: any) {
            const message = err.message || 'Login failed'
            setError(message)
            dispatch(setReduxError(message))
        } finally {
            setLoading(false)
        }
    }

    // 🔐 Redirect if already logged in
    useEffect(() => {
        if (role && user && location.pathname === "/login") {
            navigate("/admin", { replace: true });
        }
    }, [role, user, location.pathname, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto h-12 w-12 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/20">
                    HB
                </div>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Sign in to CommunityDB
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                    Authorized personnel only
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-neutral-900 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200 dark:border-neutral-800">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
                                <div className="flex">
                                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Login Failed</h3>
                                        <p className="mt-2 text-sm text-red-700 dark:text-red-300">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete='email'
                                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-neutral-700 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-neutral-800 dark:text-white sm:text-sm"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete='current-password'
                                required
                                className="mt-1 block w-full rounded-md border border-slate-300 dark:border-neutral-700 px-3 py-2 placeholder-slate-400 shadow-sm focus:border-rose-500 focus:ring-rose-500 dark:bg-neutral-800 dark:text-white sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-rose-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? email === '' && password === '' ? <><Loader2 className="h-4 w-4 animate-spin" /> Auto Logging in...</> : <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <><LogIn className="h-4 w-4" /> Sign in</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
