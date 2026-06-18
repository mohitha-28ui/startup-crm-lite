import { Briefcase } from "lucide-react";

/**
 * EmptyState component shown when no leads match search/filter criteria.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {number} props.totalCount - Total number of leads in the system.
 * @param {function} props.onClearFilters - Resets search and filter to defaults.
 * @returns {React.JSX.Element} The rendered EmptyState component.
 */
function EmptyState({ totalCount, onClearFilters }) {
  const isEmptyDatabase = totalCount === 0;

  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
      <Briefcase size={40} className="text-slate-300 stroke-[1.5] mb-3" />
      <h3 className="font-bold text-slate-800 text-lg">
        {isEmptyDatabase ? "No leads yet" : "No leads found"}
      </h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">
        {isEmptyDatabase
          ? "Get started by clicking the Add New Lead button above to register your first opportunity."
          : "Try adjusting your search keywords or status filters to find what you're looking for."}
      </p>
      {!isEmptyDatabase && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 text-sm font-semibold text-blue-600 hover:text-blue-700 border border-blue-200 hover:border-blue-300 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;
