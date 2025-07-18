import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import useAxios from "../../Hooks/useAxios";

const AllClasses = () => {
  const axios = useAxios();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/classes")
      .then((res) => {
        setClasses(res.data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching classes:", err));
  }, [axios]);

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
        {classes.map((singleClass) => (
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
              </p>

              {/* <div className="flex flex-wrap mt-3">
                {singleClass.trainers?.slice(0, 5).map((trainer) => (
                  <Link
                    to={`/trainer-details/${trainer.trainerId}`}
                    key={trainer.trainerId}
                  >
                    <img
                      src={trainer.trainerImage}
                      alt={trainer.trainerName}
                      title={trainer.trainerName}
                      className="w-10 h-10 rounded-full mr-2 border hover:scale-110 transition"
                    />
                  </Link>
                ))}
              </div> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllClasses;
