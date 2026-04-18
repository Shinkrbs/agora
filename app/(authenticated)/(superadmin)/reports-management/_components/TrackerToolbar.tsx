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
    <div className="flex items-center gap-3 p-4 border-b border-border">
      <div className="relative flex-1 max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-muted-foreground"
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
          className="block w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors"
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`p-1.5 border rounded-md transition-colors cursor-pointer ${
              severitySort !== "None" || dateSort !== "None"
                ? "border-primary text-primary bg-primary/10"
                : "border-border text-muted-foreground hover:text-foreground hover:bg-accent"
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

        {/* Removed hardcoded background, fallback to shadcn's default bg-popover */}
        <PopoverContent
          className="w-72 bg-popover text-popover-foreground border-border p-4"
          align="end"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <h4 className="font-medium text-sm text-foreground">
                Sort Reports
              </h4>
              {(severitySort !== "None" || dateSort !== "None") && (
                <button
                  onClick={handleClearSorts}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Severity</Label>
              <Select value={severitySort} onValueChange={setSeveritySort}>
                {/* Added explicit border-border and bg-background to ensure visibility */}
                <SelectTrigger className="w-full bg-background border-border text-foreground h-8 text-xs cursor-pointer">
                  <SelectValue placeholder="Sort by severity" />
                </SelectTrigger>
                {/* Removed hardcoded content styles, letting it inherit popover defaults */}
                <SelectContent className="border-border">
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
              <Label className="text-xs text-muted-foreground">
                Date Submitted
              </Label>
              <Select value={dateSort} onValueChange={setDateSort}>
                <SelectTrigger className="w-full bg-background border-border text-foreground h-8 text-xs cursor-pointer">
                  <SelectValue placeholder="Sort by date" />
                </SelectTrigger>
                <SelectContent className="border-border">
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
