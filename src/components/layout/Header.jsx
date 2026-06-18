import { Bell, Settings, Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import DarkModeToggle from "../common/DarkModeToggle";

/**
 * Header component featuring search, notifications, theme toggles, and mobile drawer triggers.
 */
function Header({ onMenuToggle }) {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/leads":
        return "Leads";
      case "/analytics":
        return "Analytics";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 px-4 sm:px-6 py-4 flex justify-between items-center transition-colors duration-200 z-30">
      <div className="flex items-center gap-1">
        {/* Mobile Hamburger button: tap target 44x44px */}
        <button
          onClick={onMenuToggle}
          type="button"
          aria-label="Open sidebar menu"
          className="md:hidden w-11 h-11 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors duration-200"
        >
          <Menu size={22} className="stroke-[2.25]" />
        </button>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight ml-1">
          {getPageTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search: Hidden on mobile/narrow sm viewports */}
        <div className="relative hidden lg:block">
          <Search
            size={18}
            className="absolute left-3.5 top-2.5 text-slate-400 dark:text-gray-500"
          />

          <input
            type="text"
            placeholder="Search leads, tasks..."
            className="pl-10 pr-4 py-2 border border-slate-200 dark:border-gray-700 rounded-xl w-64 bg-white dark:bg-gray-850 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 transition-colors duration-200 text-sm"
          />
        </div>

        <DarkModeToggle />

        {/* Action icons: Hidden on narrow viewports to save header space */}
        <div className="hidden sm:flex items-center gap-4 text-slate-600 dark:text-gray-300">
          <Bell
            size={22}
            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-0.5"
            aria-label="Notifications"
          />

          <Settings
            size={22}
            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 p-0.5"
            aria-label="Settings"
          />
        </div>
      </div>
    </div>
  );
}

export default Header;