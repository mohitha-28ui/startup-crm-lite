function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-8 rounded-3xl shadow-lg">
      <span className="bg-indigo-700 px-4 py-2 rounded-full text-sm">
        Startup CRM Lite Active
      </span>

      <h1 className="text-5xl font-bold mt-4">
        Welcome back, Sana!
      </h1>

      <p className="text-gray-300 mt-4 text-lg">
        Your CRM has captured 24 new leads today.
        Check your latest analytics and target summaries below.
      </p>
    </div>
  );
}

export default HeroSection;