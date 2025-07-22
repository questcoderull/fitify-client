import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Mutation to make a user admin
  const { mutate: makeAdmin } = useMutation({
    mutationFn: async (userId) => {
      return await axiosSecure.patch(`/users/admin/${userId}`);
    },
    onSuccess: () => {
      Swal.fire("Success!", "User is now an admin", "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: () => {
      Swal.fire("Error", "Could not make admin", "error");
    },
  });

  const handleMakeAdmin = (user) => {
    if (user.role === "admin") {
      return Swal.fire("Info", "This user is already an admin", "info");
    }

    Swal.fire({
      title: "Are you sure?",
      text: `Make ${user.name} an admin?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, make admin",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdmin(user._id);
      }
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto my-10 p-4">
      <h2 className="text-3xl font-bold text-center mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={
                      user.profilePic ||
                      "https://i.ibb.co/YXxmbdJ/default-avatar.png"
                    }
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span
                    className={`badge ${
                      user.role === "admin"
                        ? "badge-success"
                        : user.role === "trainer"
                        ? "badge-info"
                        : "badge-secondary"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleMakeAdmin(user)}
                    className="btn btn-sm btn-primary"
                    disabled={user.role === "admin"}
                  >
                    Make Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MakeAdmin;
