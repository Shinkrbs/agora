"use client";

import { useState, useMemo } from "react";
import { ElectionCardSummary } from "../_types/election-card-type";
import { ElectionStatus } from "@/types/database";
import { ElectionCard } from "./ElectionCard";
import { ElectionStatusTabs } from "./ElectionStatusTabs";
import { SearchAndFilter } from "./SearchAndFilter";

interface ElectionSessionsListProps {
  initialElections: ElectionCardSummary[];
}

export function ElectionSessionsList({ initialElections }: ElectionSessionsListProps) {
  const [activeStatus, setActiveStatus] = useState<ElectionStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredElections = useMemo(() => {
    let filtered = initialElections;

    if (activeStatus !== "all") {
      filtered = filtered.filter((election) => election.status === activeStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((election) =>
        election.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeStatus, searchQuery, initialElections]);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Election Session Management</h1>
        <p className="text-muted-foreground text-sm">
          Create, manage, and monitor election sessions for your organization.
        </p>
      </div>

      <SearchAndFilter onSearch={setSearchQuery} />

      <ElectionStatusTabs activeStatus={activeStatus} onStatusChange={setActiveStatus} />

      <div>
        {filteredElections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-sm">
              No elections found. Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap md:gap-3">
            {filteredElections.map((election) => (
              <ElectionCard key={election.id} election={election} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
