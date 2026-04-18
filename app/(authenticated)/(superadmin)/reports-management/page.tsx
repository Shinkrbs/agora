"use client";

import { useState, useMemo } from "react";
import { TrackerToolbar } from "./_components/TrackerToolbar";
import { BugTable } from "./_components/BugTable";
import { BugDetailsDialog } from "./_components/BugDetailsDialog";
import { AddBugDialog } from "./_components/AddBugDialog";
import { BugReport } from "./_types/index";
import mockData from "./_data/mockbugs";

export default function ReportsManagementPage() {
  const [bugs, setBugs] = useState<BugReport[]>(mockData);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);

  // Updated states for sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [severitySort, setSeveritySort] = useState("None");
  const [dateSort, setDateSort] = useState("None");

  const handleAddBug = (newBug: BugReport) => {
    setBugs((prev) => [...prev, newBug]);
  };

  const displayedBugs = useMemo(() => {
    // 1. Strict search filtering
    let result = bugs.filter((bug) => {
      if (!searchQuery) return true;
      return (
        bug.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    // 2. Sorting Logic
    return [...result].sort((a, b) => {
      // Primary Sort: Severity
      if (severitySort !== "None") {
        const severityWeight: Record<string, number> = {
          High: 3,
          Medium: 2,
          Low: 1,
        };
        const weightA = severityWeight[a.severity] || 0;
        const weightB = severityWeight[b.severity] || 0;

        if (weightA !== weightB) {
          return severitySort === "Decreasing"
            ? weightB - weightA // High to Low
            : weightA - weightB; // Low to High
        }
      }

      // Secondary Sort: Date (If severity is tied or set to "None")
      if (dateSort !== "None") {
        const compare = a.dateSubmitted.localeCompare(b.dateSubmitted);
        return dateSort === "Decreasing" ? -compare : compare;
      }

      return 0; // Leave in original order if no sorts are applied
    });
  }, [bugs, searchQuery, severitySort, dateSort]);

  return (
    <div className="w-full h-full p-8 text-foreground">
      <div className="mb-6">
        {/* Inherits text-foreground automatically */}
        <h1 className="text-2xl font-bold tracking-tight mb-1">Bugs tracker</h1>
        {/* Applied text-muted-foreground for secondary text */}
        <p className="text-sm text-muted-foreground">
          Describe how your team plans to use this list
        </p>
      </div>

      {/* Replaced hardcoded bg and border with bg-card and border-border */}
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
