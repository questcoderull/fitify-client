import React from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate } from "react-router";

const AdminOrTrainerRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || (role !== "admin" && role !== "trainer")) {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" />;
  }

  return children;
};

export default AdminOrTrainerRoute;
