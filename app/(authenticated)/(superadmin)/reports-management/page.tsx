"use client";

import { TrackerToolbar } from "./_components/TrackerToolbar";
import { BugTable } from "./_components/BugTable";
import { BugDetailsDialog } from "./_components/BugDetailsDialog";
import { AddBugDialog } from "./_components/AddBugDialog";
import { useBugTracker } from "./_hooks/useBugTracker"; // Import the hook

export default function ReportsManagementPage() {
  // Destructure the state and functions from your custom hook
  const {
    displayedBugs,
    selectedBug,
    setSelectedBug,
    searchQuery,
    setSearchQuery,
    severitySort,
    setSeveritySort,
    dateSort,
    setDateSort,
    handleAddBug,
  } = useBugTracker();

  return (
    <div className="w-full h-full p-8 text-foreground">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Bugs tracker</h1>
        <p className="text-sm text-muted-foreground">
          Describe how your team plans to use this list
        </p>
      </div>

      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
        <TrackerToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          severitySort={severitySort}
          setSeveritySort={setSeveritySort}
          dateSort={dateSort}
          setDateSort={setDateSort}
        />

        <div className="flex-1">
          <BugTable
            bugs={displayedBugs}
            onRowClick={(bug) => setSelectedBug(bug)}
          />

          {displayedBugs.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No bugs match your search.
            </div>
          )}
        </div>

        <AddBugDialog onAddBug={handleAddBug} />
      </div>

      <BugDetailsDialog
        bug={selectedBug}
        isOpen={selectedBug !== null}
        onClose={() => setSelectedBug(null)}
      />
    </div>
  );
}
