import { TrackerToolbar } from "./_components/TrackerToolbar";
import { BugTable } from "./_components/BugTable";
import { BugReport } from "./_types";

const mockData: BugReport[] = [
  {
    id: "1",
    summary: "App version 10.12 crashes",
    severity: "High",
    details: "Welcome screen freezes and...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
  {
    id: "2",
    summary: "Passwordless login creates loop",
    severity: "High",
    details: "Sign in page routes back to...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
  {
    id: "3",
    summary: "Ingredients list hidden on small devices",
    severity: "Medium",
    details: "Doesn’t load if screen width is...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
];

export default function ReportsManagementPage() {
  return (
    <div className="w-full h-full p-8 text-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
          Bugs tracker
        </h1>
        <p className="text-sm text-gray-400">
          View and Review all reported bugs across the platform.
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-[#141414] border border-neutral-800 rounded-lg shadow-sm overflow-hidden flex flex-col">
        <TrackerToolbar />

        <div className="flex-1">
          <BugTable bugs={mockData} />
        </div>

        {/* Footer Action */}
        <div className="p-3 border-t border-neutral-800/80 bg-[#171717] hover:bg-[#1E1E1E] transition-colors cursor-pointer flex items-center group">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-gray-200 ml-3">
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
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add item
          </button>
        </div>
      </div>
    </div>
  );
}
