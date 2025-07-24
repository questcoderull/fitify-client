import { Link } from "react-router";
import { FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 text-center">
      <div className="max-w-md w-full bg-white border-t-2 border-b-2 border-b-secondary border-t-primary rounded-2xl p-8 shadow-xl transition hover:shadow-2xl">
        <div className="flex justify-center mb-4 text-red-500">
          <FaExclamationTriangle size={60} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-lg font-semibold text-gray-700 mb-1">
          Page Not Found
        </p>
        <p className="text-sm text-gray-600 mb-6">
          Sorry! The page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-full font-semibold transition"
        >
          <FaArrowLeft /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
