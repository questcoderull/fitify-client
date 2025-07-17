import React from "react";
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
import useAuth from "../../../Hooks/useAuth";
import { MdDashboard } from "react-icons/md";

const Navbar = () => {
  const { user, loading, logOutUser } = useAuth();

  const handleLogout = () => {
    logOutUser()
      .then(() => {
        console.log("logged out succesfully");
      })
      .then((error) => {
        console.log(error);
      });
  };

  const links = (
    <>
      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-primary text-white"
                : "text-primary hover:text-white"
            }`
          }
        >
          <FaHome />
          Home
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/all-trainers"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-primary text-white"
                : "text-primary hover:text-white"
            }`
          }
        >
          <FaUserFriends />
          All Trainers
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/all-classes"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-primary text-white"
                : "text-primary hover:text-white"
            }`
          }
        >
          <FaDumbbell />
          All Classes
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/community"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md ${
              isActive
                ? "bg-primary text-white"
                : "text-primary hover:text-white"
            }`
          }
        >
          <FaComments />
          Community
        </NavLink>
      </li>

      {user && (
        <li className="hover:bg-primary rounded-md transition">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-md ${
                isActive
                  ? "bg-primary text-white"
                  : "text-primary hover:text-white"
              }`
            }
          >
            <MdDashboard />
            Dashboard
          </NavLink>
        </li>
      )}
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
              <div className="w-24 rounded-full">
                {/* from gpt */}
                {user && user.photoURL ? (
                  <>
                    <img
                      src={user.photoURL}
                      alt="User profile"
                      className="w-20 h-20 rounded-full object-cover cursor-pointer"
                    />
                  </>
                ) : (
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-[#023047] text-[#FFB703] text-lg font-bold uppercase cursor-default"
                    title={user?.displayName || "User"}
                  >
                    {user?.displayName?.charAt(0) || "U"}
                  </div>
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box shadow mt-3 w-52 p-3 border"
            >
              <li className="mb-2">{user.displayName || "Your Name"}</li>
              <li>
                <button
                  onClick={handleLogout}
                  className="btn btn-neutral w-full"
                >
                  Logout
                </button>
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
              to="/signUP"
              className={({ isActive }) =>
                `btn btn-sm flex items-center gap-2 ${
                  isActive ? "btn-primary text-white" : "btn-outline"
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
