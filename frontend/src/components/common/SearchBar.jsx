import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar component with debounced search input.
 * Upgraded with custom focused shadows and glass layouts.
 */
function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  useEffect(() => {
    const timer = setTimeout(() => onChange(localValue), 300);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className="relative flex-1">
      <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400 dark:text-gray-500 pointer-events-none stroke-[2.25]" />
      <input
        type="text"
        placeholder="Search leads by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-11 pr-10 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/40 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 focus:border-blue-500 transition-all duration-300 text-xs font-semibold"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-3 p-0.5 text-slate-400 dark:text-gray-500 hover:text-slate-700 dark:hover:text-gray-250 transition-colors duration-200 cursor-pointer"
          aria-label="Clear search"
        >
          <X size={14} className="stroke-[2.5]" />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
