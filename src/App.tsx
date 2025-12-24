import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { useAppDispatch, useAppSelector, type RootState } from "./store";
import { clearAuth, initAuthUser } from "./store/slices/authSlice";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

import { Dashboard } from "./pages/admin/Dashboard";
import { People } from "./pages/admin/People";
import { Volunteers } from "./pages/admin/Volunteers";
import { Analytics } from "./pages/admin/Analytics";
import { Profile } from "./pages/admin/Profile";
import { Settings } from "./pages/admin/Settings";
import { LandingPage } from "./pages/landing/LandingPage";
import { ActivitiesPage } from "./pages/landing/ActivitiesPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { role, initialized, loading } = useAppSelector(state => state.auth)

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    )
  }

  if (!role) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  const [isDark, setIsDark] = useState(false)
  const dispatch = useAppDispatch()
  const user = useSelector((state: RootState) => state.auth.user);

  // Toggle dark mode on html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    // if (user) {
    //   console.log('[App] User signed in:', user)
    //   if (location.pathname === '/login') {
    //     Navigate({ to: '/admin', replace: true })
    //   }
    // }
  }, [user])

  // Auth initialization
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[App] Auth state changed:', event, { email: session?.user?.email })
      console.log('[APP] Session', session)

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[App] SIGNED_IN event. Fetching role...')
        // dispatch(setUserID({
        //   id: session.user.id,
        //   email: session.user.email || '',
        // }))
        dispatch(initAuthUser({
          id: session.user.id,
          email: session.user.email || '',
        }))
      } else if (event === 'SIGNED_OUT') {
        dispatch(clearAuth())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <Router>
      <Routes>

        {/* 🌸 PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route
            path="/"
            element={<LandingPage onEnterApp={() => { }} />}
          />
          <Route
            path="/activities"
            element={<ActivitiesPage />}
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />

        {/* 🛠️ ADMIN PANEL */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />

          <Route path="people" element={<People />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings isDark={isDark} toggleTheme={() => setIsDark(!isDark)} />} />
        </Route>

      </Routes>
    </Router>
  );
}
