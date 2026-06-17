import { Bell, Settings, Search } from "lucide-react";

function Header() {
  return (
    <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <h2 className="text-3xl font-bold">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search leads, tasks..."
            className="pl-10 pr-4 py-2 border rounded-xl w-72"
          />
        </div>

        <Bell
          size={22}
          className="cursor-pointer text-gray-600"
        />

        <Settings
          size={22}
          className="cursor-pointer text-gray-600"
        />
      </div>
    </div>
  );
}

export default Header;