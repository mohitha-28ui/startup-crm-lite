import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-gray-100 min-h-screen transition-colors duration-200">
        {/* Navigation Sidebar: collapses on tablet, drawer on mobile */}
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen pb-16 md:pb-0">
          {/* Header containing search and mobile hamburger button */}
          <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>

          {/* Bottom Navigation Bar: Mobile Only (tap targets 48x48px) */}
          <nav 
            className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 flex items-center justify-around z-45 px-4 shadow-lg transition-colors duration-200"
            aria-label="Mobile Bottom Navigation"
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
              title="Dashboard"
              aria-label="Dashboard Page"
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
              title="Leads"
              aria-label="Leads Page"
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
              title="Analytics"
              aria-label="Analytics Page"
            >
              <BarChart3 size={22} className="stroke-[2.25]" />
            </NavLink>
          </nav>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
