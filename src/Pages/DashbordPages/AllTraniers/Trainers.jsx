import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const ApprovedTrainers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch approved trainers
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["approvedTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/trainers/approved");
      return res.data;
    },
  });

  // Remove Trainer
  const { mutate: removeTrainer } = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/trainers/remove-trainer/${id}`);
    },
    onSuccess: () => {
      toast.success("Trainer removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["approvedTrainers"] });
    },
  });

  const handleViewDetails = (trainer) => {
    Swal.fire({
      title: `${trainer.name}'s Details`,
      html: `
        <div style="text-align: left;">
          <img src="${trainer.image}" alt="${
        trainer.name
      }" style="width:100%; border-radius:10px; margin-bottom:10px"/>
          <p><b>Email:</b> ${trainer.email}</p>
          <p><b>Age:</b> ${trainer.age}</p>
          <p><b>Skills:</b> ${trainer.expertise}</p>
          <p><b>Available Days:</b> ${trainer.availableDays?.join(", ")}</p>
          <p><b>Available Slots:</b> ${trainer.availableSlots?.join(", ")}</p>
          <p><b>Description:</b> ${trainer.description}</p>
          <p><b>Joined At:</b> ${new Date(
            trainer.joined_At
          ).toLocaleDateString()}</p>
          <p><b>Facebook:</b> <a href="${
            trainer.socialLinks?.facebook
          }" target="_blank">${trainer.socialLinks?.facebook}</a></p>
          <p><b>Instagram:</b> <a href="${
            trainer.socialLinks?.instagram
          }" target="_blank">${trainer.socialLinks?.instagram}</a></p>
          <p><b>LinkedIn:</b> <a href="${
            trainer.socialLinks?.linkedin
          }" target="_blank">${trainer.socialLinks?.linkedin}</a></p>
        </div>
      `,
      confirmButtonText: "Close",
      width: 600,
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Approved Trainers</h2>
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full border rounded-lg shadow-lg">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Skills</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer, index) => (
              <tr key={trainer._id} className="hover:bg-gray-100">
                <td>{index + 1}</td>
                <td>{trainer.name}</td>
                <td>{trainer.email}</td>
                <td>{trainer.age}</td>
                <td>{trainer.expertise}</td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(trainer)}
                    className="btn btn-sm btn-primary text-white"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        text: "You are removing this trainer!",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Yes, remove!",
                      }).then((result) => {
                        if (result.isConfirmed) removeTrainer(trainer._id);
                      });
                    }}
                    className="btn btn-sm btn-error text-white"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="md:hidden grid gap-4">
        {trainers.map((trainer, index) => (
          <div key={trainer._id} className="border p-4 rounded-lg shadow-md">
            <img
              src={trainer.image}
              alt={trainer.name}
              className="w-full rounded-lg mb-3"
            />
            <h3 className="font-bold text-lg mb-1">{trainer.name}</h3>
            <p>
              <b>Email:</b> {trainer.email}
            </p>
            <p>
              <b>Age:</b> {trainer.age}
            </p>
            <p>
              <b>Skills:</b> {trainer.expertise}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleViewDetails(trainer)}
                className="btn btn-sm btn-primary flex-1 text-white"
              >
                <FaEye /> View
              </button>
              <button
                onClick={() => {
                  Swal.fire({
                    title: "Are you sure?",
                    text: "You are removing this trainer!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, remove!",
                  }).then((result) => {
                    if (result.isConfirmed) removeTrainer(trainer._id);
                  });
                }}
                className="btn btn-sm btn-error flex-1 text-white"
              >
                <FaTimes /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApprovedTrainers;
