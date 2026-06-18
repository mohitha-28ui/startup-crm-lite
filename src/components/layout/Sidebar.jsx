import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, X } from "lucide-react";

/**
 * Sidebar component supporting collapsible responsive widths and mobile drawers.
 */
function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { path: "/", label: "Dashboard", subLabel: "Overview & KPIs", icon: LayoutDashboard },
    { path: "/leads", label: "Leads", subLabel: "Pipeline deals", icon: Users },
    { path: "/analytics", label: "Analytics", subLabel: "Win rates & charts", icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile Drawer Backdrop Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-white p-5 z-50 transform transition-transform duration-300 w-64 
          md:relative md:translate-x-0 md:min-h-screen md:flex md:flex-col md:p-4 md:w-22 lg:w-64 
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile Close Button (Minimum tap target 44x44px) */}
        <button
          onClick={onClose}
          type="button"
          className="md:hidden absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-colors duration-200"
          aria-label="Close sidebar menu"
        >
          <X size={20} />
        </button>

        {/* Application Logo Section */}
        <h1 className="text-xl lg:text-2xl font-bold mb-10 tracking-tight text-center md:text-left mt-2 md:mt-0">
          <span className="md:hidden lg:inline">CRM Lite</span>
          <span className="hidden md:inline lg:hidden text-blue-500 font-extrabold text-lg">CL</span>
        </h1>

        {/* Main Navigation Links */}
        <nav className="flex flex-col gap-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose} // Auto-close drawer on link click (mobile)
                className={({ isActive }) =>
                  `p-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "hover:bg-slate-800 text-slate-300 hover:text-white"
                  }`
                }
              >
                <div className="flex flex-col lg:flex-row items-center gap-1.5 lg:gap-3.5 w-full text-center lg:text-left">
                  <IconComponent size={20} className="shrink-0 stroke-[2.25]" />
                  <div className="flex flex-col truncate">
                    <span className="text-xs md:text-[10px] lg:text-sm font-semibold tracking-wide">
                      {item.label}
                    </span>
                    {/* Navigation Sub-label (Visible on Mobile Drawer & Desktop Sidebar, Hidden on Tablet Sidebar) */}
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5 hidden lg:block md:hidden">
                      {item.subLabel}
                    </span>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </nav>

        {/* Responsive User Profile Card */}
        <div className="absolute bottom-5 left-4 right-4 md:left-2 md:right-2 lg:left-4 lg:right-4">
          <div className="flex md:flex-col lg:flex-row items-center gap-3 bg-slate-800 p-3 md:p-2 lg:p-3 rounded-xl">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-blue-500/30">
              SM
            </div>

            {/* Profile detail: Hidden on Tablet Sidebar (md), visible on Mobile Drawer & Desktop Sidebar (lg) */}
            <div className="block md:hidden lg:block text-left truncate flex-1">
              <h3 className="text-xs font-semibold truncate text-white leading-tight">
                Sana Mohitha
              </h3>
              <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-none">
                sana@startup.io
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;