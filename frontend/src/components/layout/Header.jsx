import { useState, useEffect, useRef } from "react";
import { Bell, Settings, Search, Menu, Calendar } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DarkModeToggle from "../common/DarkModeToggle";
import NotificationDropdown from "./NotificationDropdown";
import SettingsDrawer from "./SettingsDrawer";
import toast from "react-hot-toast";

/**
 * Header component featuring search, notifications, theme toggles, live date,
 * breadcrumbs, profile avatar, and settings triggers.
 */
function Header({ onMenuToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Initialize mock notifications: empty for production
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);

  // Live date-updating timer
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

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

  const getBreadcrumbs = () => {
    const parts = [{ label: "App", path: "/" }];
    if (location.pathname === "/leads") {
      parts.push({ label: "Leads", path: "/leads" });
    } else if (location.pathname === "/analytics") {
      parts.push({ label: "Analytics", path: "/analytics" });
    } else {
      parts.push({ label: "Overview", path: "/" });
    }
    return (
      <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">
        {parts.map((p, idx) => (
          <div key={p.label} className="flex items-center gap-1">
            {idx > 0 && <span className="text-slate-300 dark:text-slate-700">/</span>}
            <span className={idx === parts.length - 1 ? "text-slate-500 dark:text-slate-400" : "text-slate-400 dark:text-slate-500"}>
              {p.label}
            </span>
          </div>
        ))}
      </div>
    );
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

  const userName = (typeof user?.name === "string" && user.name.trim()) ? user.name : "Sana Mohitha";
  const userInitials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white/60 dark:bg-slate-900/60 border-b border-slate-200/50 dark:border-slate-800/40 px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-xl transition-all duration-300 z-30 sticky top-0">
      <div className="flex flex-col gap-0.5 ml-1">
        {/* Breadcrumb path */}
        {getBreadcrumbs()}

        <div className="flex items-center gap-2">
          {/* Mobile Hamburger button */}
          <button
            onClick={onMenuToggle}
            type="button"
            aria-label="Open sidebar menu"
            className="md:hidden w-9 h-9 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors duration-250"
          >
            <Menu size={20} className="stroke-[2.25]" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live Date display */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-850/50 border border-slate-200/40 dark:border-slate-800/40 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-350 shadow-sm">
          <Calendar size={13} className="text-blue-500 stroke-[2.25]" />
          <span>{formattedDate}</span>
        </div>

        {/* Search Bar */}
        <div className="relative hidden lg:block">
          <Search
            size={16}
            className="absolute left-3.5 top-2.5 text-slate-400 dark:text-gray-500 stroke-[2.25]"
          />
          <input
            type="text"
            placeholder="Search leads, pipeline..."
            className="pl-10 pr-4 py-2 border border-slate-200/60 dark:border-slate-800 rounded-xl w-60 bg-white/50 dark:bg-slate-900/30 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-slate-800/50 transition-all duration-300 text-xs font-medium"
          />
        </div>

        <DarkModeToggle />

        {/* Bell Action Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            type="button"
            className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors duration-200 relative"
            aria-label="Notifications"
          >
            <div className="relative">
              <Bell size={20} className="stroke-[2.25] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center px-1 text-[9px] font-black text-white">
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
          className="w-10 h-10 flex items-center justify-center text-slate-500 dark:text-gray-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors duration-250"
          aria-label="Settings"
        >
          <Settings size={20} className="stroke-[2.25] text-slate-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
        </button>

        {/* Top Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow border border-white/20 hidden md:flex shrink-0 select-none">
          {userInitials}
        </div>
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