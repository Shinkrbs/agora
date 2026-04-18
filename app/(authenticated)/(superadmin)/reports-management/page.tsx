"use client";
import { useState } from "react";
import { TrackerToolbar } from "./_components/TrackerToolbar";
import { BugTable } from "./_components/BugTable";
import { BugDetailsDialog } from "./_components/BugDetailsDialog";
import { AddBugDialog } from "./_components/AddBugDialog";
import { BugReport } from "./_types";
import mockData from "./_data/mockbugs";

export default function ReportsManagementPage() {
  const [bugs, setBugs] = useState<BugReport[]>(mockData);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);

  const handleAddBug = (newBug: BugReport) => {
    setBugs((prev) => [...prev, newBug]);
  };
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
          <BugTable bugs={bugs} onRowClick={(bug) => setSelectedBug(bug)} />
        </div>
        <AddBugDialog onAddBug={handleAddBug} />
        <BugDetailsDialog
          bug={selectedBug}
          isOpen={selectedBug !== null}
          onClose={() => setSelectedBug(null)}
        />
      </div>
    </div>
  );
}
