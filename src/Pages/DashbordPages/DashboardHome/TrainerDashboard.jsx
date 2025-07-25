import React from "react";
import useAuth from "../../../Hooks/useAuth";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const TrainerDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["trainerStats", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/api/dashboard/trainer-stats?email=${user?.email}`
      );
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner text-primary w-12 h-12 mb-4"></span>
        <p className="text-center text-gray-600 text-sm">
          Loading trainer's dashboard, please wait...
        </p>
      </div>
    );
  }

  const {
    stats,
    upcomingSlots,
    topSlot,
    recentBookings,
    latestReviews,
    relatedClasses,
  } = data;

  return (
    <div className="p-6 space-y-10 my-12">
      <h2 className="text-2xl font-bold text-primary">👨‍🏫 Trainer Dashboard</h2>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Slots Created" value={stats.totalSlotsCreated} />
        <Card title="Total Slots Booked" value={stats.totalSlotsBooked} />
        <Card title="Total Earnings" value={`$${stats.totalEarnings}`} />
        <Card title="Total Reviews" value={stats.totalReviews} />
        <Card title="Average Rating" value={stats.averageRating.toFixed(1)} />
      </div>

      {/* Upcoming Slots */}
      <Section title="📅 Upcoming Slots">
        {upcomingSlots?.map((day, i) => (
          <div key={i} className="mb-4">
            <p className="font-bold text-primary">{day.day}</p>
            {day.slots.map((s, idx) => (
              <p key={idx} className="text-sm">
                {s.label}: {s.times.join(", ")}
              </p>
            ))}
          </div>
        ))}
      </Section>

      {/* Top Booked Time Slot */}
      <Section title="⏰ Most Booked Time Slot">
        <p>
          {topSlot?._id || "N/A"} — {topSlot?.count || 0} bookings
        </p>
      </Section>

      {/* Recent Bookings */}
      <Section title="🧾 Recent Bookings">
        <ul className="space-y-1">
          {recentBookings.map((b, i) => (
            <li key={i} className="text-sm text-gray-700">
              {b.memberEmail} — {b.day} {b.time}
            </li>
          ))}
        </ul>
      </Section>

      {/* Latest Reviews */}
      <Section title="⭐ Latest Reviews">
        <ul className="space-y-1">
          {latestReviews.map((r, i) => (
            <li key={i} className="text-sm text-gray-700">
              {r.memberEmail} — {r.rating}⭐
            </li>
          ))}
        </ul>
      </Section>

      {/* Related Classes */}
      <Section title="🏋️‍♂️ Related Classes">
        <ul className="space-y-1">
          {relatedClasses.map((cls, i) => (
            <li key={i} className="text-sm text-gray-700">
              {cls.className} ({cls.category})
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-base-100 p-4 border rounded shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-semibold text-primary border-b mb-2 pb-1">
      {title}
    </h3>
    <div>{children}</div>
  </div>
);

export default TrainerDashboard;
