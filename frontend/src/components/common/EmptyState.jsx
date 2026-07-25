import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

/**
 * EmptyState component shown when no leads match search/filter criteria.
 * Upgraded with glass details, scale animations, and premium border elements.
 */
function EmptyState({ totalCount, onClearFilters }) {
  const isEmptyDatabase = totalCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-12 rounded-[20px] border border-slate-200/40 dark:border-slate-800/30 text-center shadow-sm select-none"
    >
      <div className="p-3 bg-slate-100/50 dark:bg-slate-850/50 rounded-2xl border border-slate-200/40 dark:border-slate-700/20 text-slate-400 dark:text-slate-500 mb-4 shadow-inner">
        <Briefcase size={36} className="stroke-[1.75]" />
      </div>
      
      <h3 className="font-extrabold text-slate-950 dark:text-white text-lg tracking-tight">
        {isEmptyDatabase ? "No Opportunities Yet" : "No Opportunities Match"}
      </h3>
      
      <p className="text-xs text-slate-500 dark:text-gray-400 mt-2 max-w-xs leading-relaxed font-semibold">
        {isEmptyDatabase
          ? "Get started by clicking the 'Add New Lead' button above to register your first pipeline lead."
          : "Try refining your search keyword filters or selection tabs to identify what you are tracking."}
      </p>

      {!isEmptyDatabase && (
        <button
          type="button"
          onClick={onClearFilters}
          className="mt-6 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
        >
          Reset Filters
        </button>
      )}
    </motion.div>
  );
}

export default EmptyState;
