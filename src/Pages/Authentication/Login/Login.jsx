import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router";
import FitifyLogo from "../../Shared/FitifyLogo/FitifyLogo";
import { useForm } from "react-hook-form";
import SocialLogin from "../SocialLogin/SocialLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left flex-1">
          <h className="text-2xl">Lottie animation will be here</h>
          {/* <Lottie animationData={loginAnimation} loop={true}></Lottie> */}
        </div>
        <div className="card bg-base-100 w-full lg:w-11/12 shrink-0 shadow-lg flex-1">
          <div className="card-body py-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
              Log In now!
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email")}
                className="input w-full"
                placeholder="Email"
              />

              {/* Password */}
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input input-bordered flex items-center justify-between w-full px-3 py-2 gap-2">
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="flex-grow bg-transparent outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-600 cursor-pointer"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password?.type === "required" && (
                <p className="text-secondary">Password is requred</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-secondary">
                  Password must be 6 charecter or longer
                </p>
              )}

              <button className="btn btn-primary mt-4">Login</button>
            </form>

            <SocialLogin></SocialLogin>

            <p className="mt-3">
              Don't have an account?{" "}
              <Link className="text-blue-900 underline" to="/signUp">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
