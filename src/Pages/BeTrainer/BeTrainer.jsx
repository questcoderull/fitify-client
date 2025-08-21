import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const BeATrainer = () => {
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const axiosSecure = useAxiosSecure();
  const [profilePic, setprofilePic] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const selectedLabel = watch("slotLabel");

  const skillOptions = [
    "Zumba",
    "Dance Fitness",
    "Cardio",
    "Strength Training",
    "Athletic Training",
    "Endurance",
    "Speed Improvement",
    "CrossFit",
    "Yoga",
    "Pilates",
    "Meditation",
    "HIIT",
  ];

  const availableDays = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const generateTimeSlots = (label = "") => {
    const slots = [];
    let hour = 6;
    let minute = 0;
    while (hour < 22) {
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const displayMinute = minute === 0 ? "00" : minute;
      const timeStr = `${displayHour}:${displayMinute} ${ampm}`;

      let include = true;
      if (label === "Morning") include = hour >= 6 && hour < 12;
      else if (label === "Noon") include = hour >= 12 && hour < 15;
      else if (label === "Afternoon") include = hour >= 15 && hour < 18;
      else if (label === "Evening") include = hour >= 18 && hour < 22;

      if (include) {
        slots.push({ value: timeStr, label: timeStr });
      }

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour++;
      }
    }
    return slots;
  };

  const slotLabels = [
    { value: "Morning", label: "Morning" },
    { value: "Noon", label: "Noon" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "Evening", label: "Evening" },
  ];

  const [structuredSlots, setStructuredSlots] = useState([]);

  const addSlot = (day, label, times) => {
    if (!day || !label || !times.length)
      return toast.error("Select all fields");
    const existing = structuredSlots.find((s) => s.day === day.value);
    if (existing) {
      existing.slots.push({
        label: label.value,
        times: times.map((t) => t.value),
      });
      setStructuredSlots([...structuredSlots]);
    } else {
      setStructuredSlots([
        ...structuredSlots,
        {
          day: day.value,
          slots: [{ label: label.value, times: times.map((t) => t.value) }],
        },
      ]);
    }
    toast.success("Slot Added");
  };

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_image_upload_key
    }`;
    const res = await axiosInstance.post(imageUploadUrl, formData);
    setprofilePic(res.data.data.url);
    toast.success("Image uploaded successfully");
  };

  const onSubmit = async (data) => {
    if (!profilePic) return toast.error("Please upload your profile image");

    const trainerData = {
      name: data.name,
      email: data.email,
      age: data.age,
      image: profilePic,
      expertise: skillOptions.filter((skill) => data[`skill_${skill}`]),
      structuredSlots,
      description: data.description,
      application_status: "pending",
      joined_At: new Date().toISOString(),
      socialLinks: {
        facebook: data.facebook,
        instagram: data.instagram,
        linkedin: data.linkedin,
      },
    };
    // console.log(trainerData);

    const res = await axiosSecure.post("/trainers", trainerData);
    if (res.data.insertedId) {
      toast.success("Trainer Application Submitted Successfully");
      reset();
      setStructuredSlots([]);
      setprofilePic("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-5 shadow-xl rounded-lg bg-neutral border-error">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Apply to Be a Trainer
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Fields */}
        <label>Your Name</label>
        <input
          {...register("name", { required: true })}
          placeholder="Name"
          className="input w-full"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">Name is required</p>
        )}

        <label>Your Email</label>
        <input
          defaultValue={user.email}
          readOnly
          {...register("email", { required: true })}
          className="input w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">Email is required</p>
        )}

        <label>Your Age</label>
        <input
          type="number"
          {...register("age", { required: true })}
          placeholder="Age"
          className="input w-full"
        />
        {errors.age && <p className="text-red-500 text-sm">Age is required</p>}

        <label>Profile Photo</label>
        <input
          onChange={handleImageUpload}
          type="file"
          accept="image/*"
          className="file-input w-full"
        />

        {/* Skills */}
        <div>
          <label>Skills (Select multiple)</label>
          <div className="grid grid-cols-2 gap-2">
            {skillOptions.map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-2 p-2 border rounded hover:bg-base-300 transition"
              >
                <input type="checkbox" {...register(`skill_${skill}`)} />
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* Slot Entry */}
        <label>Available days,slots and times</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Controller
            name="slotDay"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={availableDays}
                placeholder="Day"
                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            )}
          />
          <Controller
            name="slotLabel"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                options={slotLabels}
                placeholder="Slot Name"
                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                }}
              />
            )}
          />
          <Controller
            name="slotTimes"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={generateTimeSlots(selectedLabel?.value)}
                placeholder="Slot Times"
                styles={{
                  option: (provided) => ({
                    ...provided,
                    color: "black",
                  }),
                  multiValueRemove: (provided) => ({
                    ...provided,
                    color: "black", // icon color
                    ":hover": {
                      backgroundColor: "#ef4444", // red hover korle
                      color: "white",
                    },
                  }),
                  // Allah eigula eto kotin. i am not gonna use react select again.
                }}
              />
            )}
          />
        </div>
        <button
          type="button"
          onClick={() =>
            addSlot(
              control._formValues.slotDay,
              control._formValues.slotLabel,
              control._formValues.slotTimes
            )
          }
          className="btn btn-outline btn-primary w-full"
        >
          Add Slot
        </button>

        {/* Slot Preview */}
        <div>
          {structuredSlots.map((s, i) => (
            <div key={i} className="p-2 border rounded my-2">
              <strong>{s.day}</strong>
              <ul className="text-sm mt-1">
                {s.slots.map((slot, j) => (
                  <li key={j}>
                    {slot.label}: {slot.times.join(", ")}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Description */}
        <label>Social Links</label>
        <input
          {...register("facebook", { required: true })}
          placeholder="Facebook Link"
          className="input w-full"
        />
        <input
          {...register("instagram", { required: true })}
          placeholder="Instagram Link"
          className="input w-full"
        />
        <input
          {...register("linkedin", { required: true })}
          placeholder="LinkedIn Link"
          className="input w-full"
        />
        {(errors.facebook || errors.facebook || errors.linkedin) && (
          <p className="text-red-500 text-sm">
            You must Provide your social links
          </p>
        )}

        <label>Description</label>
        <textarea
          {...register("description", { required: true })}
          placeholder="Description"
          className="textarea w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">You must add description</p>
        )}

        <button type="submit" className="btn btn-primary w-full">
          Apply
        </button>
      </form>
    </div>
  );
};

export default BeATrainer;
