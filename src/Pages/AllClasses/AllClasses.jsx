import React, { useState } from "react";
import useAxios from "../../Hooks/useAxios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import Swal from "sweetalert2";

const AllClasses = () => {
  const axios = useAxios();

  const [page, setPage] = useState(1);
  const limit = 6;

  // For tracking which classes have expanded details
  const [expandedClasses, setExpandedClasses] = useState([]);

  // Toggle expanded/collapsed state
  const toggleExpand = (classId) => {
    setExpandedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId]
    );
  };

  // Load paginated classes
  const {
    data: classData = { result: [], total: 0 },
    isLoading: classLoading,
  } = useQuery({
    queryKey: ["classes", page],
    queryFn: async () => {
      const res = await axios.get(
        `/classes-with-pagination?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  // Load all trainers (no pagination)
  const { data: trainers = [], isLoading: trainerLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await axios.get("/trainers");
      return res.data;
    },
  });

  const totalPages = Math.ceil(classData.total / limit);

  const showExtraTrainers = (trainers) => {
    const isMobile = window.innerWidth < 768;
    const html = trainers
      .map(
        (t) => `
      <a href="/trainer/${t._id}" target="${isMobile ? "_self" : "_blank"}" 
         style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid #eee; text-decoration: none;">
        <img 
          src="${t.image}" 
          title="${t.name}" 
          alt="${t.name}"
          style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid #ccc;" 
        />
        <span style="font-size: 16px; color: #333; font-weight: 500;">${
          t.name
        }</span>
      </a>
    `
      )
      .join("");

    Swal.fire({
      title: "Other Trainers",
      html: `<div style="max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">${html}</div>`,
      showCloseButton: true,
      showConfirmButton: false,
      width: window.innerWidth > 640 ? "600px" : "95%",
    });
  };

  if (classLoading || trainerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="my-16">
      <h1 className="text-3xl font-bold text-center mb-8">
        All Fitness Classes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classData.result.map((singleClass) => {
          const matchedTrainers = trainers.filter((trainer) =>
            trainer.expertise?.includes(singleClass.category)
          );

          const isExpanded = expandedClasses.includes(singleClass._id);
          const detailsTooLong = singleClass.details.length > 200;

          return (
            <div
              key={singleClass._id}
              className="card bg-base-100 shadow-xl border border-primary"
            >
              <figure>
                <img
                  src={singleClass.image}
                  alt={singleClass.className}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{singleClass.className}</h2>

                {/* Description with Read More / Show Less */}
                <p className="text-sm text-gray-700">
                  {isExpanded || !detailsTooLong
                    ? singleClass.details
                    : `${singleClass.details.slice(0, 200)}... `}
                  {detailsTooLong && (
                    <button
                      onClick={() => toggleExpand(singleClass._id)}
                      className="text-primary underline ml-2 cursor-pointer"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Duration:{" "}
                  <span className="text-primary">{singleClass.duration}</span>
                </p>
                <p className="text-sm text-gray-700">
                  Level:{" "}
                  <span className="text-primary">{singleClass.level}</span>
                  <span className="ml-2.5">
                    Category:{" "}
                    <span className="text-primary">{singleClass.category}</span>
                  </span>
                </p>

                <h1 className="text-primary mt-3">
                  Available trainers for this class..
                </h1>
                {matchedTrainers.length > 0 ? (
                  <div className="avatar-group -space-x-6">
                    {matchedTrainers.slice(0, 5).map((trainer) => (
                      <Link
                        to={`/trainer/${trainer._id}`}
                        key={trainer._id}
                        title={trainer.name}
                      >
                        <div className="avatar">
                          <div className="w-12 border rounded-full">
                            <img src={trainer.image} alt={trainer.name} />
                          </div>
                        </div>
                      </Link>
                    ))}

                    {matchedTrainers.length > 5 && (
                      <div
                        className="avatar avatar-placeholder cursor-pointer"
                        onClick={() => showExtraTrainers(matchedTrainers)}
                      >
                        <div className="bg-neutral text-neutral-content w-12 rounded-full flex items-center justify-center">
                          +{matchedTrainers.length - 5}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-2">
                    No matching trainer found.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Buttons */}
      <div className="flex justify-center gap-2 mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-sm"
          disabled={page === 1}
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
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="btn btn-sm"
          disabled={page === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default AllClasses;
