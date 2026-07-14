import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * DarkModeToggle component that lets users toggle between light and dark themes.
 *
 * @component
 * @returns {React.JSX.Element} The rendered DarkModeToggle component.
 */
export function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-500 dark:text-gray-400 select-none hidden sm:inline">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
      <button
        onClick={toggleTheme}
        type="button"
        aria-label="Toggle Dark Mode"
        className="relative flex items-center justify-between w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-gray-800"
      >
        <Sun size={12} className="text-yellow-500 z-10 ml-0.5" />
        <Moon size={12} className="text-slate-400 dark:text-slate-300 z-10 mr-0.5" />
        
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transition-all duration-300 transform flex items-center justify-center ${
            isDarkMode ? "translate-x-7" : "translate-x-0"
          }`}
        >
          {isDarkMode ? (
            <Moon size={10} className="text-blue-400 fill-blue-400/20" />
          ) : (
            <Sun size={10} className="text-yellow-500 fill-yellow-500/20" />
          )}
        </div>
      </button>
    </div>
  );
}

export default DarkModeToggle;
