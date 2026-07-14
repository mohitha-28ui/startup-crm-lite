import { useState } from "react";
import { Routes, Route, Navigate, Outlet, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import Dashboard from "../pages/Dashboard";
import Leads from "../pages/Leads";
import Analytics from "../pages/Analytics";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { LayoutDashboard, Users, BarChart3 } from "lucide-react";

/**
 * Gatekeeper component that redirects anonymous visitors to the Login page.
 */
export function ProtectedRoute() {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

/**
 * Shell layout wrapper for dashboard pages, including Sidebar, Header, and Bottom Nav.
 */
export function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-gray-100 min-h-screen transition-colors duration-200 w-full">
      {/* Sidebar navigation */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0 min-w-0">
        {/* Header toolbar */}
        <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />

        <main className="flex-1 w-full">
          <Outlet />
        </main>

        {/* Mobile Navigation Bar: bottom only (accessible tap size) */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center justify-around z-45 px-4 shadow-lg transition-colors duration-200"
          aria-label="Mobile Navigation Drawer"
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`
            }
          >
            <LayoutDashboard size={22} className="stroke-[2.25]" />
          </NavLink>

          <NavLink
            to="/leads"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`
            }
          >
            <Users size={22} className="stroke-[2.25]" />
          </NavLink>

          <NavLink
            to="/analytics"
            className={({ isActive }) =>
              `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300"
              }`
            }
          >
            <BarChart3 size={22} className="stroke-[2.25]" />
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

/**
 * Root router tree matching layout groups and endpoints.
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* Catch-all: Send back to Dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
