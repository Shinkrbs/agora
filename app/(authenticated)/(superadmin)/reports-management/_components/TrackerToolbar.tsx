import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TrackerToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  severitySort: string;
  setSeveritySort: (val: string) => void;
  dateSort: string;
  setDateSort: (val: string) => void;
}

export const TrackerToolbar = ({
  searchQuery,
  setSearchQuery,
  severitySort,
  setSeveritySort,
  dateSort,
  setDateSort,
}: TrackerToolbarProps) => {
  // Helper function to clear the sorts
  const handleClearSorts = () => {
    setSeveritySort("None");
    setDateSort("None");
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b border-neutral-800/80">
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search bugs..."
          className="block w-full pl-9 pr-3 py-1.5 bg-[#121212] border border-neutral-700 rounded-md text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`p-1.5 border rounded-md transition-colors cursor-pointer ${
              severitySort !== "None" || dateSort !== "None"
                ? "border-emerald-600 text-emerald-500 bg-emerald-950/30"
                : "border-neutral-700 text-gray-400 hover:text-gray-200 hover:bg-neutral-800"
            }`}
          >
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
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
              ></path>
            </svg>
          </button>
        </PopoverTrigger>

        <PopoverContent
          className="w-72 bg-[#141414] border-neutral-800 p-4"
          align="end"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="font-medium text-sm text-white">Sort Reports</h4>
              {(severitySort !== "None" || dateSort !== "None") && (
                <button
                  onClick={handleClearSorts}
                  className="text-xs text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Severity</Label>
              <Select value={severitySort} onValueChange={setSeveritySort}>
                <SelectTrigger className="w-full bg-[#121212] border-neutral-700 text-gray-200 h-8 text-xs cursor-pointer">
                  <SelectValue placeholder="Sort by severity" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-neutral-700 text-gray-200">
                  <SelectItem value="None">Default</SelectItem>
                  <SelectItem value="Decreasing">
                    Decreasing (High to Low)
                  </SelectItem>
                  <SelectItem value="Increasing">
                    Increasing (Low to High)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Date Submitted</Label>
              <Select value={dateSort} onValueChange={setDateSort}>
                <SelectTrigger className="w-full bg-[#121212] border-neutral-700 text-gray-200 h-8 text-xs cursor-pointer">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent className="bg-[#1E1E1E] border-neutral-700 text-gray-200">
                  <SelectItem value="None">Default</SelectItem>
                  <SelectItem value="Decreasing">
                    Decreasing (Newest first)
                  </SelectItem>
                  <SelectItem value="Increasing">
                    Increasing (Oldest first)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
