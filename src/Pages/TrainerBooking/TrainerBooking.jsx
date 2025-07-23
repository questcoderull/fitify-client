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

  // Get URL query params
  const searchParams = new URLSearchParams(location.search);
  const day = searchParams.get("day");
  const label = searchParams.get("label");
  const time = searchParams.get("time");
  const selectedClassName = searchParams.get("class"); // class name from URL

  const [selectedPackage, setSelectedPackage] = React.useState("Basic");

  // Load trainer
  const {
    data: trainer,
    isLoading: loadingTrainer,
    error,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axios.get(`/trainers/${id}`);
      return res.data;
    },
  });

  // Load all classes
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const res = await axios.get("/classes");
      return res.data;
    },
  });

  const handleJoinNow = () => {
    navigate(
      `/payment/${id}?day=${day}&label=${label}&time=${time}&package=${selectedPackage}&class=${selectedClassName}`
    );
  };

  if (loadingTrainer || loadingClasses) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load trainer or class info.
      </div>
    );
  }

  // Find selected class object by className
  const selectedClassInfo = classes.find(
    (cls) => cls.className === selectedClassName
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Helmet>
        <title>Fitify | Book {trainer.name}</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-4">
        Book {trainer.name}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Trainer Info */}
        <div className="border border-secondary bg-base-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold text-primary mb-2">
            Selected trainer
          </h2>
          <img
            src={trainer.image || trainer.profileImage}
            alt={trainer.name}
            className="rounded-lg w-full h-auto  object-cover mb-4"
          />
          <p className="text-sm text-gray-700 mb-1">
            <strong>Slot:</strong> {day} - {label} - {time}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Trainer Expertise:</strong>{" "}
            {Array.isArray(trainer.expertise)
              ? trainer.expertise.join(", ")
              : trainer.expertise}
          </p>
        </div>

        {/* Selected Class Info */}
        {selectedClassInfo ? (
          <div className="bg-base-100 border border-primary rounded-lg p-4 shadow">
            <h2 className="text-xl font-bold text-primary mb-2">
              Selected Class
            </h2>
            <img
              src={selectedClassInfo.image}
              alt={selectedClassInfo.className}
              className="w-full h-auto object-cover rounded mb-3"
            />
            <p className="text-sm text-gray-700 mb-1">
              <strong>Name:</strong> {selectedClassInfo.className}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              <strong>Category:</strong> {selectedClassInfo.category}
            </p>
            <p className="text-sm text-gray-700 mt-2">
              {selectedClassInfo.details.slice(0, 150)}...
            </p>
          </div>
        ) : (
          <div className="bg-base-100 border border-warning rounded-lg p-4 shadow text-warning text-center">
            No class selected.
          </div>
        )}
      </div>

      {/* Package Selection */}
      <div className="bg-base-100 p-4 rounded-lg shadow border border-primary">
        <h2 className="text-2xl font-bold mb-3">
          Select Membership Package to book
        </h2>

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
