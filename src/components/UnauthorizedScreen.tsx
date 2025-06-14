
import React from "react";
import { LogIn } from "lucide-react";
import { Link } from "react-router-dom";

const UnauthorizedScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <span className="text-5xl font-bold text-red-500 mb-3">403</span>
    <div className="text-lg mb-3 font-semibold text-gray-800 dark:text-gray-200">You are not authorized to view this page</div>
    <Link to="/auth" className="bg-green-600 hover:bg-green-700 text-white rounded py-2 px-4 flex gap-2 items-center">
      <LogIn className="size-5" />
      Login
    </Link>
  </div>
);

export default UnauthorizedScreen;
