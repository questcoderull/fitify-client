import React from "react";
import { useParams, Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { FaArrowLeft } from "react-icons/fa";

const ClassDetails = () => {
  const { id } = useParams();
  const axios = useAxios();

  // Fetch single class detail by id
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      const res = await axios.get(`/classes/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Fetch all trainers to filter those matching this class category
  const { data: trainers = [], isLoading: trainerLoading } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await axios.get("/trainers");
      return res.data;
    },
  });

  if (classLoading || trainerLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (!classData) {
    return <p>Class not found</p>;
  }

  // Find trainers matching class category
  const matchedTrainers = trainers.filter((trainer) =>
    trainer.expertise?.includes(classData.category)
  );

  return (
    <div>
      <div className="max-w-4xl mx-auto p-6 border border-primary rounded-2xl my-10">
        <h1 className="text-4xl font-bold mb-4">{classData.className}</h1>
        <img
          src={classData.image}
          alt={classData.className}
          className="w-full max-h-96 object-cover rounded-md mb-6"
        />
        <p className="mb-4">{classData.details}</p>

        <p className="mb-2">
          <strong>Duration:</strong> {classData.duration}
        </p>
        <p className="mb-4">
          <strong>Level:</strong> {classData.level} | <strong>Category:</strong>{" "}
          {classData.category}
        </p>

        <h2 className="text-2xl font-semibold mb-3">Trainers for this class</h2>
        {matchedTrainers.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {matchedTrainers.map((trainer) => (
              <Link
                key={trainer._id}
                to={`/trainer/${trainer._id}?classId=${classData._id}`}
                className="flex flex-col items-center w-24"
                title={trainer.name}
              >
                <img
                  src={trainer.image}
                  alt={trainer.name}
                  className="w-20 h-20 rounded-full border-2 border-primary object-cover mb-1"
                />
                <span className="text-center text-sm">{trainer.name}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p>No trainers found for this class category.</p>
        )}
      </div>

      <div className="text-center">
        <Link
          to="/all-classes"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to All Classes
        </Link>
      </div>
    </div>
  );
};

export default ClassDetails;
