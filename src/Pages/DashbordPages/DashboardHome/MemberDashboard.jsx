import React, { useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaQuoteLeft, FaQuoteRight, FaPlus } from "react-icons/fa";
import { MdForum, MdClass } from "react-icons/md";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth";

const MemberDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  const {
    data = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["memberStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/member-stats");
      return res.data;
    },
  });

  // ডাটা চেক করার জন্য console.log
  console.log("Dashboard data:", data);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    const quote = e.target.quote.value;

    if (!quote.trim()) return;

    const quoteData = {
      quote,
      authorName: user?.displayName,
      authorPhoto: user?.photoURL,
      submittedAt: new Date(),
    };

    try {
      const res = await axiosSecure.post("/quotes", quoteData);
      if (res.data.insertedId) {
        Swal.fire("Thank you!", "Your quote has been submitted.", "success");
        e.target.reset();
        setShowForm(false);
        refetch();
      }
    } catch (error) {
      console.error("Quote Submit Error", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <span className="loading loading-spinner text-primary"></span>
      </div>
    );
  }

  // এখানে নাম পরিবর্তন করে নিচ্ছি
  const { quote, recentForums = [], recentClasses = [] } = data;

  return (
    <div className="p-6 md:p-10 space-y-10 bg-gradient-to-b from-white via-slate-50 to-white min-h-screen my-12">
      {/* ✅ Welcome Section */}
      <div className="space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          Welcome back,{" "}
          <span className="text-secondary underline">{user?.displayName}!</span>
        </h2>
        <p className="text-gray-600 text-sm">
          Let’s continue your fitness journey today 💪
        </p>
      </div>

      {/* ✅ Recent Forum Posts and Recent Classes with card style */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Forum Posts */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            📢 Recent Forum Posts
          </h3>
          {recentForums.length > 0 ? (
            <ul className="space-y-4">
              {recentForums.map((post) => (
                <li key={post._id}>
                  <a
                    href={`/community/${post._id}`}
                    className="block p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:bg-blue-50 text-blue-800 hover:text-blue-900 font-medium"
                    title={post.title}
                  >
                    {post.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No recent forum posts.</p>
          )}
        </div>

        {/* Recent Classes */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            🆕 Recent Published Classes
          </h3>
          {recentClasses.length > 0 ? (
            <ul className="space-y-4">
              {recentClasses.map((cls) => (
                <li key={cls._id}>
                  <a
                    href={`/class-details/${cls._id}`}
                    className="block p-4 border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:bg-green-50 text-green-800 hover:text-green-900 font-medium"
                    title={cls.className}
                  >
                    {cls.className}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No recent classes.</p>
          )}
        </div>
      </section>

      {/* ✅ Quick Actions */}
      <section className="mb-16">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          🧭 Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <QuickAction
            icon={<MdForum />}
            title="Go to Forums"
            link="/community"
          />
          <QuickAction
            icon={<MdClass />}
            title="Browse Classes"
            link="/all-classes"
          />
          <QuickAction title="Find a Trainer" link="/all-trainers" />
        </div>
      </section>

      {/* ✅ Motivational Quote */}
      {quote && (
        <section className="bg-base-100 border-l-4 border-primary p-6 rounded shadow relative">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 border-t border-r border-primary rounded-tr-md"></div>

          <FaQuoteLeft className="text-primary text-xl absolute -top-2 -left-2" />

          <p className="text-lg font-semibold text-primary italic text-center">
            “{quote.quote}”
          </p>

          <div className="flex items-center justify-end gap-2 mt-3 text-sm text-gray-800">
            <img
              src={quote.authorPhoto}
              alt="author"
              className="w-8 h-8 rounded-full border"
            />
            — {quote.authorName}
          </div>

          <FaQuoteRight className="text-primary text-xl absolute -bottom-2 -right-2" />
        </section>
      )}

      {/* ✅ Submit Quote Section */}
      <section className="text-center mt-5">
        <div className="text-center space-y-1 mb-6">
          <p className="text-lg md:text-xl font-semibold text-primary">
            Want to inspire others with your own motivational quote?
          </p>
          <p className="text-base md:text-lg text-secondary">
            Share your quote — we’ll show it to others!
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-outline btn-primary mb-4"
        >
          <FaPlus className="mr-2" />
          Add Your Quote
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmitQuote}
            className="mt-4 space-y-3 max-w-lg mx-auto bg-base-100 p-4 rounded shadow border"
          >
            <textarea
              name="quote"
              placeholder="Write your motivational quote here..."
              className="textarea textarea-bordered w-full"
              rows="3"
              required
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-sm btn-primary">
                Submit
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

const QuickAction = ({ icon, title, link }) => (
  <a
    href={link}
    className="flex items-center gap-4 p-4 border rounded-xl bg-white shadow hover:bg-primary hover:text-white transition-all"
  >
    <div className="text-2xl">{icon}</div>
    <div className="text-lg font-medium capitalize">{title}</div>
  </a>
);

export default MemberDashboard;
