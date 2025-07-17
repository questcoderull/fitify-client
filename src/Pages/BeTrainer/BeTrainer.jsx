import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Select from "react-select";
import axios from "axios";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const BeATrainer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [postedPic, setpostedPic] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm();

  const availableDays = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const generateAvailableSlots = () => {
    const slots = [];
    let hour = 6;
    let minute = 0;
    while (hour < 22) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute === 0 ? "00" : minute;
      slots.push(`${displayHour}:${displayMinute} ${ampm}`);
      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return slots;
  };

  const availableSlotOptions = generateAvailableSlots().map((slot) => ({
    value: slot,
    label: slot,
  }));

  const skillsOptions = [
    { value: "Zumba", label: "Zumba" },
    { value: "Dance Fitness", label: "Dance Fitness" },
    { value: "Cardio", label: "Cardio" },
    { value: "Strength Training", label: "Strength Training" },
    { value: "Athletic Training", label: "Athletic Training" },
    { value: "Endurance", label: "Endurance" },
    { value: "Speed Improvement", label: "Speed Improvement" },
  ];

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    setpostedPic(res.data.data.url);
    toast.success("Image uploaded successfully");
  };

  const onSubmit = async (data) => {
    if (!postedPic) return toast.error("Please upload your profile image");

    const trainerData = {
      name: data.name,
      email: data.email,
      age: data.age,
      image: postedPic,
      expertise: data.skills.map((skill) => skill.value).join(", "),
      availableDays: data.days.map((day) => day.value),
      availableSlots: data.slots.map((slot) => slot.value),
      description: data.description,
      application_status: "pending",
      joined_At: new Date().toISOString(),
      socialLinks: {
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
      },
    };
    console.log(trainerData);

    const res = await axiosSecure.post("/trainers", trainerData);
    if (res.data.insertedId) {
      toast.success("Trainer Application Submitted Successfully");
      reset();
      setpostedPic("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-5 shadow-xl rounded-lg bg-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Apply to Be a Trainer
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label>Name</label>
          <input
            {...register("name", { required: true })}
            className="input w-full"
          />
          {errors.name && <p className="text-red-500">Name is required</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            {...register("email", { required: true })}
            className="input w-full"
            readOnly
            defaultValue={user.email}
          />
        </div>
        <div>
          <label>Age</label>
          <input
            {...register("age", { required: true })}
            type="number"
            className="input w-full"
          />
          {errors.age && <p className="text-red-500">Age is required</p>}
        </div>
        <div>
          <label>Profile Photo</label>
          <input
            onChange={handleImageUpload}
            type="file"
            accept="image/*"
            className="file-input w-full"
          />
        </div>
        <div>
          <label>Skills</label>
          <Controller
            name="skills"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={skillsOptions}
                className="w-full"
              />
            )}
          />
          {errors.skills && <p className="text-red-500">Skills are required</p>}
        </div>
        <div>
          <label>Available Days</label>
          <Controller
            name="days"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={availableDays}
                className="w-full"
              />
            )}
          />
          {errors.days && <p className="text-red-500">Days are required</p>}
        </div>
        <div>
          <label>Available Slots</label>
          <Controller
            name="slots"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={availableSlotOptions}
                className="w-full"
              />
            )}
          />
          {errors.slots && <p className="text-red-500">Slots are required</p>}
        </div>
        <div>
          <label>Facebook Link</label>
          <input {...register("facebook")} className="input w-full" />
        </div>
        <div>
          <label>Instagram Link</label>
          <input {...register("instagram")} className="input w-full" />
        </div>
        <div>
          <label>LinkedIn Link</label>
          <input {...register("linkedin")} className="input w-full" />
        </div>
        <div>
          <label>Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea w-full"
          />
          {errors.description && (
            <p className="text-red-500">Description is required</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Apply
        </button>
      </form>
    </div>
  );
};

export default BeATrainer;
