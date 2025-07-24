import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import { FaArrowRight } from "react-icons/fa";

const LatestCommunityPosts = () => {
  const axiosInstance = useAxios();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["latestCommunityPosts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/latest-forums?limit=6");
      return res.data;
    },
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading latest posts...</div>;
  }

  return (
    <section className="py-10 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-primary mb-2">
        Latest Community Posts
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Discover fresh insights, stories, and helpful articles from our
        community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post._id}
            className="card bg-white shadow-md border rounded-xl hover:shadow-lg transition duration-300"
          >
            <figure className="h-48 overflow-hidden rounded-t-xl">
              <img
                src={post.contentImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </figure>
            <div className="card-body p-5">
              <h3 className="text-lg font-bold text-primary mb-1 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {post.content}
              </p>

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={post.authorPhoto}
                  alt={post.authorName}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {post.authorName}
                  </p>
                  <span
                    className={`badge text-[10px] uppercase font-medium mt-1 ${
                      post.role === "admin"
                        ? "badge-primary"
                        : post.role === "trainer"
                        ? "badge-secondary"
                        : "badge-accent"
                    }`}
                  >
                    {post.role}
                  </span>
                </div>
              </div>

              <Link
                to={`/community/${post._id}`}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"
              >
                Read Full Post <FaArrowRight className="text-xs mt-[1px]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestCommunityPosts;
