import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Rating from "react-rating";
import { FaStar, FaRegStar } from "react-icons/fa";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Link } from "react-router";

const BookedTrainer = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["memberBookings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/member/${user.email}`);
      return res.data;
    },
  });

  const { data: trainers = {} } = useQuery({
    queryKey: ["trainerInfo", bookings],
    enabled: bookings.length > 0,
    queryFn: async () => {
      const trainerIds = [...new Set(bookings.map((b) => b.trainerId))];
      const responses = await Promise.all(
        trainerIds.map((id) => axiosSecure.get(`/trainers/${id}`))
      );
      const dataMap = {};
      responses.forEach((res) => {
        dataMap[res.data._id] = res.data;
      });
      return dataMap;
    },
  });

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [ratingValue, setRatingValue] = useState(3);

  const handleSubmitReview = async () => {
    if (!selectedBooking) return;
    if (!reviewText.trim()) {
      return toast.error("Please write a review");
    }
    if (!ratingValue) {
      return toast.error("Please write a review");
    }
    const payload = {
      trainerId: selectedBooking.trainerId,
      trainerName: trainers[selectedBooking.trainerId]?.name || "",

      memberName: user?.displayName || "Anonymous",
      memberEmail: user?.email,
      memberPhotoURL: user?.photoURL || "",

      rating: ratingValue,
      reviewText: reviewText,
      reviwed_at: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/review", payload);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Review submitted successfully", "success");
      } else {
        throw new Error("Failed");
      }
    } catch (err) {
      Swal.fire("Error", "Could not submit review", "error");
    }
    document.getElementById("review_modal").close();
    setReviewText("");
    setRatingValue(3);
    setSelectedBooking(null);
  };

  const showDetails = (booking) => {
    const trainer = trainers[booking.trainerId];
    Swal.fire({
      title: `Details for ${trainer?.name || "Trainer"}`,
      html: `
        <div style="text-align:left;">
          <img src="${
            trainer?.image || "https://i.ibb.co/YXxmbdJ/default-avatar.png"
          }"
               style="width:100px; height:100px; object-fit:cover; border-radius:50%; margin-bottom:10px;" />
          <p><b>Trainer Email:</b> ${trainer?.email || "N/A"}</p>
          <p><b>Member Name:</b> ${booking.memberName}</p>
          <p><b>Trainer skill:</b> ${booking.trainerSkill}</p>
          <p><b>Class:</b> <Link className="underline" to={/calssDetails/${
            booking.classId
          }}> ${booking.classTitle} </Link></p>
          <p><b>Day:</b> ${booking.day}</p>
          <p><b>Time:</b> ${booking.time}</p>
          <p><b>Label:</b> ${booking.label}</p>
          <p><b>Package:</b> ${booking.package}</p>
          <p><b>Paid:</b> $${booking.amountPaid}</p>
          <p><b>Transaction ID:</b> ${booking.transactionId}</p>
          <p><b>Payment Time:</b> ${new Date(
            booking.paymentTime
          ).toLocaleString()}</p>
        </div>
      `,
      confirmButtonText: "Close",
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading bookings...</p>;
  }

  if (bookings.length === 0) {
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
  }

  return (
    <div className="max-w-6xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">
        Your Booked Trainers
      </h2>

      {/* Card view on small devices */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings.map((booking) => {
          const trainer = trainers[booking.trainerId];
          return (
            <div
              key={booking._id}
              className="bg-white rounded-xl shadow-md border border-primary p-4"
            >
              <div className="flex items-center gap-4 mb-3">
                <img
                  src={
                    trainer?.image ||
                    "https://i.ibb.co/YXxmbdJ/default-avatar.png"
                  }
                  alt="Trainer"
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-lg">
                    {trainer?.name || "Loading..."}
                  </p>
                  <p className="text-sm text-gray-500">{trainer?.email}</p>
                </div>
              </div>
              <p>
                <b>Day:</b> {booking.day}
              </p>
              <p>
                <b>Time:</b> {booking.time}
              </p>
              <p>
                <b>Label:</b> {booking.label}
              </p>
              <p>
                <b>Package:</b> {booking.package}
              </p>
              <p>
                <span className="badge badge-success mt-1">Booked</span>
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => showDetails(booking)}
                >
                  Details
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    setSelectedBooking(booking);
                    document.getElementById("review_modal").showModal();
                  }}
                >
                  Review
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table view for medium and larger screens */}
      <div className="hidden md:block overflow-x-auto mt-6">
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
              const trainer = trainers[booking.trainerId];
              return (
                <tr key={booking._id}>
                  <td className="flex items-center gap-2">
                    <img
                      src={
                        trainer?.image ||
                        "https://i.ibb.co/YXxmbdJ/default-avatar.png"
                      }
                      alt="Trainer"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{trainer?.name}</p>
                      <p className="text-xs text-gray-500">{trainer?.email}</p>
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
                      onClick={() => showDetails(booking)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setSelectedBooking(booking);
                        document.getElementById("review_modal").showModal();
                      }}
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

      {/* Review Modal */}
      <dialog id="review_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center mb-4">Leave a Review</h3>
          <textarea
            className="textarea textarea-bordered w-full mb-4"
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Rating
              initialRating={ratingValue}
              onChange={(value) => setRatingValue(value)}
              emptySymbol={<FaRegStar className="text-2xl text-yellow-400" />}
              fullSymbol={<FaStar className="text-2xl text-yellow-500" />}
              fractions={2}
            />
            <span className="text-lg font-medium text-yellow-600">
              {ratingValue.toFixed(1)}
            </span>
          </div>

          <div className="modal-action">
            <form method="dialog" className="space-x-2">
              <button className="btn btn-outline">Cancel</button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmitReview}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BookedTrainer;
