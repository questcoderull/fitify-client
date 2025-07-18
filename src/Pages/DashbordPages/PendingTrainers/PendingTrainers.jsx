import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const PendingTrainers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch pending trainers
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["pendingTrainers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/trainers/pending");
      return res.data;
    },
  });

  // Approve Trainer
  const { mutate: approveTrainer } = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/trainers/approve/${id}`);
    },
    onSuccess: () => {
      toast.success("Trainer approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["pendingTrainers"] });
    },
  });

  // Reject Trainer
  const { mutate: rejectTrainer } = useMutation({
    mutationFn: async ({ id, feedback }) => {
      return await axiosSecure.patch(`/trainers/reject/${id}`, { feedback });
    },
    onSuccess: () => {
      toast.success("Trainer rejected with feedback!");
      queryClient.invalidateQueries({ queryKey: ["pendingTrainers"] });
    },
  });

  const handleShowDetails = (trainer) => {
    Swal.fire({
      title: `${trainer.name}'s Details`,
      html: `
      <div style="text-align: left">
      <img src="${trainer.image}" alt="${
        trainer.name
      }" style="width:100px;height:100px;border-radius:8px;margin-bottom:10px;" />
      <p><b>Email:</b> ${trainer.email}</p>
      <p><b>Age:</b> ${trainer.age}</p>
      <p><b>Skills:</b> ${trainer.expertise}</p>
      <p><b>Available Days:</b> ${trainer.availableDays?.join(", ")}</p>
      <p><b>Available Slots:</b> ${trainer.availableSlots?.join(", ")}</p>
      <p><b>Description:</b> ${trainer.description}</p>
      <p><b>Social Links:</b> 
        <a href="${
          trainer.socialLinks?.facebook
        }" target="_blank">Facebook</a> | 
        <a href="${
          trainer.socialLinks?.instagram
        }" target="_blank">Instagram</a> | 
        <a href="${trainer.socialLinks?.linkedin}" target="_blank">LinkedIn</a>
      </p>
        </div>
    `,
      width: 600,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Close",
    });
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are approving this trainer.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve!",
    }).then((result) => {
      if (result.isConfirmed) approveTrainer(id);
    });
  };

  const handleReject = (trainer) => {
    Swal.fire({
      title: `Reject ${trainer.name}?`,
      input: "textarea",
      inputLabel: "Feedback",
      inputPlaceholder: "Enter feedback here...",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
    }).then(({ isConfirmed, value }) => {
      if (isConfirmed && value) {
        rejectTrainer({ id: trainer._id, feedback: value });
      } else if (isConfirmed) {
        toast.error("Feedback is required");
      }
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Applied Trainers</h2>

      {/* Desktop/Table view */}
      <div className="hidden md:block">
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
                    onClick={() => handleShowDetails(trainer)}
                    className="btn btn-sm btn-primary text-white"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleApprove(trainer._id)}
                    className="btn btn-sm btn-success text-white"
                  >
                    <FaCheck />
                  </button>
                  <button
                    onClick={() => handleReject(trainer)}
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

      {/* Mobile view */}
      <div className="md:hidden grid gap-4">
        {trainers.map((trainer, index) => (
          <div
            key={trainer._id}
            className="border p-4 rounded-lg shadow-md flex flex-col gap-2"
          >
            <h3 className="font-bold text-lg">{trainer.name}</h3>
            <p>Email: {trainer.email}</p>
            <p>Age: {trainer.age}</p>
            <p>Skills: {trainer.expertise}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleShowDetails(trainer)}
                className="btn btn-sm btn-primary text-white flex-1"
              >
                <FaEye /> Details
              </button>
              <button
                onClick={() => handleApprove(trainer._id)}
                className="btn btn-sm btn-success text-white flex-1"
              >
                <FaCheck />
              </button>
              <button
                onClick={() => handleReject(trainer)}
                className="btn btn-sm btn-error text-white flex-1"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingTrainers;
