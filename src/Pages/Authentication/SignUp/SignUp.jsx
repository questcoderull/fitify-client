import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaFire } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import useAuth from "../../../Hooks/useAuth";
import SocialLogin from "../SocialLogin/SocialLogin";
import axios from "axios";
import useAxios from "../../../Hooks/useAxios";
import Swal from "sweetalert2";

const SignUp = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const navigate = useNavigate();
  const axiosInstance = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    createUser(data.email, data.password)
      .then(async (result) => {
        const userInfo = {
          name: data.name,
          email: data.email,
          profilePic: profilePic,
          role: "member",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userInfo);

        // Firebase profile update
        const userProfile = {
          displayName: data.name,
          photoURL: profilePic,
        };

        updateUserProfile(userProfile)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Registration Successful!",
              text: "Welcome to Fitify 🎉",
              showConfirmButton: false,
              timer: 2000,
            });

            navigate("/");
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Profile Update Failed",
              text:
                error.message ||
                "Something went wrong while updating your profile.",
            });
          });
      })
      .catch((error) => {
        let customMsg = "Something went wrong during registration.";

        if (error.message.includes("auth/email-already-in-use")) {
          customMsg = "This email is already registered.";
        } else if (error.message.includes("auth/invalid-email")) {
          customMsg = "Invalid email address.";
        } else if (error.message.includes("auth/weak-password")) {
          customMsg = "Password should be at least 6 characters.";
        }

        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: customMsg,
        });
      });
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    // console.log(image);
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;

    const res = await axios.post(imageUploadUrl, formData);
    setProfilePic(res.data.data.url);
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-left flex-1">
          {/* right side */}
          <div className="space-y-5 text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary flex items-center gap-3 justify-center lg:justify-start">
              <FaFire className="text-red-500 animate-pulse" />
              Welcome to <span className="text-secondary">Fitify</span>
            </h2>
            <p className="text-gray-700 text-lg font-medium">
              Your fitness journey begins{" "}
              <span className="text-primary font-bold">today</span> — not
              tomorrow!
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>🔥 Book expert trainers on your schedule</li>
              <li>📅 Join powerful group classes daily</li>
              <li>🌟 Share your fitness quotes & inspire others</li>
              <li>🧠 Read and post in our active forum</li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-gray-500 italic">
                "The body achieves what the mind believes." – Start strong with
                Fitify!
              </p>
            </div>
          </div>
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

              {errors.name?.type === "required" && (
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
              {errors.email?.type === "required" && (
                <p className="text-secondary">Email is requred</p>
              )}

              {/* photo */}
              <label className="label">Photo</label>
              <input
                {...register("photo", { required: true })}
                onChange={handleImageUpload}
                type="file"
                accept="image/*"
                className="file-input w-full"
                placeholder="Photo"
              />
              {errors.photo?.type === "required" && (
                <p className="text-secondary">Photo is required</p>
              )}

              {/* Password */}
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="input input-bordered flex items-center justify-between w-full px-3 py-2 gap-2">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
                      message:
                        "Must include uppercase, lowercase & a special character",
                    },
                  })}
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

              {/* 🔴 Error Message */}
              {errors.password && (
                <p className="text-secondary text-sm mt-1">
                  {errors.password.message}
                </p>
              )}

              {/* ℹ️ Password Hint */}
              <p className="text-xs text-gray-500 mt-1">
                Must include at least 1 uppercase, 1 lowercase & 1 special
                character.
              </p>
              <button className="btn btn-primary mt-4 ">Sign Up</button>
            </form>

            <SocialLogin></SocialLogin>

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
