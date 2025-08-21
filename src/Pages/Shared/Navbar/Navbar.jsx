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
import { IoIosArrowDown } from "react-icons/io";
import FitifyLogo from "../FitifyLogo/FitifyLogo";
import useAuth from "../../../Hooks/useAuth";
import { MdDashboard, MdOutlineLogin, MdOutlineLogout } from "react-icons/md";
import { GiMuscleUp } from "react-icons/gi";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, role, loading, logOutUser } = useAuth();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logOutUser()
          .then(() => {
            Swal.fire(
              "Logged Out!",
              "You have been successfully logged out.",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              error.message || "Something went wrong.",
              "error"
            );
          });
      }
    });
  };

  const links = (
    <>
      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
        >
          <FaHome />
          Home
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/all-trainers"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
        >
          <FaUserFriends />
          All Trainers
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/all-classes"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
        >
          <FaDumbbell />
          All Classes
        </NavLink>
      </li>

      <li className="hover:bg-primary rounded-md transition">
        <NavLink
          to="/community"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
        >
          <FaComments />
          Community
        </NavLink>
      </li>

      {user && (
        <>
          <li className="hover:bg-primary rounded-md transition">
            <NavLink
              to="/dashboard/home"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
            >
              <MdDashboard />
              Dashboard
            </NavLink>
          </li>

          <li className="hover:bg-primary rounded-md transition">
            <NavLink
              to="/be-trainer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
            >
              <GiMuscleUp />
              Be a trainer
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className=" sticky top-0 z-50 py-4 bg-white/30 backdrop-blur-md shadow">
      <div className="navbar max-w-7xl mx-auto">
        <div className="navbar-start">
          <span className="ml-3">
            <FitifyLogo />
          </span>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">{links}</ul>
        </div>

        <div className="navbar-end gap-3">
          {loading ? (
            <span className="loading loading-spinner text-primary"></span>
          ) : user ? (
            <div className="dropdown dropdown-end hidden lg:block">
              <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 cursor-pointer"
              >
                {/* Avatar with ring */}
                <div className="avatar">
                  <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img
                      src={
                        user?.photoURL ||
                        "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                      }
                      alt="User Avatar"
                    />
                  </div>
                </div>
                <IoIosArrowDown className="text-lg text-gray-600" />
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-4 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-60 border border-primary"
              >
                <li className="flex items-center gap-3 border-b pb-3 mb-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        src={
                          user?.photoURL ||
                          "https://img.daisyui.com/images/profile/demo/spiderperson@192.webp"
                        }
                        alt="User"
                      />
                    </div>
                  </div>

                  <p className="font-semibold text-sm">
                    {user.displayName || "User"}
                  </p>

                  {/* <p className="text-xs text-gray-500 -mt-5">{role}</p> */}
                  <p className="text-xs -mt-4">
                    <span
                      className={`badge badge-sm text-white ${
                        role === "admin"
                          ? "bg-primary"
                          : role === "trainer"
                          ? "bg-secondary"
                          : "bg-green-500"
                      }`}
                    >
                      {role}
                    </span>
                  </p>
                </li>
                <li>
                  <Link to="/dashboard/home" className="text-sm">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard/my-profile" className="text-sm">
                    My Profile
                  </Link>
                </li>
                <li className="mt-2">
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm w-full btn-outline text-red-500 hover:text-white hover:bg-red-500"
                  >
                    <MdOutlineLogout className="text-lg" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
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

          {/* Mobile Hamburger Dropdown */}
          <div className="dropdown dropdown-end lg:hidden">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-secondary text-white"
            >
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
              className="menu menu-sm dropdown-content mt-3 p-3 shadow bg-white text-gray-800 rounded-box w-56 right-0 border border-gray-200 z-50"
            >
              {links}

              {user ? (
                <>
                  <li className="mt-2 border-t pt-2">
                    <Link to="/dashboard">Dashboard</Link>
                  </li>
                  <li>
                    <Link to="/dashboard/my-profile">My Profile</Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm w-full btn-outline text-red-500 hover:text-white hover:bg-red-500 mt-2"
                    >
                      <MdOutlineLogout className="text-lg" />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="mt-2 border-t pt-2">
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signUP">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* theme controller */}
          <label className="toggle text-base-content">
            <input type="checkbox" value="dark" className="theme-controller" />

            <svg
              aria-label="sun"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </g>
            </svg>

            <svg
              aria-label="moon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2"
                fill="none"
                stroke="currentColor"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </g>
            </svg>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
