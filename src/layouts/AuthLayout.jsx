import React from "react";
import { Outlet } from "react-router";
import FitifyLogo from "../Pages/Shared/FitifyLogo/FitifyLogo";

const AuthLayout = () => {
  return (
    <div className="max-w-11/12 mx-auto my-5.5">
      <div className="ml-11">
        <FitifyLogo></FitifyLogo>
      </div>
      <Outlet></Outlet>
    </div>
  );
};

export default AuthLayout;
