import React, { useState } from "react";
import { Link, NavLink } from "react-router";
import {
  FaHome,
  FaUserFriends,
  FaDumbbell,
  FaComments,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import FitifyLogo from "../FitifyLogo/FitifyLogo";

const Navbar = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(false);

  const links = (
    <>
      <li className="hover:bg-[#023047] rounded-md transition">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-[#023047] text-white"
                : "text-[#023047] hover:text-white"
            }`
          }
        >
          <FaHome />
          Home
        </NavLink>
      </li>

      <li className="hover:bg-[#023047] rounded-md transition">
        <NavLink
          to="/trainers"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-[#023047] text-white"
                : "text-[#023047] hover:text-white"
            }`
          }
        >
          <FaUserFriends />
          All Trainers
        </NavLink>
      </li>

      <li className="hover:bg-[#023047] rounded-md transition">
        <NavLink
          to="/classes"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-[#023047] text-white"
                : "text-[#023047] hover:text-white"
            }`
          }
        >
          <FaDumbbell />
          All Classes
        </NavLink>
      </li>

      <li className="hover:bg-[#023047] rounded-md transition">
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-[#023047] text-white"
                : "text-[#023047] hover:text-white"
            }`
          }
        >
          <FaComments />
          Community
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="navbar sticky top-0 z-50 py-4 px-4 md:px-8 bg-white/30 backdrop-blur-md shadow">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box shadow-md z-10 mt-3 w-52 p-2"
          >
            {links}
          </ul>
        </div>
        <Link to="/" className="ml-3">
          <FitifyLogo />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{links}</ul>
      </div>

      <div className="navbar-end">
        {loading ? (
          <span className="loading loading-spinner text-primary"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full bg-[#023047] flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0) || "U"}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box shadow mt-3 w-52 p-3 border"
            >
              <li className="mb-2">{user.displayName || "Your Name"}</li>
              <li>
                <button className="btn btn-neutral w-full">Logout</button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `btn btn-sm flex items-center gap-2 ${
                  isActive ? "btn-primary text-white" : "btn-outline"
                }`
              }
            >
              <FaSignInAlt />
              Login
            </NavLink>

            <NavLink
              to="/register"
              className={({ isActive }) =>
                `btn btn-sm flex items-center gap-2 ${
                  isActive ? "btn-accent text-white" : "btn-outline"
                }`
              }
            >
              <FaUserPlus />
              Sign Up
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
