import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";

const TrainerBooking = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const axios = useAxios();

  const [trainer, setTrainer] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState("Basic");

  const searchParams = new URLSearchParams(location.search);
  const slot = searchParams.get("slot");

  useEffect(() => {
    axios
      .get(`/trainers/${id}`)
      .then((res) => setTrainer(res.data))
      .catch((err) => console.error("Error fetching trainer:", err));
  }, [id]);

  const handleJoinNow = () => {
    navigate(`/payment/${id}?slot=${slot}&package=${selectedPackage}`);
  };

  if (!trainer) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <Helmet>
        <title>Fitify | Book {trainer.name}</title>
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-4">
        Book {trainer.name}
      </h1>

      <div className="mb-4 border border-secondary bg-base-100 p-4 rounded-lg shadow">
        <img
          src={trainer.profileImage}
          alt={trainer.name}
          className="rounded-lg w-full md:w-96 mb-4"
        />
        <p>
          <strong>Slot:</strong> {slot}
        </p>
        <p>
          <strong>Classes:</strong> {trainer.expertise}
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
