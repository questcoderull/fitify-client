import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { formatDateTime } from "../../../utility/timeFormate";
import { Helmet } from "react-helmet-async";

const AllSubscribers = () => {
  const axiosSecure = useAxiosSecure();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/subscribes");
        setSubscribers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch subscribers");
        toast.error("Failed to load subscribers");
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold">{error}</div>
    );
  }

  return (
    <div className="overflow-x-auto p-4">
      <Helmet>
        <title>Fitify | Dashboard | All Subscriber</title>
      </Helmet>
      <h2 className="text-3xl font-bold mb-6 text-center">
        All Newsletter Subscribers
      </h2>

      {subscribers.length === 0 ? (
        <p className="text-center text-gray-600">No subscribers found.</p>
      ) : (
        <div className="overflow-auto rounded-lg shadow">
          <table className="table w-full text-center">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed Time</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber, index) => (
                <tr key={subscriber._id} className="hover:bg-gray-100">
                  <td>{index + 1}</td>
                  <td className="font-semibold">{subscriber.name}</td>
                  <td>{subscriber.email}</td>
                  <td>{formatDateTime(subscriber.subscribed_At)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllSubscribers;
