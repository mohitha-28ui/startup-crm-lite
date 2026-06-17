function QuickTasks() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">
        Quick Tasks
      </h2>

      <div className="space-y-3">
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
          Add New Lead
        </button>

        <button className="w-full bg-green-600 text-white p-3 rounded-lg">
          Review Analytics
        </button>

        <button className="w-full bg-purple-600 text-white p-3 rounded-lg">
          Create Report
        </button>
      </div>
    </div>
  );
}

export default QuickTasks;