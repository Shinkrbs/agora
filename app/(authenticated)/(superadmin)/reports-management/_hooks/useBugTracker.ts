import { useState, useMemo } from "react";
import { BugReport } from "../_types/index";
import mockData from "../_data/mockbugs";

export const useBugTracker = () => {
  const [bugs, setBugs] = useState<BugReport[]>(mockData);
  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);

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
            ? weightB - weightA
            : weightA - weightB;
        }
      }

      if (dateSort !== "None") {
        const compare = a.dateSubmitted.localeCompare(b.dateSubmitted);
        return dateSort === "Decreasing" ? -compare : compare;
      }

      return 0;
    });
  }, [bugs, searchQuery, severitySort, dateSort]);

  // Return everything the UI needs to render and interact
  return {
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
  };
};
