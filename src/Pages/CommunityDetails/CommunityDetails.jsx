import { Link, useParams } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "../../Hooks/useAxios";
import toast from "react-hot-toast";
import { FaArrowUp, FaArrowDown, FaArrowLeft } from "react-icons/fa";
import useAuth from "../../Hooks/useAuth";

const CommunityDetails = () => {
  const { id } = useParams();
  const axiosInstance = useAxios();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ["communityPost", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/forums/${id}`);
      return res.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async ({ id, type }) => {
      const res = await axiosInstance.patch(`/forums/vote/${id}`, {
        email: user?.email,
        type,
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
      queryClient.invalidateQueries(["communityPost", id]);
    },
    onError: () => {
      toast.error("Failed to vote");
    },
  });

  const handleVote = (type) => {
    if (!user) return toast.error("Please log in to vote!");

    const alreadyUp = post.upVotes?.includes(user.email);
    const alreadyDown = post.downVotes?.includes(user.email);

    if ((type === "up" && alreadyUp) || (type === "down" && alreadyDown)) {
      voteMutation.mutate({ id, type: "remove" });
      return;
    }

    voteMutation.mutate({ id, type });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading post...</div>;
  }

  const upVoted = post.upVotes?.includes(user?.email);
  const downVoted = post.downVotes?.includes(user?.email);

  return (
    <section className="py-10 px-4 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-4 text-center">
        {post.title}
      </h2>

      {post.contentImage && (
        <img
          src={post.contentImage}
          alt={post.title}
          className="w-full max-h-[450px] object-cover rounded-lg mb-6 shadow"
        />
      )}

      <div className="flex items-center gap-4 mb-6">
        <img
          src={post.authorPhoto}
          alt={post.authorName}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="text-sm font-medium text-gray-800">{post.authorName}</p>
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

      <p className="text-gray-700 leading-relaxed text-justify mb-6">
        {post.content}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 border-t pt-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleVote("up")}
            className={`btn btn-sm flex items-center gap-2 rounded-full px-4 ${
              upVoted ? "btn-primary text-white" : "btn-outline"
            }`}
          >
            <FaArrowUp /> Upvote ({post.upVotes?.length})
          </button>

          <button
            onClick={() => handleVote("down")}
            className={`btn btn-sm flex items-center gap-2 rounded-full px-4 ${
              downVoted ? "btn-error text-white" : "btn-outline"
            }`}
          >
            <FaArrowDown /> Downvote ({post.downVotes?.length})
          </button>
        </div>

        <p className="text-sm text-gray-500 text-right sm:text-left">
          Posted on:{" "}
          {new Date(post.added_At).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>

      <div className="mt-6">
        <Link
          to="/community"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to Community
        </Link>
      </div>
    </section>
  );
};

export default CommunityDetails;
