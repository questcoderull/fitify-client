import React, { Children } from "react";
import useAuth from "../Hooks/useAuth";
import { Navigate } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  if (!user || role !== "admin") {
    return (
      <Navigate state={{ from: location.pathname }} to="/forbidden"></Navigate>
    );
  }

  return children;
};

export default AdminRoute;
