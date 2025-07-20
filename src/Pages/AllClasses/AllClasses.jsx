import React, { useEffect, useState } from "react";
import useAxios from "../../Hooks/useAxios";
import { Link } from "react-router";
import Swal from "sweetalert2";

const AllClasses = () => {
  const axios = useAxios();

  const [classes, setClasses] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all classes and trainers
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await axios.get("/classes");
        const trainerRes = await axios.get("/trainers");

        setClasses(classRes.data);
        setTrainers(trainerRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };

    fetchData();
  }, [axios]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        All Fitness Classes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((singleClass) => {
          // Find trainers whose expertise includes this class category
          const matchedTrainers = trainers.filter((trainer) =>
            trainer.expertise?.includes(singleClass.category)
          );

          return (
            <div key={singleClass._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={singleClass.image}
                  alt={singleClass.className}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{singleClass.className}</h2>
                <p>{singleClass.details}</p>
                <p className="text-sm text-gray-500">
                  Duration: {singleClass.duration}
                </p>
                <p className="text-sm text-gray-500">
                  Level: {singleClass.level}
                  <span className="ml-2">Category: {singleClass.category}</span>
                </p>

                {/* Show matching trainers (max 5 visible) */}
                {matchedTrainers.length > 0 ? (
                  <div className="avatar-group -space-x-6 mt-3">
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

                    {/* If more than 5, show +X */}
                    {matchedTrainers.length > 5 && (
                      <div className="avatar avatar-placeholder cursor-pointer">
                        <div
                          className="bg-neutral text-neutral-content w-12"
                          onClick={() => showExtraTrainers(matchedTrainers)}
                        >
                          <span>+{matchedTrainers.length - 5}</span>
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
    </div>
  );
};

export default AllClasses;
