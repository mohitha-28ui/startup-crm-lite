import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="flex gap-6">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/leads">Leads</NavLink>
        <NavLink to="/analytics">Analytics</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;