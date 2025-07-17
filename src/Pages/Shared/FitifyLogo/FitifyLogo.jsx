import React from "react";
import logo from "../../../assets/fitify-log2.png";
import { Link } from "react-router";

const FitifyLogo = () => {
  return (
    <Link to="/">
      <div class=" normal-case text-xl flex items-center">
        <img src={logo} alt="fitify" className="h-10 w-auto" />
        <span className="hidden md:block text-primary text-4xl font-bold">
          itify
        </span>
      </div>
    </Link>
  );
};

export default FitifyLogo;
