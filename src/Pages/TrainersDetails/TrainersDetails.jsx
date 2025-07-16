import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";

const TrainerDetails = () => {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get(`/trainers/${id}`)
      .then((res) => setTrainer(res.data))
      .catch((err) => console.error("Failed to fetch trainer:", err));
  }, [id, axios]);

  if (!trainer) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  const {
    name,
    profileImage,
    experience,
    expertise,
    availableSlots,
    description,
  } = trainer;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Helmet>
        <title>Fitify | {name}</title>
      </Helmet>

      <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-8">
        {name}'s Profile
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trainer Info */}
        <div className="bg-base-100 p-6 rounded-lg shadow">
          <img
            src={profileImage}
            alt={name}
            className="rounded-lg w-full h-80 object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{name}</h2>
          <p className="text-sm text-gray-600 mb-1">
            Experience: {experience} years
          </p>
          <p className="text-sm text-gray-600 mb-1">Expertise: {expertise}</p>
          <p className="mt-4">{description}</p>
        </div>

        {/* Available Slots */}
        <div className="bg-base-100 p-6 rounded-lg shadow">
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Available Slots
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableSlots?.map((slot, index) => (
              <button
                key={index}
                className="btn btn-outline btn-primary"
                onClick={() =>
                  (window.location.href = `/trainer-booking/${id}?slot=${slot}`)
                }
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;
