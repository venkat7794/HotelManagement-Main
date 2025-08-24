import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="relative min-h-screen bg-white border-r w-67">
      <ul className="mt-5 text-black">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 rounded-r-lg ${
              isActive
                ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white border-r-4 border-blue shadow-md`
                : `hover:bg-gray-100`
            }`
          }
        >
         Dashboard
        </NavLink>

        <NavLink
          to="/admin/rooms"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 rounded-r-lg ${
              isActive
                ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white border-r-4 border-blue shadow-md`
                : `hover:bg-gray-100`
            }`
          }
        >
          View All Rooms
        </NavLink>

        <NavLink
          to="/admin/add-room"
          className={({ isActive }) =>
            `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer transition-all duration-300 rounded-r-lg ${
              isActive
                ? `bg-gradient-to-r from-blue-600 to-purple-600 text-white border-r-4 border-blue shadow-md`
                : `hover:bg-gray-100`
            }`
          }
        >
          Add Room
        </NavLink>
      </ul>
    </div>
  );
};

export default Sidebar;