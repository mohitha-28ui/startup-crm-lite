/**
 * LoadingSkeleton component displaying pulse animations.
 *
 * @component
 * @returns {React.JSX.Element} The rendered LoadingSkeleton page component.
 */
export function LoadingSkeleton() {
  return (
    <div className="p-6 bg-slate-50 dark:bg-gray-950 min-h-screen space-y-6 animate-pulse transition-colors duration-200">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 dark:border-gray-850 pb-5">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-72 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
      </div>

      {/* KPI Cards Skeleton (6 items) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm space-y-3">
            <div className="h-4 w-20 bg-slate-200 dark:bg-gray-800 rounded"></div>
            <div className="h-8 w-24 bg-slate-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-3 w-16 bg-slate-200 dark:bg-gray-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* Primary Charts Skeleton Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm h-80 flex flex-col justify-between">
          <div className="h-5 w-36 bg-slate-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full flex justify-center items-center h-48 bg-slate-100/50 dark:bg-gray-800/40 rounded-xl">
            <div className="rounded-full h-32 w-32 border-8 border-slate-200 dark:border-gray-800 border-t-slate-300 dark:border-t-gray-750"></div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm h-80 flex flex-col justify-between">
          <div className="h-5 w-40 bg-slate-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full h-48 bg-slate-100/50 dark:bg-gray-800/40 rounded-xl flex items-end p-4 gap-4">
            <div className="h-12 w-full bg-slate-200 dark:bg-gray-800 rounded-t"></div>
            <div className="h-28 w-full bg-slate-200 dark:bg-gray-800 rounded-t"></div>
            <div className="h-36 w-full bg-slate-200 dark:bg-gray-800 rounded-t"></div>
            <div className="h-24 w-full bg-slate-200 dark:bg-gray-800 rounded-t"></div>
            <div className="h-40 w-full bg-slate-200 dark:bg-gray-800 rounded-t"></div>
          </div>
        </div>
      </div>

      {/* Secondary Charts Skeleton Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm h-80 flex flex-col justify-between">
          <div className="h-5 w-36 bg-slate-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full h-48 bg-slate-100/50 dark:bg-gray-800/40 rounded-xl"></div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm h-80 flex flex-col justify-between">
          <div className="h-5 w-36 bg-slate-200 dark:bg-gray-800 rounded"></div>
          <div className="w-full h-48 bg-slate-100/50 dark:bg-gray-800/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
