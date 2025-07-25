import React from "react";
import {
  MdAdminPanelSettings,
  MdEventAvailable,
  MdForum,
  MdOutlineAddBox,
  MdOutlineHistory,
  MdPeopleAlt,
  MdPerson,
} from "react-icons/md";
import { NavLink, Outlet } from "react-router";
import FitifyLogo from "../Pages/Shared/FitifyLogo/FitifyLogo";
import { FaMoneyCheckAlt, FaUserCheck, FaUserClock } from "react-icons/fa";
import { GiWeightLiftingUp } from "react-icons/gi";
import { BiTimeFive } from "react-icons/bi";
import useAuth from "../Hooks/useAuth";

const DashboardLayout = () => {
  const { role } = useAuth();

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 w-full lg:hidden">
          <div className="flex-none ">
            <label
              htmlFor="my-drawer-2"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2">Dashboard</div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
        {/* Page content here */}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4 space-y-2">
          <div className="mb-5 pl-2">
            <FitifyLogo></FitifyLogo>
          </div>
          {/* Sidebar content here */}
          <li className="hover:bg-primary rounded-md transition">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
            >
              <MdOutlineAddBox />
              Home
            </NavLink>
          </li>

          {/* admin links */}
          {role === "admin" && (
            <>
              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/add-class"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdOutlineAddBox />
                  Add Class
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/all-subscribers"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdPeopleAlt />
                  All Subscribers
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/trainers"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <GiWeightLiftingUp />
                  Trainers
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/pending-trainers"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <FaUserClock />
                  Pending Trainers
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/balance-overview"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <FaMoneyCheckAlt />
                  Balance
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/make-admin"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdAdminPanelSettings className="text-lg" />
                  Make Admin
                </NavLink>
              </li>
            </>
          )}

          {/* links for admin and trainer */}
          {(role === "admin" || role === "trainer") && (
            <>
              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/add-forum"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdForum />
                  Add Forum
                </NavLink>
              </li>
            </>
          )}

          {/* links for trainers only */}
          {role === "trainer" && (
            <>
              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/add-slot"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdEventAvailable />
                  Add Slot
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/manage-slots"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <BiTimeFive className="text-lg" />
                  Manage slots
                </NavLink>
              </li>
            </>
          )}

          {/* link for only member */}
          {role === "member" && (
            <>
              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/activity-log"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <MdOutlineHistory className="text-lg" />
                  Activity Log
                </NavLink>
              </li>

              <li className="hover:bg-primary rounded-md transition">
                <NavLink
                  to="/dashboard/booked-trainer"
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
                >
                  <FaUserCheck className="text-lg" />
                  My Booked Trainers
                </NavLink>
              </li>
            </>
          )}
          <li className="hover:bg-primary rounded-md transition">
            <NavLink
              to="/dashboard/my-profile"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-primary hover:text-white"
            >
              <MdPerson className="text-lg" />
              My Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
