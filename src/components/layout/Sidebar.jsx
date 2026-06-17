import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="relative w-64 min-h-screen bg-slate-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-10">
        CRM Lite
      </h1>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-3 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }) =>
            `p-3 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Leads
        </NavLink>

        <NavLink
          to="/analytics"
          className={({ isActive }) =>
            `p-3 rounded-lg ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-800"
            }`
          }
        >
          Analytics
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="absolute bottom-5 left-5 right-5">
        <div className="flex items-center gap-3 bg-slate-800 p-3 rounded-xl">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
            SM
          </div>

          <div>
            <h3 className="text-sm font-semibold">
              Sana Mohitha
            </h3>

            <p className="text-xs text-gray-400">
              sana@startup.io
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;