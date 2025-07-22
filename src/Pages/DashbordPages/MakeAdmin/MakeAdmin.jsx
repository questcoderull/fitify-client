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

  // Make admin mutation
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

  // Remove admin mutation
  const { mutate: removeAdmin } = useMutation({
    mutationFn: async (userId) => {
      return await axiosSecure.patch(`/users/remove-admin/${userId}`);
    },
    onSuccess: () => {
      Swal.fire("Removed!", "Admin role removed successfully", "success");
      queryClient.invalidateQueries(["allUsers"]);
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Could not remove admin role",
        "error"
      );
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

  const handleRemoveAdmin = (user) => {
    Swal.fire({
      title: `Remove admin role from ${user.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove admin",
    }).then((result) => {
      if (result.isConfirmed) {
        removeAdmin(user._id);
      }
    });
  };

  if (isLoading) {
    return <p className="text-center mt-10">Loading users...</p>;
  }

  const members = users.filter((u) => u.role === "member");
  const trainers = users.filter((u) => u.role === "trainer");
  const admins = users.filter((u) => u.role === "admin");

  return (
    <div className="max-w-6xl mx-auto p-4 my-10">
      <h2 className="text-3xl font-bold text-center mb-6">User Management</h2>

      <div className="tabs tabs-lift tabs-md w-full">
        {/* Members Tab */}
        <input
          type="radio"
          name="users_tab"
          className="tab"
          aria-label="Members"
          defaultChecked
        />
        <div className="tab-content bg-base-100 border-base-300 p-4 rounded-md">
          <UserTable
            data={members}
            title="Members"
            onMakeAdmin={handleMakeAdmin}
          />
        </div>

        {/* Trainers Tab */}
        <input
          type="radio"
          name="users_tab"
          className="tab"
          aria-label="Trainers"
        />
        <div className="tab-content bg-base-100 border-base-300 p-4 rounded-md">
          <UserTable
            data={trainers}
            title="Trainers"
            onMakeAdmin={handleMakeAdmin}
          />
        </div>

        {/* Admins Tab */}
        <input
          type="radio"
          name="users_tab"
          className="tab"
          aria-label="Admins"
        />
        <div className="tab-content bg-base-100 border-base-300 p-4 rounded-md">
          <UserTable
            data={admins}
            title="Admins"
            onRemoveAdmin={handleRemoveAdmin}
          />
        </div>
      </div>
    </div>
  );
};

export default MakeAdmin;

// 👇 Embedded Subcomponent for Showing User Table
const UserTable = ({ data, title, onMakeAdmin, onRemoveAdmin }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-3">{title} List</h3>

      {data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()} found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                {(onMakeAdmin || onRemoveAdmin) && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
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
                  {(onMakeAdmin || onRemoveAdmin) && (
                    <td>
                      {onMakeAdmin && (
                        <button
                          className="btn btn-sm btn-primary"
                          disabled={user.role === "admin"}
                          onClick={() => onMakeAdmin(user)}
                        >
                          Make Admin
                        </button>
                      )}
                      {onRemoveAdmin && (
                        <button
                          className="btn btn-sm btn-error text-white"
                          onClick={() => onRemoveAdmin(user)}
                        >
                          Remove Admin
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
