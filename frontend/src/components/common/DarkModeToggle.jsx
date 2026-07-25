import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Premium DarkModeToggle component that lets users toggle themes.
 * Uses a rotating and shifting circular button.
 */
export function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      type="button"
      className="w-10 h-10 flex items-center justify-center bg-slate-100/50 dark:bg-slate-850/40 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 text-slate-655 dark:text-slate-350 border border-slate-200/40 dark:border-slate-800/40 rounded-xl cursor-pointer transition-colors relative overflow-hidden focus:outline-none"
      aria-label="Toggle Dark/Light Mode"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isDarkMode ? "dark" : "light"}
          initial={{ y: -15, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 15, opacity: 0, rotate: 90 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="flex items-center justify-center"
        >
          {isDarkMode ? (
            <Moon size={18} className="stroke-[2.25] text-blue-400 fill-blue-500/10" />
          ) : (
            <Sun size={18} className="stroke-[2.25] text-amber-500 fill-amber-500/10" />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}

export default DarkModeToggle;
