import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { FaDumbbell } from "react-icons/fa";
import { Link } from "react-router";

const TeamSection = () => {
  const axiosInstance = useAxios();

  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ["teamTrainers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/random-trainers?limit=3");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading team members...</div>;
  }

  return (
    <section className="py-14 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-3">
        Meet Our Expert Trainers
      </h2>
      <p className="text-center text-gray-600 mb-10">
        Our team is here to help you achieve your fitness goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => (
          <div
            key={trainer._id}
            className="card bg-white shadow-md border-t-2 border-t-primary border-b-2 border-b-secondary rounded-xl hover:shadow-lg transition duration-300"
          >
            <figure className="pt-6 px-6">
              <div className="avatar">
                <div className="w-28 h-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 shadow">
                  <img
                    src={trainer.image || trainer.profileImage}
                    alt={trainer.name}
                    className="object-cover"
                  />
                </div>
              </div>
            </figure>

            <div className="card-body items-center text-center space-y-2">
              <h3 className="text-xl font-bold text-primary hover:underline">
                <Link to={`/trainer/${trainer._id}`}>{trainer.name}</Link>
              </h3>
              <p className="text-sm text-gray-700 italic">
                {trainer.bio?.slice(0, 100)}...
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {trainer.expertise?.map((item, i) => (
                  <span
                    key={i}
                    className="badge badge-outline badge-accent text-xs px-3 py-1"
                  >
                    <FaDumbbell className="inline mr-1" /> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
