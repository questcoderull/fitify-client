import React from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  FaUser,
  FaMoneyBill,
  FaUsers,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { MdForum, MdClass, MdSupervisorAccount } from "react-icons/md";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const axiosSeure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSeure.get("/dashboard/admin-stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center h-64 items-center">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  const {
    summary,
    trainerStatus,
    forumStats,
    classStats,
    trainerStats,
    recentActivity,
  } = stats;

  return (
    <div className="p-6 space-y-10 my-12">
      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<FaChalkboardTeacher />}
          title="Total Trainers"
          value={summary.totalTrainers}
        />
        <StatCard
          icon={<FaUsers />}
          title="Total Members"
          value={summary.totalMembers}
        />
        <StatCard
          icon={<MdClass />}
          title="Total Classes"
          value={summary.totalClasses}
        />
        <StatCard
          icon={<MdForum />}
          title="Forum Posts"
          value={summary.totalForums}
        />
        <StatCard
          icon={<FaMoneyBill />}
          title="Total Income"
          value={`$${summary.totalIncome}`}
        />
        <StatCard
          icon={<FaMoneyBill />}
          title="Today's Income"
          value={`$${summary.todayIncome}`}
        />
        <StatCard
          icon={<FaUser />}
          title="Total Users"
          value={summary.totalUsers}
        />
        <StatCard
          icon={<MdSupervisorAccount />}
          title="Subscribers"
          value={summary.totalSubscribers}
        />
      </div>

      {/* 🧑‍🏫 Trainer Status */}
      <SectionTitle title="Trainer Status Overview" />
      <div className="max-w-md mx-auto">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              dataKey="value"
              data={[
                { name: "Approved", value: trainerStatus.approved },
                { name: "Pending", value: trainerStatus.pending },
                { name: "Rejected", value: trainerStatus.rejected },
              ]}
              outerRadius={100}
              fill="#8884d8"
              label
            >
              <Cell fill="#00C49F" />
              <Cell fill="#FFBB28" />
              <Cell fill="#FF4D4F" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 🧵 Forum Overview */}
      <SectionTitle title="Forum Insights" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Admin Posts" value={forumStats.admin} />
        <StatCard title="Trainer Posts" value={forumStats.trainer} />
        <div className="col-span-full p-4 bg-base-100 border rounded shadow">
          <p className="font-semibold mb-2 text-primary">Top 3 Voted Forums</p>
          {forumStats.top && forumStats.top.length > 0 ? (
            <ul className="space-y-2">
              {forumStats.top.map((forum, i) => (
                <li key={i} className="text-sm text-gray-700">
                  🔥 {forum.title} — {forum.upVotes?.length} upvotes
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No posts yet.</p>
          )}
        </div>
      </div>

      {/* 🏋️ Class & Booking Insights */}
      <SectionTitle title="Class & Booking Highlights" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-full p-4 bg-base-100 border rounded shadow">
          <p className="font-semibold mb-2 text-primary">
            Top 3 Booked Classes
          </p>
          {classStats.mostBooked && classStats.mostBooked.length > 0 ? (
            <ul className="space-y-2">
              {classStats.mostBooked.map((cls, i) => (
                <li key={i} className="text-sm text-gray-700">
                  🏋️ {cls.className} — {cls.bookedCount} bookings
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No classes booked yet.</p>
          )}
        </div>
        <div className="col-span-full p-4 bg-base-100 border rounded shadow">
          <p className="font-semibold mb-2 text-primary">
            Top 3 Booked Trainers
          </p>
          {trainerStats.topTrainer && trainerStats.topTrainer.length > 0 ? (
            <ul className="space-y-2">
              {trainerStats.topTrainer.map((t, i) => (
                <li key={i} className="text-sm text-gray-700">
                  🧑‍🏫 {t.trainerName} — {t.count} bookings
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No trainer bookings yet.</p>
          )}
        </div>
      </div>

      {/* 🕓 Recent Activities */}
      <SectionTitle title="Recent Activities" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentList
          title="Recent Payments"
          items={recentActivity.payments}
          render={(item) => (
            <li className="text-sm text-gray-700">
              💸 ${item.amount} by {item.memberEmail}
            </li>
          )}
        />
        <RecentList
          title="Latest Users"
          items={recentActivity.users}
          render={(item) => (
            <li className="text-sm text-gray-700">👤 {item.name}</li>
          )}
        />
        <RecentList
          title="New Trainers"
          items={recentActivity.trainers}
          render={(item) => (
            <li className="text-sm text-gray-700">🏋️ {item.name}</li>
          )}
        />
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({ icon, title, value }) => (
  <div className="p-4 bg-base-100 border shadow rounded flex items-center gap-4">
    <div className="text-3xl text-primary">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-lg font-bold">{value}</h2>
    </div>
  </div>
);

const SectionTitle = ({ title }) => (
  <h2 className="text-xl font-bold text-primary border-b pb-1">{title}</h2>
);

const RecentList = ({ title, items, render }) => (
  <div className="bg-base-100 p-4 border shadow rounded">
    <h3 className="text-primary font-semibold mb-2">{title}</h3>
    <ul className="space-y-1">
      {items?.map((item, i) => (
        <li key={i}>{render(item)}</li>
      ))}
    </ul>
  </div>
);

export default AdminDashboard;
