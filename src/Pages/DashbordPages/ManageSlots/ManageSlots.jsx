import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Swal from "sweetalert2";

const ManageSlots = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Get trainer info by email
  const {
    data: trainer = {},
    isPending: loadingTrainer,
    refetch: refetchTrainer,
  } = useQuery({
    queryKey: ["trainer", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/trainers-with-email/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Get bookings for this trainer
  const { data: bookings = [], isPending: loadingBookings } = useQuery({
    queryKey: ["bookings", trainer._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/bookings/trainer/${trainer._id}`);

      return res.data;
    },
    enabled: !!trainer?._id,
  });

  const handleDeleteSlot = async (day, label, time) => {
    const result = await Swal.fire({
      title: `Delete slot?`,
      text: `Are you sure you want to delete the slot: ${day} - ${label} - ${time}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/trainers/${trainer._id}/slot`, {
          data: { day, label, time },
        });

        if (res.data.message) {
          Swal.fire("Deleted!", res.data.message, "success");
          refetchTrainer();
        }
      } catch (error) {
        Swal.fire("Error!", "Failed to delete slot", "error");
        console.error(error);
      }
    }
  };

  if (loadingTrainer || loadingBookings) {
    return <p className="text-center mt-10">Loading slots...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto my-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Manage Slots</h2>

      {trainer?.structuredSlots?.length === 0 ? (
        <p className="text-center text-gray-500">No slots found</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="table table-zebra w-full text-sm">
            <thead className="bg-gray-200 text-gray-800 text-[15px]">
              <tr>
                <th>Day</th>
                <th>Label</th>
                <th>Time</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trainer.structuredSlots.map((dayBlock) =>
                dayBlock.slots.map((slotGroup) =>
                  slotGroup.times.map((time) => {
                    const matchedBooking = bookings.find(
                      (b) =>
                        b.day === dayBlock.day &&
                        b.label === slotGroup.label &&
                        b.time === time
                    );

                    return (
                      <tr key={`${dayBlock.day}-${slotGroup.label}-${time}`}>
                        <td>{dayBlock.day}</td>
                        <td>{slotGroup.label}</td>
                        <td>{time}</td>
                        <td>
                          {matchedBooking ? (
                            <span className="text-green-600 font-medium">
                              Booked by{" "}
                              {matchedBooking.memberName ||
                                matchedBooking.memberEmail}
                            </span>
                          ) : (
                            <span className="text-gray-500">Available</span>
                          )}
                        </td>
                        <td>
                          {matchedBooking ? (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => setSelectedBooking(matchedBooking)}
                            >
                              See Details
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleDeleteSlot(
                                  dayBlock.day,
                                  slotGroup.label,
                                  time
                                )
                              }
                              className="btn btn-sm btn-error text-white"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Booking Details */}
      {selectedBooking && (
        <dialog open className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-semibold mb-3">
              Member Booking Details
            </h3>
            <div className="flex flex-col items-center gap-2">
              <img
                src={
                  selectedBooking.memberImage ||
                  "https://i.ibb.co/YXxmbdJ/default-avatar.png"
                }
                alt="Member"
                className="w-20 h-20 rounded-full border shadow"
              />
              <p>
                <strong>Name:</strong> {selectedBooking.memberName}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.memberEmail}
              </p>
              <p>
                <strong>Package:</strong> {selectedBooking.package}
              </p>
              <p>
                <strong>Day:</strong> {selectedBooking.day}
              </p>
              <p>
                <strong>Label:</strong> {selectedBooking.label}
              </p>
              <p>
                <strong>Time:</strong> {selectedBooking.time}
              </p>
              <p>
                <strong>Paid fee:</strong> ${selectedBooking.amountPaid}
              </p>
              <p>
                <strong>Transaction ID:</strong> {selectedBooking.transactionId}
              </p>
              <p>
                <strong>Payment Time:</strong>{" "}
                {new Date(selectedBooking.paymentTime).toLocaleString()}
              </p>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ManageSlots;
