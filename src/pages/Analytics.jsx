function Analytics() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Monthly Leads</h3>
          <p className="text-4xl font-bold mt-2">248</p>
          <p className="text-green-600 mt-2">
            +18% from last month
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-4xl font-bold mt-2">$45,850</p>
          <p className="text-green-600 mt-2">
            +12% growth
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">Conversion Rate</h3>
          <p className="text-4xl font-bold mt-2">24.3%</p>
          <p className="text-green-600 mt-2">
            +2.1% improvement
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4">
          Performance Overview
        </h2>

        <div className="h-64 flex items-end gap-6">
          <div className="bg-blue-500 w-16 h-24 rounded-t"></div>
          <div className="bg-blue-500 w-16 h-40 rounded-t"></div>
          <div className="bg-blue-500 w-16 h-32 rounded-t"></div>
          <div className="bg-blue-500 w-16 h-52 rounded-t"></div>
          <div className="bg-blue-500 w-16 h-44 rounded-t"></div>
          <div className="bg-blue-500 w-16 h-60 rounded-t"></div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;