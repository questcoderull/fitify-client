import { Link } from "react-router";
import { FaBug, FaArrowLeft, FaRedo } from "react-icons/fa";

const ErrorPage = () => {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 text-center">
      <div className="max-w-md w-full bg-white border-t-2 border-b-2 border-b-secondary border-t-primary rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">
        <div className="flex justify-center mb-4 text-red-500">
          <FaBug size={60} className="animate-bounce" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          An unexpected error has occurred. Please try again later or reload the
          page.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition"
          >
            <FaArrowLeft /> Back to Home
          </Link>
          <button
            onClick={handleReload}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-full font-semibold transition cursor-pointer"
          >
            <FaRedo /> Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
