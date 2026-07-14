import { useState, useEffect, useRef } from "react";
import { Bell, Settings, Search, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";
import DarkModeToggle from "../common/DarkModeToggle";
import NotificationDropdown from "./NotificationDropdown";
import SettingsDrawer from "./SettingsDrawer";
import toast from "react-hot-toast";

/**
 * Header component featuring search, notifications, theme toggles, and mobile drawer triggers.
 */
function Header({ onMenuToggle }) {
  const location = useLocation();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize mock notifications: empty for production
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);

  // Outside click listener for notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

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

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    toast.success("Notification marked as read");
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

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

      <div className="flex items-center gap-2 sm:gap-4">
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

        {/* Bell Action Button relative container */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            type="button"
            className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors duration-200 relative"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell size={22} className="stroke-[2.25] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-rose-500 border-2 border-white dark:border-gray-900 rounded-full flex items-center justify-center px-1 text-[9px] font-black text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          {isNotifOpen && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
              onClose={() => setIsNotifOpen(false)}
            />
          )}
        </div>

        {/* Settings Action Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          type="button"
          className="w-11 h-11 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl cursor-pointer transition-colors duration-200"
          aria-label="Settings"
        >
          <Settings size={22} className="stroke-[2.25] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
        </button>
      </div>

      {/* Settings Drawer overlay */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default Header;