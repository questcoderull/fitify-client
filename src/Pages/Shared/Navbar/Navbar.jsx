import { NavLink } from "react-router";
import {
  FaHome,
  FaDumbbell,
  FaUserFriends,
  FaCalendarAlt,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

import logo from "../../../assets/fitify.png";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 shadow-md sticky top-0 z-50 px-4 md:px-8">
      {/* Navbar Start */}
      <div className="navbar-start">
        <NavLink
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-primary"
        >
          <img src={logo} className="w-10 h-10" alt="Logo" />
          <span className="hidden md:inline">Fitify</span>
        </NavLink>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to="/" className="flex items-center gap-1">
              <FaHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/trainers" className="flex items-center gap-1">
              <FaUserFriends />
              Trainers
            </NavLink>
          </li>
          <li>
            <NavLink to="/classes" className="flex items-center gap-1">
              <FaDumbbell />
              Classes
            </NavLink>
          </li>
          <li>
            <NavLink to="/schedule" className="flex items-center gap-1">
              <FaCalendarAlt />
              Schedule
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end space-x-2">
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `btn btn-sm rounded-md flex items-center gap-2 ${
              isActive ? "btn-primary text-white" : "btn-ghost text-gray-700"
            }`
          }
        >
          <FaSignInAlt />
          Login
        </NavLink>

        <NavLink
          to="/register"
          className={({ isActive }) =>
            `btn btn-sm rounded-md flex items-center gap-2 ${
              isActive ? "btn-accent text-white" : "btn-outline"
            }`
          }
        >
          <FaUserPlus />
          Sign Up
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
