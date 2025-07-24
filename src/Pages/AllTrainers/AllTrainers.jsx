import React, { useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { FaUser, FaBrain, FaCalendarAlt, FaClock } from "react-icons/fa";

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
      <h1 className="text-3xl font-bold text-center text-primary mb-3">
        Our Trainers
      </h1>
      <p className="text-center text-gray-600 max-w-3xl mx-auto text-sm md:text-base mb-12">
        Meet our certified and passionate trainers who are committed to helping
        you achieve your fitness goals. Each trainer brings unique expertise,
        energy, and dedication to guide you every step of the way.
      </p>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="card bg-white shadow-lg border border-gray-200 rounded-2xl hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 flex flex-col"
          >
            {/* Avatar Image */}
            <figure className="flex justify-center pt-6 px-4">
              <div className="avatar">
                <div className="rounded-full ring ring-primary ring-offset-base-100 ring-offset-4 shadow-lg w-32 h-32 md:w-36 md:h-36 lg:w-48 lg:h-48 overflow-hidden">
                  <img
                    src={trainer.image || trainer.profileImage}
                    alt={trainer.name}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </figure>

            {/* Body */}
            <div className="card-body text-center px-6 pt-3 pb-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-primary mb-1">
                {trainer.name}
              </h2>
              <p className="text-sm text-gray-700 mb-3">Age: {trainer.age}</p>

              {/* Expertise */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-800 mb-1 tracking-wide">
                  Expertise
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {Array.isArray(trainer.expertise) ? (
                    trainer.expertise.map((item, i) => (
                      <span
                        key={i}
                        className="badge badge-outline badge-primary text-[10px] px-2 py-0.5 rounded-full"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-700 font-medium text-sm">
                      {trainer.expertise}
                    </span>
                  )}
                </div>
              </div>

              {/* Available Days */}
              <div className="mb-3">
                <p className="text-xs font-semibold text-gray-800 mb-1 tracking-wide">
                  Available Days
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {trainer.structuredSlots?.map((slot, i) => (
                    <span
                      key={i}
                      className="badge badge-outline badge-secondary text-[10px] px-2 py-0.5 rounded-full"
                    >
                      {slot.day}
                    </span>
                  ))}
                </div>
              </div>

              {/* Structured Slots */}
              <div className="text-left w-full mt-auto space-y-1 text-gray-700 max-h-20 overflow-y-auto text-xs">
                {trainer.structuredSlots?.map((slotObj, i) => (
                  <div key={i} className="text-sm leading-tight">
                    <strong className="text-gray-900">{slotObj.day}</strong>:
                    {slotObj.slots.map((group, j) => (
                      <div key={j} className="ml-2 mt-0.5">
                        <span className="font-semibold text-primary">
                          {group.label}:
                        </span>{" "}
                        {group.times.join(", ")}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Button */}
              <div className="mt-4 w-full">
                <Link
                  to={`/trainer/${trainer._id}`}
                  className="btn btn-primary btn-sm w-full rounded-full font-semibold tracking-wide"
                >
                  Know More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/*  Pagination Buttons */}
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
