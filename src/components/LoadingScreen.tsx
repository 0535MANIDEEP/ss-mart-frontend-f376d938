
import React from "react";

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
    <svg className="animate-spin mb-4" width="60" height="60" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="none" stroke="#24b47e" strokeWidth="4" strokeDasharray="32 80" />
    </svg>
    <span className="text-lg font-semibold text-green-700 dark:text-green-300">Loading...</span>
  </div>
);

export default LoadingScreen;
