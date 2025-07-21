import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const BookedTrainer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch bookings for member
  const {
    data: bookings = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["memberBookings", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/member/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Cache trainers info by ID
  const [trainersCache, setTrainersCache] = useState({});

  useEffect(() => {
    async function fetchTrainers() {
      const newCache = { ...trainersCache };
      for (const booking of bookings) {
        if (!newCache[booking.trainerId]) {
          try {
            const res = await axiosSecure.get(`/trainers/${booking.trainerId}`);
            newCache[booking.trainerId] = res.data;
          } catch {
            newCache[booking.trainerId] = null;
          }
        }
      }
      setTrainersCache(newCache);
    }
    if (bookings.length) fetchTrainers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookings]);

  if (isLoading)
    return (
      <p className="text-center mt-10 font-semibold">
        Loading your bookings...
      </p>
    );

  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">Failed to load bookings.</p>
    );

  if (bookings.length === 0)
    return (
      <div className="text-center mt-20 space-y-4">
        <h2 className="text-xl font-semibold text-gray-600">
          You haven’t booked any trainers yet.
        </h2>
        <a href="/all-trainers" className="btn btn-primary">
          Book a Trainer
        </a>
      </div>
    );

  // Show booking details in Swal.fire (plain HTML string)
  const showBookingDetails = (booking) => {
    const trainer = trainersCache[booking.trainerId] || {};
    Swal.fire({
      title: `Booking Details for <strong style="color:#2563eb;">${
        trainer.name || "Trainer"
      }</strong>`,
      html: `
        <div style="text-align:left;">
          <img
            src="${
              trainer.image || "https://i.ibb.co/YXxmbdJ/default-avatar.png"
            }"
            alt="Trainer"
            style="width:100px; border-radius:50%; margin-bottom:15px;"
          />
          <p><b>Trainer Email:</b> ${trainer.email || "N/A"}</p>
          <p><b>Member Name:</b> ${booking.memberName}</p>
          <p><b>Member Email:</b> ${booking.memberEmail}</p>
          <p><b>Day:</b> ${booking.day}</p>
          <p><b>Label:</b> ${booking.label}</p>
          <p><b>Time:</b> ${booking.time}</p>
          <p><b>Package:</b> ${booking.package}</p>
          <p><b>Paid Amount:</b> $${booking.amountPaid}</p>
          <p><b>Transaction ID:</b> ${booking.transactionId}</p>
          <p><b>Payment Time:</b> ${new Date(
            booking.paymentTime
          ).toLocaleString()}</p>
        </div>
      `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Close",
    });
  };

  // Show review modal with textarea and rating using plain HTML
  const handleReview = (booking) => {
    Swal.fire({
      title: "Leave a Review",
      html: `
        <textarea id="review-text" class="swal2-textarea" placeholder="Write your feedback here..."></textarea>
        <div style="margin-top:10px; text-align:center;">
          <label>Rating: </label>
          <select id="review-rating" class="swal2-select" style="width:60px;">
            <option value="1">1⭐</option>
            <option value="2">2⭐</option>
            <option value="3" selected>3⭐</option>
            <option value="4">4⭐</option>
            <option value="5">5⭐</option>
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Submit",
      preConfirm: () => {
        const reviewText = document.getElementById("review-text").value.trim();
        const rating = parseInt(document.getElementById("review-rating").value);
        if (!reviewText) {
          Swal.showValidationMessage("Please enter your review!");
          return false;
        }
        return { reviewText, rating };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.post("/reviews", {
            trainerId: booking.trainerId,
            trainerName: trainersCache[booking.trainerId]?.name || "",
            memberName: booking.memberName,
            rating: result.value.rating,
            reviewText: result.value.reviewText,
            date: new Date().toISOString(),
          });
          Swal.fire("Success!", "Your review has been submitted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to submit review.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-5xl mx-auto my-10 p-6 bg-white shadow rounded-xl border border-primary">
      <h2 className="text-3xl font-bold text-center mb-8">
        Your Booked Trainers
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th>Trainer</th>
              <th>Day</th>
              <th>Label</th>
              <th>Time</th>
              <th>Package</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const trainer = trainersCache[booking.trainerId];
              return (
                <tr key={booking._id}>
                  <td className="flex items-center gap-2">
                    <img
                      src={
                        trainer?.image ||
                        "https://i.ibb.co/YXxmbdJ/default-avatar.png"
                      }
                      alt={trainer?.name || "Trainer"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {trainer?.name || "Loading..."}
                      </p>
                      <p className="text-xs text-gray-500">
                        {trainer?.email || ""}
                      </p>
                    </div>
                  </td>
                  <td>{booking.day}</td>
                  <td>{booking.label}</td>
                  <td>{booking.time}</td>
                  <td>{booking.package}</td>
                  <td>
                    <span className="badge badge-success">Booked</span>
                  </td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => showBookingDetails(booking)}
                    >
                      See Details
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleReview(booking)}
                    >
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookedTrainer;
