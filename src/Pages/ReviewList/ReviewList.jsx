import React from "react";
import { useQuery } from "@tanstack/react-query";

import { FaStar, FaRegStar } from "react-icons/fa";

import useAxios from "../../Hooks/useAxios";
import { Link } from "react-router";
import Swal from "sweetalert2";

const ReviewList = () => {
  const axiosInstance = useAxios();

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axiosInstance.get("/review");
      console.log("Fetched Reviews:", res.data);
      return res.data;
    },
  });

  const handleShowFullReview = (review) => {
    Swal.fire({
      title: `${review.memberName}'s Review`,
      html: `
    <div style="
      border: 1px solid #ddd; 
      padding: 15px; 
      border-radius: 8px; 
      text-align: left; 
      line-height: 1.6; 
      max-height: 60vh; 
      overflow-y: auto;
      box-sizing: border-box;
    ">
      ${review.reviewText}
    </div>
  `,
      confirmButtonText: "Close",
      width: "min(90vw, 600px)",
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading reviews...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">
        What Our Members Say
      </h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-xl shadow-md p-6 space-y-3 border border-gray-200"
          >
            {/* Member Info */}
            <div className="flex items-center gap-4">
              <img
                src={review.memberPhotoURL}
                alt={review.memberName}
                className="w-12 h-12 rounded-full border-2 border-primary"
              />
              <div>
                <h4 className="font-semibold">{review.memberName}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(review.reviwed_at).toLocaleString("en-GB", {
                    dateStyle: "short",
                    timeStyle: "short",
                    hour12: true,
                  })}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }).map((_, index) =>
                index < Math.floor(review.rating) ? (
                  <FaStar key={index} />
                ) : index < review.rating ? (
                  <FaStar key={index} className="opacity-50" />
                ) : (
                  <FaRegStar key={index} />
                )
              )}
              <span className="ml-2 text-sm text-gray-600">
                {review.rating}
              </span>
            </div>

            {/* Review Text */}
            {/* <p className="text-gray-700">{review.reviewText}</p> */}

            <p className="text-gray-700">
              {review.reviewText.length > 200 ? (
                <>
                  {review.reviewText.slice(0, 200)}
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={() => handleShowFullReview(review)}
                  >
                    <span>...</span>
                    <span className="underline text-sm text-primary hover:text-secondary ml-1">
                      Read More
                    </span>
                  </span>
                </>
              ) : (
                review.reviewText
              )}
            </p>

            {/* Trainer Name  */}
            <p className="text-sm font-medium">
              — For Trainer:{" "}
              <Link
                className="text-primary underline"
                to={`/trainer/${review.trainerId}`}
              >
                {review.trainerName}
              </Link>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
