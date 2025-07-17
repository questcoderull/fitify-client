import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useAxios from "../../../Hooks/useAxios";

const Newsletter = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const axiosInstance = useAxios();

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post("/subscribes", {
        name: data.name,
        email: data.email,
      });

      toast.success(res.data.message || "Subscribed successfully!");
      reset();
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  return (
    <section className="bg-gradient-to-r from-primary to-accent py-16 px-4 md:px-10 text-white rounded-2xl mb-10">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-4xl font-bold">Join Our Newsletter</h2>
        <p className="text-lg opacity-90">
          Stay updated with fitness tips, exclusive classes, and community
          updates. Subscribe now and never miss a beat!
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col md:flex-row gap-4 justify-center items-center"
        >
          <div className="w-full md:w-1/3">
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Your Name"
              className="input w-full text-black"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>

          <div className="w-full md:w-1/3">
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Your Email"
              className="input w-full text-black"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary font-bold uppercase tracking-widest"
          >
            Subscribe Now
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
