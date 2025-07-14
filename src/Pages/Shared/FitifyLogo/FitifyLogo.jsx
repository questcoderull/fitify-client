import React from "react";
import logo from "../../../assets/fitify-log2.png";

const FitifyLogo = () => {
  return (
    <div class=" normal-case text-xl flex items-center">
      <img src={logo} alt="fitify" className="h-10 w-auto" />
      <span className="hidden md:block text-[#F77F00] text-4xl font-bold">
        itify
      </span>
    </div>
  );
};

export default FitifyLogo;
