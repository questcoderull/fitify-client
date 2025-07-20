import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";

const Community = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();

  // Fetch forums from backend
  const { data: forums = [], isLoading } = useQuery({
    queryKey: ["forums"],
    queryFn: async () => {
      const res = await axiosInstance.get("/forums");
      return res.data;
    },
  });

  // Upvote/downvote handler
  const voteMutation = useMutation({
    mutationFn: async ({ id, type }) => {
      const res = await axiosInstance.patch(`/forums/vote/${id}`, {
        email: user?.email,
        type, // 'up' or 'down'
      });
      return { data: res.data, type };
    },
    onSuccess: (result) => {
      const voteType = result.type;

      if (voteType === "up") {
        toast.success("Glad you found it helpful!");
      } else if (voteType === "down") {
        toast.success("No worries! We respect your opinion.");
      }
      queryClient.invalidateQueries(["forums"]);
    },
    onError: () => {
      toast.error("Failed to vote");
    },
  });

  const handleVote = (id, type) => {
    if (!user) {
      return toast.error("Please log in to vote!");
    }

    const post = forums.find((f) => f._id === id);
    const alreadyUp = post.upVotes?.includes(user.email);
    const alreadyDown = post.downVotes?.includes(user.email);

    if ((type === "up" && alreadyUp) || (type === "down" && alreadyDown)) {
      voteMutation.mutate({ id, type: "remove" });
      return;
    }
    voteMutation.mutate({ id, type });
  };

  if (isLoading)
    return <div className="text-center mt-10">Loading forums...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-center mb-6">Community Forums</h1>

      <div className="space-y-6">
        {forums.map((post) => {
          const upVoted = post.upVotes?.includes(user?.email);
          const downVoted = post.downVotes?.includes(user?.email);

          return (
            <div
              key={post._id}
              className="card bg-base-100 border border-gray-300"
            >
              <div className="card-body">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorPhoto}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{post.authorName}</p>
                    <span
                      className={`badge badge-outline text-xs ${
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

                <h2 className="text-xl font-bold mt-3">{post.title}</h2>

                {post.contentImage && (
                  <img
                    src={post.contentImage}
                    alt="Forum"
                    className="w-full max-h-80 object-cover rounded-md mt-3"
                  />
                )}

                <p className="mt-4">{post.content}</p>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex items-center gap-3">
                    <button
                      className={`btn btn-sm ${
                        upVoted ? "btn-primary text-white" : "btn-outline"
                      }`}
                      onClick={() =>
                        handleVote(post._id, "up", upVoted || downVoted)
                      }
                    >
                      <FaArrowUp /> {post.upVotes?.length}
                    </button>
                    <button
                      className={`btn btn-sm ${
                        downVoted ? "btn-error text-white" : "btn-outline"
                      }`}
                      onClick={() =>
                        handleVote(post._id, "down", upVoted || downVoted)
                      }
                    >
                      <FaArrowDown /> {post.downVotes?.length}
                    </button>
                  </div>

                  <p className="text-sm opacity-60 ml-2">
                    Posted on: {new Date(post.added_At).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Community;
