import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, X, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

/**
 * Sidebar component supporting collapsible responsive widths and mobile drawers.
 * Featuring a floating layout and spring-physics animated tabs.
 */
function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard", subLabel: "Overview & KPIs", icon: LayoutDashboard },
    { path: "/leads", label: "Leads", subLabel: "Pipeline deals", icon: Users },
    { path: "/analytics", label: "Analytics", subLabel: "Win rates & charts", icon: BarChart3 },
  ];

  const userName = (typeof user?.name === "string" && user.name.trim()) ? user.name : "Sana Mohitha";
  const userEmail = (typeof user?.email === "string" && user.email.trim()) ? user.email : "sana@startup.io";

  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/40 backdrop-blur-md z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar Panel */}
      <aside
        className={`fixed inset-y-4 left-4 z-50 transform transition-all duration-300 w-66 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl p-5 flex flex-col
          md:sticky md:top-4 md:translate-x-0 md:h-[calc(100vh-2rem)] md:p-4 md:w-24 lg:w-66 md:my-4 md:ml-4 md:mr-2 md:shrink-0
          ${isOpen ? "translate-x-0" : "-translate-x-full -left-72 md:translate-x-0"}`}
      >
        {/* Mobile Close Button (Minimum tap target 44x44px) */}
        <button
          onClick={onClose}
          type="button"
          className="md:hidden absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors duration-200"
          aria-label="Close sidebar menu"
        >
          <X size={20} />
        </button>

        {/* Application Logo Section */}
        <div className="flex items-center gap-2 mb-8 px-2 justify-center lg:justify-start mt-2 md:mt-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-500/20 shrink-0">
            S
          </div>
          <h1 className="text-lg font-bold tracking-tight md:hidden lg:block bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            CRM Lite
          </h1>
          <span className="hidden md:block lg:hidden text-blue-500 font-extrabold text-xs">CL</span>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-2.5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="relative group block"
              >
                {({ isActive }) => (
                  <div
                    className={`p-3 rounded-xl transition-all duration-300 flex flex-col lg:flex-row items-center gap-2 lg:gap-3.5 w-full text-center lg:text-left cursor-pointer z-10 relative ${
                      isActive
                        ? "text-white font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {/* Active sliding background indicator with Framer Motion spring physics */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl -z-10 shadow-[0_4px_14px_rgba(37,99,235,0.35)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}

                    <IconComponent
                      size={20}
                      className={`shrink-0 stroke-[2.25] transition-transform duration-200 ${
                        isActive
                          ? "text-white"
                          : "text-slate-500 dark:text-slate-400 group-hover:scale-110"
                      }`}
                    />
                    <div className="flex flex-col truncate">
                      <span className="text-xs md:text-[10px] lg:text-[13px] tracking-wide">
                        {item.label}
                      </span>
                      {/* Sub-label for desktop view */}
                      <span
                        className={`text-[10px] font-medium mt-0.5 hidden lg:block ${
                          isActive ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {item.subLabel}
                      </span>
                    </div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Responsive User Profile Card */}
        <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-800/40">
          <div className="flex md:flex-col lg:flex-row items-center gap-3 bg-slate-100/50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-200/30 dark:border-slate-700/20 backdrop-blur-sm">
            {/* User Initials Avatar */}
            <div
              title="Click to logout"
              onClick={logout}
              className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-purple-600 hover:from-rose-500 hover:to-red-600 rounded-xl flex items-center justify-center font-bold text-xs text-white shrink-0 border border-white/20 shadow-md cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {userInitials}
            </div>

            {/* Profile details */}
            <div className="hidden lg:flex md:hidden flex-1 items-center justify-between min-w-0">
              <div className="text-left truncate mr-1">
                <h3 className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200 leading-tight">
                  {userName}
                </h3>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate mt-0.5 leading-none">
                  {userEmail}
                </p>
              </div>

              {/* Logout Icon Trigger */}
              <button
                onClick={logout}
                type="button"
                className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1"
                title="Logout"
                aria-label="Logout user session"
              >
                <LogOut size={14} className="stroke-[2.25]" />
              </button>
            </div>

            {/* Tablet Mobile Logout helper icon */}
            <button
              onClick={logout}
              type="button"
              className="lg:hidden md:flex hidden text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors p-1 mt-1"
              title="Logout"
              aria-label="Logout user session"
            >
              <LogOut size={16} className="stroke-[2.25]" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;