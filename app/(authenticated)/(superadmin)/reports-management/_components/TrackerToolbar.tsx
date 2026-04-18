export const TrackerToolbar = () => {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-neutral-800/80">
      {/* Search Input */}
      <div className="relative flex-1 max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-neutral-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      {/* Filter Button */}
      <button className="p-1.5 border border-neutral-700 rounded-md text-gray-400 hover:text-gray-200 hover:bg-neutral-800 transition-colors">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          ></path>
        </svg>
      </button>
    </div>
  );
};
