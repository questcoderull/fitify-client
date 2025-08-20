import { useQuery } from "@tanstack/react-query";

import useAxios from "../../Hooks/useAxios";
import { FaClock, FaUsers } from "react-icons/fa";
import { MdOutlineSportsGymnastics } from "react-icons/md";
import { Link } from "react-router";

const FeaturedClasses = () => {
  const axios = useAxios();

  const { data: featured = [], isLoading } = useQuery({
    queryKey: ["featured-classes"],
    queryFn: async () => {
      const res = await axios.get("/featured-classes");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <p className="text-center py-10 text-lg">Loading featured classes...</p>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-primary mb-2 tracking-tight">
          🌟 Top Booked Classes
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto text-sm">
          Discover our top booked classes loved by members! These popular
          sessions offer the perfect mix of energy, expertise, and
          transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featured.map((cls) => (
          <div
            key={cls._id}
            className="group rounded-xl border-t-2 border-b-2 border-primary shadow-md hover:shadow-xl transition duration-300 overflow-hidden bg-white"
          >
            <div className="relative">
              <img
                src={cls.image}
                alt={cls.className}
                className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2 bg-white text-xs text-primary font-semibold px-3 py-1 rounded-full shadow">
                {cls.category}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <h3 className="text-xl font-bold text-primary group-hover:underline">
                <Link to={`/class-details/${cls._id}`}>{cls.className}</Link>
              </h3>

              <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                {cls.details.length > 180
                  ? cls.details.slice(0, 180) + "..."
                  : cls.details}
              </p>

              <div className="flex flex-wrap items-center justify-between text-sm font-medium mt-4 text-gray-600">
                <span className="flex items-center gap-1">
                  <FaClock className="text-primary" /> {cls.duration}
                </span>
                <span className="flex items-center gap-1">
                  <MdOutlineSportsGymnastics className="text-secondary" />{" "}
                  {cls.level}
                </span>
                <span className="flex items-center gap-1 text-rose-500 font-semibold">
                  <FaUsers /> {cls.bookedCount} Booked
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedClasses;
