/**
 * LoadingSkeleton component displaying pulse animations.
 * Redesigned to align with the glassmorphism card templates.
 */
export function LoadingSkeleton() {
  return (
    <div className="p-6 bg-slate-50 dark:bg-[#0B0F19] min-h-screen space-y-6 animate-pulse transition-colors duration-300">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/40 dark:border-slate-800/30 pb-5">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200/60 dark:bg-slate-800/40 rounded-xl"></div>
          <div className="h-4.5 w-72 bg-slate-200/60 dark:bg-slate-800/40 rounded-xl"></div>
        </div>
        <div className="h-9 w-32 bg-slate-200/60 dark:bg-slate-800/40 rounded-xl"></div>
      </div>

      {/* KPI Cards Skeleton (6 items) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 rounded-[20px] border border-slate-200/40 dark:border-slate-800/30 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-200/60 dark:bg-slate-800/40 rounded"></div>
                <div className="h-7 w-20 bg-slate-200/60 dark:bg-slate-800/40 rounded-lg"></div>
              </div>
              <div className="h-9 w-9 bg-slate-200/60 dark:bg-slate-800/40 rounded-xl"></div>
            </div>
            <div className="h-3.5 w-24 bg-slate-200/60 dark:bg-slate-800/40 rounded mt-2"></div>
          </div>
        ))}
      </div>

      {/* Primary Charts Skeleton Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] border border-slate-200/40 dark:border-slate-800/30 h-96 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 w-36 bg-slate-200/60 dark:bg-slate-800/40 rounded"></div>
            <div className="h-3.5 w-60 bg-slate-200/60 dark:bg-slate-800/40 rounded"></div>
          </div>
          <div className="w-full flex justify-center items-center h-52 bg-slate-100/30 dark:bg-slate-850/20 rounded-xl">
            <div className="rounded-full h-32 w-32 border-[6px] border-slate-200/40 dark:border-slate-800/30 border-t-slate-350 dark:border-t-slate-700 animate-spin"></div>
          </div>
        </div>
        <div className="gradient-border-card bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-[20px] border border-slate-200/40 dark:border-slate-800/30 h-96 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 bg-slate-200/60 dark:bg-slate-800/40 rounded"></div>
            <div className="h-3.5 w-56 bg-slate-200/60 dark:bg-slate-800/40 rounded"></div>
          </div>
          <div className="w-full h-52 bg-slate-100/30 dark:bg-slate-850/20 rounded-xl flex items-end p-4 gap-4">
            <div className="h-12 w-full bg-slate-200/60 dark:bg-slate-800/40 rounded-t-lg"></div>
            <div className="h-28 w-full bg-slate-200/60 dark:bg-slate-800/40 rounded-t-lg"></div>
            <div className="h-36 w-full bg-slate-200/60 dark:bg-slate-800/40 rounded-t-lg"></div>
            <div className="h-24 w-full bg-slate-200/60 dark:bg-slate-800/40 rounded-t-lg"></div>
            <div className="h-40 w-full bg-slate-200/60 dark:bg-slate-800/40 rounded-t-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
