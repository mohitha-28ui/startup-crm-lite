import { useState } from "react";
import { X, Sun, Moon, LogOut, Save, Globe, Eye, EyeOff, Shield, User as UserIcon, BellRing, Settings } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

/**
 * Redesigned Premium SettingsDrawer sliding in from the right viewport boundary.
 * Styled with absolute glassmorphic layers, custom switches, and hover interactions.
 */
export function SettingsDrawer({ isOpen, onClose }) {
  const { isDarkMode, toggleTheme } = useTheme();

  // Settings State variables
  const [profile, setProfile] = useState({
    name: "Alex Carter",
    email: "alex.carter@accelerate.io",
  });
  const [workspace, setWorkspace] = useState("CRM Lite");
  const [timezone, setTimezone] = useState("GMT+05:30 (India Standard Time)");
  const [language, setLanguage] = useState("en");

  // Notifications toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [browserAlerts, setBrowserAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Security credentials
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Save changes handler
  const handleSave = (e) => {
    e.preventDefault();
    toast.success("Preferences updated successfully!", {
      style: {
        background: "var(--toast-success-bg)",
        color: "var(--toast-success-color)",
        border: "1px solid var(--toast-success-border)",
        fontSize: "13px",
        fontWeight: "600",
      },
    });
    onClose();
  };

  // Logout handler
  const handleLogout = () => {
    toast.success("Logged out successfully! Redirecting...");
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const userInitials = (typeof profile?.name === "string" ? profile.name : "")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" role="dialog" aria-modal="true">
          {/* Backdrop Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer slide panel container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="w-full sm:w-[440px] bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-800/40 shadow-2xl flex flex-col h-full z-10 relative"
          >
            {/* Header section */}
            <div className="flex items-center justify-between border-b border-slate-200/40 dark:border-slate-800/30 px-5 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/45">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Settings size={18} className="stroke-[2.25]" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">
                    Settings Preferences
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">Configure your profile & application workspace</p>
                </div>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-xl border border-slate-200/50 dark:border-slate-850 cursor-pointer transition-colors shadow-sm"
                aria-label="Close settings drawer"
              >
                <X size={16} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Form scroll container */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth pr-4">
              
              {/* 1. Profile Settings Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <UserIcon size={12} />
                  <span>Profile Settings</span>
                </h4>
                <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-2xl border border-slate-200/30 dark:border-slate-800/20">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md select-none">
                    {userInitials}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-950 dark:text-white">{profile.name}</h5>
                    <p className="text-[10px] text-slate-450 dark:text-gray-400 font-semibold">{profile.email}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="settings-profile-name" className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Full Name</label>
                    <input
                      id="settings-profile-name"
                      type="text"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all font-semibold"
                      value={profile.name}
                      onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="settings-profile-email" className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Email Address</label>
                    <input
                      id="settings-profile-email"
                      type="email"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all font-semibold"
                      value={profile.email}
                      onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Account & Workspace */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Globe size={12} />
                  <span>Workspace Preferences</span>
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="settings-workspace-name" className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Workspace Title</label>
                    <input
                      id="settings-workspace-name"
                      type="text"
                      required
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all font-semibold"
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="settings-timezone" className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Timezone Offset</label>
                    <select
                      id="settings-timezone"
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-905 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all font-semibold cursor-pointer"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option>GMT+05:30 (India Standard Time)</option>
                      <option>GMT-08:00 (Pacific Standard Time)</option>
                      <option>GMT+00:00 (London GMT Standard Time)</option>
                      <option>GMT+01:00 (Central European Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Theme toggle */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Sun size={12} />
                  <span>Aesthetics & Theme</span>
                </h4>
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/30 bg-slate-50/40 dark:bg-slate-950/20">
                  <div className="flex items-center gap-2">
                    {isDarkMode ? (
                      <Moon size={15} className="text-blue-500" />
                    ) : (
                      <Sun size={15} className="text-yellow-500" />
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Interface Theme Mode
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    aria-label="Toggle Dark Mode"
                    className={`relative flex items-center w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                      isDarkMode ? "bg-blue-600" : "bg-slate-200"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 transform ${
                        isDarkMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 4. Notification Preferences */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <BellRing size={12} />
                  <span>Notification Center</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Email Alerts</h5>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Receive pipeline deal updates.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEmailAlerts(!emailAlerts)}
                      className={`relative flex items-center w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        emailAlerts ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 transform ${
                          emailAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">Toast Notifications</h5>
                      <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Show banner triggers inside app.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBrowserAlerts(!browserAlerts)}
                      className={`relative flex items-center w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                        browserAlerts ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 transform ${
                          browserAlerts ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Security Credentials */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} />
                  <span>Security & Password</span>
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1 relative">
                    <label htmlFor="settings-password-current" className="text-[10px] font-bold text-slate-455 dark:text-slate-400">Current Password</label>
                    <div className="relative">
                      <input
                        id="settings-password-current"
                        type={showPassword ? "text" : "password"}
                        className="w-full text-xs pl-3.5 pr-10 py-2.5 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all font-semibold"
                        placeholder="••••••••"
                        value={passwords.current}
                        onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-655 dark:hover:text-gray-300 cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  onClick={handleLogout}
                  type="button"
                  className="w-full py-2.5 border border-rose-200/50 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                >
                  <LogOut size={13} className="stroke-[2.5]" />
                  Sign Out from Account
                </button>
              </div>

            </form>

            {/* Footer Action buttons */}
            <div className="border-t border-slate-200/40 dark:border-slate-800/30 px-5 py-4 shrink-0 bg-slate-50/50 dark:bg-slate-900/45 flex justify-end gap-3">
              <button
                onClick={onClose}
                type="button"
                className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                type="button"
                className="px-4.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-650 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
              >
                <Save size={13} />
                Save Settings
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default SettingsDrawer;
