import React from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const TrainerBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxios();

  // Getting query parameters from URL (example: ?day=Sunday&label=Evening&time=8:00%20PM)
  const searchParams = new URLSearchParams(location.search);
  const day = searchParams.get("day");
  const label = searchParams.get("label");
  const time = searchParams.get("time");

  const {
    data: trainer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axios.get(`/trainers/${id}`);
      return res.data;
    },
  });

  const [selectedPackage, setSelectedPackage] = React.useState("Basic");

  const handleJoinNow = () => {
    navigate(
      `/payment/${id}?day=${day}&label=${label}&time=${time}&package=${selectedPackage}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="text-center text-red-500">
        Failed to load trainer data
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Fitify | Book {trainer.name}</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-4">
        Book {trainer.name}
      </h1>

      <div className="mb-4 border border-secondary bg-base-100 p-4 rounded-lg shadow">
        <img
          src={trainer.image || trainer.profileImage}
          alt={trainer.name}
          className="rounded-lg w-full md:w-96 mb-4"
        />
        <p>
          <strong>Slot:</strong> {day} - {label} - {time}
        </p>
        <p>
          <strong>Classes:</strong>{" "}
          {Array.isArray(trainer.expertise)
            ? trainer.expertise.join(", ")
            : trainer.expertise}
        </p>
      </div>

      <div className="bg-base-100 p-4 rounded-lg shadow border border-primary">
        <h2 className="text-2xl font-bold mb-3">Select Membership Package</h2>

        <div className="space-y-3">
          {["Basic", "Standard", "Premium"].map((pkg, idx) => (
            <label key={idx} className="flex items-center space-x-3">
              <input
                type="radio"
                value={pkg}
                checked={selectedPackage === pkg}
                onChange={(e) => setSelectedPackage(e.target.value)}
              />
              <span className="font-semibold">{pkg} Package</span>
              <span className="text-sm text-gray-500 ml-2">
                {pkg === "Basic" && "$10 - Gym access"}
                {pkg === "Standard" && "$50 - Includes group classes"}
                {pkg === "Premium" && "$100 - Personal trainer & extras"}
              </span>
            </label>
          ))}
        </div>

        <button onClick={handleJoinNow} className="btn btn-primary mt-6">
          Join Now
        </button>
      </div>
    </div>
  );
};

export default TrainerBooking;
