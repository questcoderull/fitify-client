import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";

const AllTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const axios = useAxios();

  useEffect(() => {
    axios
      .get("/trainers")
      .then((response) => {
        setTrainers(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching trainers:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="py-10">
      <Helmet>
        <title>Fitify | All Trainers</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center text-primary mb-10">
        Our Trainers
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div key={trainer._id} className="card bg-base-100 shadow-md border">
            <figure>
              <img
                src={trainer.profileImage}
                alt={trainer.name}
                className="w-full h-64 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-primary">{trainer.name}</h2>
              <p className="text-sm">Experience: {trainer.experience}</p>
              <p className="text-sm">Expertise: {trainer.expertise}</p>
              <p className="text-sm">
                Available Days: {trainer.availableDays?.join(", ")}
              </p>
              <p className="text-sm">
                Slots: {trainer.availableSlots?.join(", ")}
              </p>
              <div className="mt-3">
                <Link
                  to={`/trainer/${trainer._id}`}
                  className="btn btn-primary btn-sm w-full"
                >
                  Know More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTrainers;
