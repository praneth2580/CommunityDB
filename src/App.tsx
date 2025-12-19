import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

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

export default function App() {
  const [isDark, setIsDark] = useState(false)

  // Toggle dark mode on html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

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
        <Route path="/admin" element={<AdminLayout />}>
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
