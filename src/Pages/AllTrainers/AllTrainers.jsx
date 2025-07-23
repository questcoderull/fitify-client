import React, { useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";

const AllTrainers = () => {
  const axios = useAxios();
  const [page, setPage] = useState(1);
  const limit = 6; // per page trainer showing.

  const { data, isLoading, error } = useQuery({
    queryKey: ["trainers", page],
    queryFn: async () => {
      const res = await axios.get(
        `/trainers-with-paginaton?page=${page}&limit=${limit}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">Failed to load trainers</div>
    );
  }

  const { result: trainers, total } = data;
  const totalPages = Math.ceil(total / limit);

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
                src={trainer.image || trainer.profileImage}
                alt={trainer.name}
                className="w-full h-64 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-primary">{trainer.name}</h2>
              <p className="text-sm">Age: {trainer.age}</p>
              <p className="text-sm">
                Expertise:{" "}
                {Array.isArray(trainer.expertise)
                  ? trainer.expertise.join(", ")
                  : trainer.expertise}
              </p>
              <p className="text-sm">
                Available Days:{" "}
                {trainer.structuredSlots?.map((slot) => slot.day).join(", ")}
              </p>
              <div className="text-sm space-y-1">
                {trainer.structuredSlots?.map((slotObj, i) => (
                  <div key={i}>
                    <strong>{slotObj.day}</strong>:
                    {slotObj.slots.map((group, j) => (
                      <div key={j}>
                        <span> {group.label}: </span>
                        {group.times.join(", ")}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
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

      {/* ✅ Pagination Buttons */}
      <div className="flex justify-center gap-2 mt-8">
        <button
          className="btn btn-sm"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ◀ Prev
        </button>
        {[...Array(totalPages).keys()].map((num) => (
          <button
            key={num}
            onClick={() => setPage(num + 1)}
            className={`btn btn-sm ${
              page === num + 1 ? "btn-primary text-white" : "btn-outline"
            }`}
          >
            {num + 1}
          </button>
        ))}
        <button
          className="btn btn-sm"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default AllTrainers;
