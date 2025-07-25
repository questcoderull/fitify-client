import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const AddClass = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setImageUrl(res.data.data.url);
    toast.success("Image uploaded successfully");
  };

  const onSubmit = async (data) => {
    if (!imageUrl) {
      return toast.error("Please upload an image first");
    }

    const classData = {
      className: data.className,
      image: imageUrl,
      details: data.details,
      duration: data.duration,
      level: data.level,
    };

    const res = await axiosSecure.post("/class", classData);
    // console.log(res.data.insertedId);
    if (res.data.insertedId) {
      // console.log("class added succesfully");
      toast.success("Class added successfully");
      reset();
      setImageUrl("");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">Add New Class</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Class Name */}
        <div>
          <label className="label">Class Name</label>
          <input
            {...register("className", { required: true })}
            className="input w-full"
            placeholder="Class Name"
          />
          {errors.className && (
            <p className="text-red-500 text-sm">Class name is required</p>
          )}
        </div>

        {/* Details */}
        <div>
          <label className="label">Details</label>
          <textarea
            {...register("details", { required: true })}
            className="textarea w-full"
            placeholder="Details"
          ></textarea>
          {errors.details && (
            <p className="text-red-500 text-sm">Details are required</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="label">Class Image</label>
          <input
            onChange={handleImageUpload}
            type="file"
            accept="image/*"
            className="file-input w-full"
          />
          {!imageUrl && <p className="text-red-500 text-sm">Upload an image</p>}
        </div>

        {/* Duration Select */}
        <div>
          <label className="label">Duration</label>
          <select
            {...register("duration", { required: true })}
            className="select w-full"
          >
            <option value="">Select Duration</option>
            <option value="30 minutes">30 minutes</option>
            <option value="1 hour">1 hour</option>
            <option value="1.5 hours">1.5 hours</option>
            <option value="2 hours">2 hours</option>
          </select>
          {errors.duration && (
            <p className="text-red-500 text-sm">Duration is required</p>
          )}
        </div>

        {/* Level Radio Buttons */}
        <div>
          <label className="label">Level</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Beginner"
                {...register("level", { required: true })}
              />{" "}
              Beginner
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Intermediate"
                {...register("level", { required: true })}
              />{" "}
              Intermediate
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Advanced"
                {...register("level", { required: true })}
              />{" "}
              Advanced
            </label>
          </div>
          {errors.level && (
            <p className="text-red-500 text-sm">Level is required</p>
          )}
        </div>

        {/* Submit Button */}
        <button className="btn btn-primary w-full" type="submit">
          Add Class
        </button>
      </form>
    </div>
  );
};

export default AddClass;
