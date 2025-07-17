import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const Trainers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch trainers
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["trainers", "approved"],
    queryFn: async () => {
      const res = await axiosSecure.get("/trainers/approved");
      return res.data;
    },
  });

  // Remove trainer mutation
  const { mutate: removeTrainer } = useMutation({
    mutationFn: async (trainerId) => {
      const res = await axiosSecure.patch(
        `/trainers/remove-trainer/${trainerId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      console.log("Success Response:", data);
      if (
        data?.userUpdateResult?.modifiedCount > 0 &&
        data?.trainerUpdateResult?.modifiedCount > 0
      ) {
        toast.success("Trainer removed successfully!");
        queryClient.invalidateQueries({ queryKey: ["trainers", "approved"] });
      } else {
        toast.error("Failed to remove trainer");
      }
    },
    onError: (error) => {
      console.error("Error removing trainer:", error);
      toast.error("Something went wrong while removing trainer");
    },
  });

  // Handle remove with confirmation
  const handleRemoveTrainer = (trainerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This trainer will lose trainer access!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        removeTrainer(trainerId);
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">All Trainers</h2>
      <table className="table w-full border rounded-lg shadow-lg">
        <thead className="bg-primary text-white">
          <tr>
            <th>#</th>
            <th>Trainer Name</th>
            <th>Email</th>
            <th>Joined Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer, index) => (
            <tr key={trainer._id} className="hover:bg-gray-100">
              <td>{index + 1}</td>
              <td className="font-semibold">{trainer.name}</td>
              <td>{trainer.email}</td>
              <td>{new Date(trainer.joined_At).toLocaleDateString("en-US")}</td>
              <td>
                <button
                  onClick={() => handleRemoveTrainer(trainer._id)}
                  className="btn btn-sm btn-error text-white flex items-center gap-1"
                >
                  <FaTrashAlt /> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Trainers;
