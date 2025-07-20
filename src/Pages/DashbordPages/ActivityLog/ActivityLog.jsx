import { useEffect, useState } from "react";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { Link } from "react-router";

const ActivityLog = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure
      .get(`/my-application/${user.email}`)
      .then((res) => {
        setActivities(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, [user?.email, axiosSecure]);

  const handleViewFeedback = (message) => {
    Swal.fire({
      title: "Rejection Feedback",
      text: message || "No feedback provided.",
      icon: "info",
      confirmButtonText: "Close",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner text-primary loading-lg"></span>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="mt-16 text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-800">
          You haven't applied to become a trainer yet.
        </h2>
        <p className="text-lg text-gray-600">
          Ready to take the next step in your fitness journey?
        </p>
        <Link
          to="/be-trainer"
          className="inline-block mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold"
        >
          Apply to be a Trainer
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full mx-auto p-6 border border-primary rounded-2xl shadow-lg bg-base-100">
        <h2 className="text-2xl font-bold mb-4 text-center text-primary">
          My Application Activity Log
        </h2>

        <div className="overflow-x-auto mt-8">
          <table className="table w-full text-sm">
            <thead className="bg-base-200">
              <tr className="text-base text-base-content">
                <th>#</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((app, index) => (
                <tr key={app._id} className="hover:bg-base-100 transition">
                  <td className="font-semibold">{index + 1}</td>
                  <td>
                    <span
                      className={`badge 
                    ${
                      app.application_status === "pending"
                        ? "badge-warning"
                        : app.application_status === "rejected"
                        ? "badge-error"
                        : "badge-success"
                    } 
                  badge-outline px-4 py-1`}
                    >
                      {app.application_status.charAt(0).toUpperCase() +
                        app.application_status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {app.application_status === "rejected" ? (
                      <button
                        onClick={() =>
                          handleViewFeedback(app.rejectionFeedback)
                        }
                        className="btn btn-sm btn-outline btn-primary"
                        title="View Feedback"
                      >
                        <FaEye className="text-lg" />
                      </button>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
