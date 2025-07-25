import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { Helmet } from "react-helmet-async";

const AddSlot = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [trainer, setTrainer] = useState(null);
  const [classes, setClasses] = useState([]);

  const { register, handleSubmit, control, reset, watch } = useForm();

  const slotLabel = watch("slotLabel");

  const availableDays = [
    { value: "Sunday", label: "Sunday" },
    { value: "Monday", label: "Monday" },
    { value: "Tuesday", label: "Tuesday" },
    { value: "Wednesday", label: "Wednesday" },
    { value: "Thursday", label: "Thursday" },
    { value: "Friday", label: "Friday" },
    { value: "Saturday", label: "Saturday" },
  ];

  const slotLabels = [
    { value: "Morning", label: "Morning" },
    { value: "Noon", label: "Noon" },
    { value: "Afternoon", label: "Afternoon" },
    { value: "Evening", label: "Evening" },
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

  // Load trainer
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/trainers-with-email/${user.email}`)
      .then((res) => {
        setTrainer(res.data);
      })
      .catch((err) => console.error("Failed to fetch trainer:", err));
  }, [user.email, axiosSecure]);

  // Load matching classes based on trainer expertise
  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/classes/matching/${user.email}`)
      .then((res) => {
        setClasses(
          res.data.map((cls) => ({
            value: cls._id,
            label: `${cls.className} (${cls.category})`,
          }))
        );
      })
      .catch((err) => console.error("Failed to fetch filtered classes:", err));
  }, [user.email, axiosSecure]);

  const onSubmit = async (data) => {
    const { slotDay, slotLabel, slotTimes, selectedClasses } = data;

    const newSlot = {
      day: slotDay.value,
      slot: {
        label: slotLabel.value,
        times: slotTimes.map((t) => t.value),
        classIds: selectedClasses.map((c) => c.value),
      },
    };

    try {
      const res = await axiosSecure.patch("/trainers/add-slot", {
        email: user.email,
        newSlot,
      });

      if (res.data.modifiedCount > 0) {
        toast.success("Slot added successfully");
        reset();

        // Update local trainer state with new slot
        setTrainer((prev) => {
          const updated = { ...prev };

          // Find if day already exists
          const dayIndex = updated.structuredSlots.findIndex(
            (s) => s.day === newSlot.day
          );

          if (dayIndex !== -1) {
            // Push new slot into existing day
            updated.structuredSlots[dayIndex].slots.push(newSlot.slot);
          } else {
            // Add new day with slot
            updated.structuredSlots.push({
              day: newSlot.day,
              slots: [newSlot.slot],
            });
          }

          return updated;
        });
      } else {
        toast.error("Failed to add slot");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  if (!trainer) return <p className="text-center mt-16">Slots Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-5 shadow-lg bg-white rounded-lg">
      <Helmet>
        <title>Fitify | Dashboard | Add slot</title>
      </Helmet>
      <h2 className="text-2xl font-bold text-center mb-4">Add New Slot</h2>

      <div className="mb-6">
        <p className="font-semibold">Name: {trainer.name}</p>
        <p>Email: {trainer.email}</p>
        <p>Expertise: {trainer.expertise?.join(" , ")}</p>

        {/* Show existing slots */}
        <div className="mt-4">
          <p className="font-semibold mb-2">Your Existing Slots:</p>
          {trainer.structuredSlots && trainer.structuredSlots.length > 0 ? (
            trainer.structuredSlots.map((daySlot) => (
              <div key={daySlot.day} className="mb-3">
                <p className="font-medium">{daySlot.day}</p>
                {daySlot.slots.map((slot, idx) => (
                  <div key={idx} className="ml-4 text-sm text-gray-700">
                    <span className="font-semibold">{slot.label}:</span>{" "}
                    {slot.times?.join(" , ")}
                    <br />
                    <small>
                      Classes:{" "}
                      {slot.classIds
                        ? slot.classIds.join(", ")
                        : "No classes assigned"}
                    </small>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No slots added yet.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="slotDay"
          control={control}
          rules={{ required: "Please select a day" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                options={availableDays}
                placeholder="Select Day"
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <Controller
          name="slotLabel"
          control={control}
          rules={{ required: "Please select a slot label" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                options={slotLabels}
                placeholder="Select Slot Label"
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <Controller
          name="slotTimes"
          control={control}
          rules={{ required: "Please select at least one time slot" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                isMulti
                options={generateTimeSlots(slotLabel?.value)}
                placeholder="Select Time Slots"
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <Controller
          name="selectedClasses"
          control={control}
          rules={{ required: "Please select at least one class" }}
          render={({ field, fieldState }) => (
            <>
              <Select
                {...field}
                options={classes}
                placeholder="Select Classes"
                isMulti
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />

        <button type="submit" className="btn btn-primary w-full">
          Add Slot
        </button>
      </form>
    </div>
  );
};

export default AddSlot;
