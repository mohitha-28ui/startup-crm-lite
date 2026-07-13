import { useState } from "react";
import { X, Sun, Moon, LogOut, Save, Globe, Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import toast from "react-hot-toast";

/**
 * SettingsDrawer sliding in from the right viewport boundary.
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
    toast.success("Changes saved successfully!");
    onClose();
  };

  // Logout handler
  const handleLogout = () => {
    toast.success("Logged out successfully! Redirecting...");
    setTimeout(() => {
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="settings-drawer-title" role="dialog" aria-modal="true">
      {/* Backdrop backdrop blur click overlay */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer slide panel container */}
        <div className="w-screen sm:w-[420px] bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Header section */}
          <div className="flex items-center justify-between border-b border-slate-150 dark:border-gray-850 px-5 py-4 shrink-0 bg-slate-50/50 dark:bg-gray-900/50">
            <div>
              <h3 id="settings-drawer-title" className="text-base font-extrabold text-slate-900 dark:text-white">
                Account Settings
              </h3>
              <p className="text-[11px] text-slate-400 dark:text-gray-500">Configure your profile and application preferences</p>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 rounded-xl border border-slate-200 dark:border-gray-800 cursor-pointer transition-colors shadow-sm"
              aria-label="Close settings drawer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form scroll container */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* 1. Profile Settings Section */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Profile Settings
              </h4>
              <div className="flex items-center gap-4 bg-slate-50/50 dark:bg-gray-800/20 p-3 rounded-xl border border-slate-100 dark:border-gray-850">
                <div className="h-12 w-12 rounded-full bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md shadow-blue-500/10">
                  {(typeof profile?.name === "string" ? profile.name : "")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-white">{profile.name}</h5>
                  <p className="text-[10px] text-slate-400 dark:text-gray-500 font-medium">Administrator ({profile.email})</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="settings-profile-name" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">Full Name</label>
                  <input
                    id="settings-profile-name"
                    type="text"
                    required
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:border-blue-400 dark:focus:border-gray-700 transition-all font-semibold"
                    value={profile.name}
                    onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="settings-profile-email" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">Email Address</label>
                  <input
                    id="settings-profile-email"
                    type="email"
                    required
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:border-blue-400 dark:focus:border-gray-700 transition-all font-semibold"
                    value={profile.email}
                    onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* 2. Account & Workspace */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Account Preferences
              </h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label htmlFor="settings-workspace-name" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">Workspace Name</label>
                  <input
                    id="settings-workspace-name"
                    type="text"
                    required
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:border-blue-400 dark:focus:border-gray-700 transition-all font-semibold"
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="settings-timezone" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">Timezone</label>
                  <select
                    id="settings-timezone"
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 focus:border-blue-400 dark:focus:border-gray-700 transition-all font-semibold cursor-pointer"
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

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* 3. Theme & Aesthetics settings */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Aesthetics & Theme
              </h4>
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-gray-850 bg-slate-50/40 dark:bg-gray-850/20">
                <div className="flex items-center gap-2">
                  {isDarkMode ? (
                    <Moon size={16} className="text-blue-400" />
                  ) : (
                    <Sun size={16} className="text-yellow-500" />
                  )}
                  <span className="text-xs font-bold text-slate-800 dark:text-gray-200">
                    Application Theme
                  </span>
                </div>
                {/* Switch button toggle */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle Dark Mode"
                  className="relative flex items-center justify-between w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none"
                >
                  <div
                    className={`w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow transition-transform duration-300 transform ${
                      isDarkMode ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* 4. Notification Preferences */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Notification Preferences
              </h4>
              <div className="space-y-3">
                {/* Switch 1: Email alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200">Email Notifications</h5>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Receive deal assignments and weekly metrics.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    aria-label="Toggle email notifications"
                    className={`relative flex items-center w-11 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                      emailAlerts ? "bg-blue-600" : "bg-slate-250 dark:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-300 transform ${
                        emailAlerts ? "translate-x-5.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 2: Browser Alerts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200">In-App Browser Alerts</h5>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Display toast banners for scheduled events.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBrowserAlerts(!browserAlerts)}
                    aria-label="Toggle browser notifications"
                    className={`relative flex items-center w-11 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                      browserAlerts ? "bg-blue-600" : "bg-slate-250 dark:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-300 transform ${
                        browserAlerts ? "translate-x-5.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Switch 3: Weekly digests */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800 dark:text-gray-200">Weekly Summary Reports</h5>
                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-0.5">Receive pipeline forecast emails on Monday.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWeeklyDigest(!weeklyDigest)}
                    aria-label="Toggle weekly summary reports"
                    className={`relative flex items-center w-11 h-5.5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${
                      weeklyDigest ? "bg-blue-600" : "bg-slate-250 dark:bg-gray-700"
                    }`}
                  >
                    <div
                      className={`w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-300 transform ${
                        weeklyDigest ? "translate-x-5.5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* 5. Security Credentials */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Security & Password
              </h4>
              <div className="space-y-3">
                <div className="space-y-1 relative">
                  <label htmlFor="settings-password-current" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">Current Password</label>
                  <div className="relative">
                    <input
                      id="settings-password-current"
                      type={showPassword ? "text" : "password"}
                      className="w-full text-xs pl-3.5 pr-10 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 transition-all font-semibold"
                      placeholder="••••••••"
                      value={passwords.current}
                      onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide current password" : "Show current password"}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-gray-300 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="settings-password-new" className="text-[11px] font-bold text-slate-500 dark:text-gray-400">New Password</label>
                  <input
                    id="settings-password-new"
                    type={showPassword ? "text" : "password"}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 transition-all font-semibold"
                    placeholder="Min. 8 characters"
                    value={passwords.new}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* 6. Language selections */}
            <div className="space-y-3.5">
              <h4 className="text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                Language Selection
              </h4>
              <div className="relative">
                <Globe size={14} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-gray-500" />
                <label htmlFor="settings-language" className="sr-only">Language Selection</label>
                <select
                  id="settings-language"
                  className="w-full text-xs pl-10 pr-4 py-2.5 border border-slate-200 dark:border-gray-850 bg-white dark:bg-gray-850 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800 transition-all font-semibold cursor-pointer"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    toast.success(`Language changed to ${e.target.value === "en" ? "English" : e.target.value === "hi" ? "Hindi" : "Spanish"}`);
                  }}
                >
                  <option value="en">English (US)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="es">Spanish (Español)</option>
                </select>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-gray-850" />

            {/* Logout button */}
            <button
              onClick={handleLogout}
              type="button"
              className="w-full py-3 border border-red-200 dark:border-red-950/60 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 shadow-sm"
            >
              <LogOut size={14} />
              Sign Out from Account
            </button>
          </form>

          {/* Footer Save Changes triggers */}
          <div className="border-t border-slate-150 dark:border-gray-850 px-5 py-4 shrink-0 bg-slate-50/50 dark:bg-gray-900/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              type="button"
              className="px-4.5 py-2.5 border border-slate-200 dark:border-gray-800 text-slate-600 dark:text-gray-300 font-bold hover:bg-slate-100 dark:hover:bg-gray-800 rounded-xl text-xs cursor-pointer transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              type="button"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-md shadow-blue-500/10"
            >
              <Save size={14} />
              Save Preferences
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default SettingsDrawer;
