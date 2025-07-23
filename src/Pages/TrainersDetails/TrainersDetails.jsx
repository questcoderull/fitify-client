import React from "react";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";

const TrainerDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();

  const {
    data: trainer,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trainer", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/trainers/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load trainer details.
      </div>
    );
  }

  const { name, image, description, expertise, structuredSlots, socialLinks } =
    trainer;

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
        <div className="bg-base-100 p-6 rounded-lg shadow border border-primary">
          <img
            src={image}
            alt={name}
            className="rounded-lg w-full h-80 object-cover mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2">{name}</h2>
          <p className="text-sm text-gray-600 mb-1">
            Expertise:{" "}
            {Array.isArray(expertise) ? expertise.join(", ") : expertise}
          </p>
          <p className="mt-4 text-sm text-gray-700">{description}</p>
          <div className="mt-4">
            <h3 className="text-lg text-primary">Social Links</h3>
            <p className="text-sm text-gray-700">
              Facebook:{" "}
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline hover:text-blue-700"
              >
                {socialLinks.facebook}
              </a>
            </p>

            <p className="text-sm text-gray-700">
              Instagram:{" "}
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline hover:text-blue-700"
              >
                {socialLinks.instagram}
              </a>
            </p>

            <p className="text-sm text-gray-700">
              LinkedIn:{" "}
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline hover:text-blue-700"
              >
                {socialLinks.linkedin}
              </a>
            </p>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-base-100 p-6 rounded-lg shadow border border-primary">
          <h3 className="text-2xl font-bold mb-4 text-primary">
            Available Slots
          </h3>

          {structuredSlots?.length > 0 ? (
            <div className="space-y-4">
              {structuredSlots.map((slotObj, index) => (
                <div key={index}>
                  <h4 className="text-lg font-semibold text-gray-700 mb-1">
                    {slotObj.day}
                  </h4>
                  {slotObj.slots.map((labelSlot, i) => (
                    <div key={i} className="mb-2">
                      <p className="text-sm text-gray-600 font-medium mb-1">
                        {labelSlot.label}:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {labelSlot.times.map((time, idx) => (
                          <Link
                            key={idx}
                            to={`/trainer-booking/${id}?day=${slotObj.day}&label=${labelSlot.label}&time=${time}`}
                            className="btn btn-outline btn-primary btn-sm"
                          >
                            {time}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No slots available.</p>
          )}
        </div>
      </div>

      {/* Be A Trainer Section */}
      <div className="bg-base-100 mt-10 p-6 rounded-lg shadow border border-primary">
        <h3 className="text-2xl font-bold mb-4 text-primary text-center">
          Want to Inspire Others? Become a Trainer!
        </h3>
        <p className="text-sm text-gray-700 mb-6 text-center max-w-3xl mx-auto">
          Are you passionate about fitness and ready to take the next step in
          your journey? Join our platform as a certified trainer and share your
          knowledge with members from all walks of life. Whether you're into
          yoga, strength training, cardio, or nutrition, we welcome you to help
          shape a healthier community through your unique expertise.
        </p>
        <div className="flex justify-center">
          <Link
            to="/be-trainer"
            className="btn btn-primary btn-wide text-white"
          >
            Become a Trainer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;
