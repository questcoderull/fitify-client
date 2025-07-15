import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { data, Link } from "react-router";

const SignUp = () => {
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
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left flex-1">
          <h className="text-2xl">Lottie animation will be here</h>
          {/* <Lottie animationData={resterAnimation} loop={true}></Lottie> */}
        </div>
        <div className="card bg-base-100 w-full lg:w-11/12 shrink-0 shadow-lg flex-1">
          <div className="card-body py-10">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
              Sign Up now!
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="fieldset">
              <label className="label">Name</label>
              <input
                {...register("name", { required: true })}
                type="text"
                className="input w-full"
                placeholder="Name"
              />

              {errors.photo?.type === "required" && (
                <p className="text-secondary">Name is requred</p>
              )}

              {/* Email */}
              <label className="label">Email</label>
              <input
                type="email"
                {...register("email", { required: true })}
                className="input w-full"
                placeholder="Email"
              />
              {errors.photo?.type === "required" && (
                <p className="text-secondary">Email is requred</p>
              )}

              {/* photo */}
              <label className="label">Photo</label>
              <input
                {...register("photo", { required: true })}
                type="file"
                className="input w-full"
                placeholder="Photo"
              />

              {errors.photo?.type === "required" && (
                <p className="text-secondary">Photo is requred</p>
              )}

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

              {/* showing error message for password */}
              {errors.password?.type === "required" && (
                <p className="text-secondary">Password is requred</p>
              )}
              {errors.password?.type === "minLength" && (
                <p className="text-secondary">
                  Password must be 6 charecter or longer
                </p>
              )}

              <button className="btn btn-primary mt-4 ">Sign Up</button>
            </form>

            <h className="text-2xl">Social login will be here</h>

            <p className="mt-3">
              Already have an account?{" "}
              <Link className="text-blue-900 underline" to="/logIn">
                LogIn
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
