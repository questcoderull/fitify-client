import React from "react";
import useAuth from "../../../Hooks/useAuth";
import MemberDashboard from "./MemberDashboard";
import TrainerDashboard from "./TrainerDashboard";
import AdminDashboard from "./AdminDashboard";
import ForbiddenPage from "../../ForbiddenPage/ForbiddebPage";

const DashboardHome = () => {
  const { role } = useAuth();

  if (!role) {
    return <p className="text-center my-20">Dashboard home is loding...</p>;
  }

  if (role === "member") {
    return <MemberDashboard></MemberDashboard>;
  } else if (role === "trainer") {
    return <TrainerDashboard></TrainerDashboard>;
  } else if (role === "admin") {
    return <AdminDashboard></AdminDashboard>;
  } else {
    return <ForbiddenPage></ForbiddenPage>;
  }
};

export default DashboardHome;
