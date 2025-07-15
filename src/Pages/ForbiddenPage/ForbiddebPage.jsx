import React from "react";
import { Link } from "react-router";

const ForbiddenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      <h1 className="text-7xl font-bold text-red-600">403</h1>
      <h2 className="text-3xl font-semibold mt-4 text-gray-800">
        Access Forbidden
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        Sorry, you don't have permission to access this page.
      </p>
      <Link to="/" className="mt-6">
        <button className="btn btn-primary">Go Back Home</button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
