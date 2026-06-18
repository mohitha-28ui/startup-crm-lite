import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * SearchBar component with debounced search input.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} props.value - Debounced search query owned by parent.
 * @param {function} props.onChange - Called 300ms after user stops typing.
 * @returns {React.JSX.Element} The rendered SearchBar component.
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
      <Search size={18} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
      <input
        type="text"
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full pl-11 pr-10 py-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-sm"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-3.5 p-0.5 text-slate-400 hover:text-slate-600 transition-colors duration-200 cursor-pointer"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
