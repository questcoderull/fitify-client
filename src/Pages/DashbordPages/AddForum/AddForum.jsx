import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import axios from "axios";
import toast from "react-hot-toast";

import useAuth from "../../../Hooks/useAuth";
import { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { Helmet } from "react-helmet-async";

const AddForum = () => {
  const { register, handleSubmit, reset } = useForm();
  const { user, role } = useAuth();
  // console.log("Role from add forum", role);
  const [imageUrl, setImageUrl] = useState("");
  const axiosSecure = useAxiosSecure();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.post("/forums", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Forum post added!");
      reset();
    },
    onError: () => {
      toast.error("Failed to add post!");
    },
  });

  const onSubmit = (data) => {
    const postData = {
      ...data,
      contentImage: imageUrl,
      authorName: user.displayName,
      authorEmail: user.email,
      authorPhoto: user.photoURL,
      role: role || "trainer",
      upVotes: [],
      downVotes: [],
      added_At: new Date(),
    };

    mutation.mutate(postData);
  };

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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-base-100 shadow-lg rounded-lg">
      <Helmet>
        <title>Fitify | Dashboard | Add Forum</title>
      </Helmet>
      <h2 className="text-2xl font-bold mb-4">Add a New Forum Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            {...register("title", { required: true })}
            className="input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Image URL</label>
          <input
            onChange={handleImageUpload}
            type="file"
            accept="image/*"
            className="file-input input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">Post Content</label>
          <textarea
            placeholder="Write your forum post..."
            {...register("content", { required: true })}
            className="textarea textarea-bordered w-full min-h-[120px]"
          ></textarea>
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? "Posting..." : "Post Forum"}
        </button>
      </form>
    </div>
  );
};

export default AddForum;
