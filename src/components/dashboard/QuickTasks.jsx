function QuickTasks() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-100 dark:border-gray-800 p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
        Quick Tasks
      </h2>

      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg cursor-pointer transition-colors duration-200">
          Add New Lead
        </button>

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg cursor-pointer transition-colors duration-200">
          Review Analytics
        </button>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg cursor-pointer transition-colors duration-200">
          Create Report
        </button>
      </div>
    </div>
  );
}

export default QuickTasks;