"use client";

import { useState } from "react";
import { LandingPageHeader } from "@/app/(public)/landing/_components/LandingPageHeader";
import { LiveElectionHeader } from "./_components/LiveElectionHeader";
import { CandidateRaceCard } from "./_components/CandidateRaceCard";

// IMPORT SHADCN SELECT COMPONENTS
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  activeElections,
  electionStats,
  positions,
  allCandidates,
  partylists,
} from "./_data/mock-election-data";

export default function LiveElectionPage() {
  // Track the currently selected election ID. Defaults to the first active election.
  const [selectedElectionId, setSelectedElectionId] = useState<string>(
    activeElections.length > 0 ? activeElections[0].id : "",
  );

  const getStatusText = (candidates: typeof allCandidates) => {
    if (candidates.length < 2) return undefined;
    const diff = Math.abs(candidates[0].percentage - candidates[1].percentage);
    return diff < 5 ? "Too close to call" : undefined;
  };

  // Prevent crash if no active elections
  if (!activeElections || activeElections.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="p-8 text-center text-muted-foreground">
          No active elections at this time.
        </div>
      </div>
    );
  }

  // Find the full election object based on the currently selected ID
  const currentElection =
    activeElections.find((e) => e.id === selectedElectionId) ||
    activeElections[0];
  const stats = electionStats[currentElection.id];
  const electionPositions = positions.filter(
    (p) => p.election_id === currentElection.id,
  );

  return (
    <>
      <LandingPageHeader />

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* ORG SELECTOR DROPDOWN */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
            <Select
              value={selectedElectionId}
              onValueChange={setSelectedElectionId}
            >
              <SelectTrigger className="w-full sm:w-[350px] bg-card text-card-foreground border-border">
                <SelectValue placeholder="Select a student organization..." />
              </SelectTrigger>
              <SelectContent className="bg-popover text-popover-foreground border-border">
                {activeElections.map((election) => (
                  <SelectItem key={election.id} value={election.id}>
                    {election.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DYNAMIC CONTENT (Updates when dropdown changes) */}
          <div className="space-y-8 animate-in fade-in-50 duration-500">
            <LiveElectionHeader
              title={currentElection.title}
              totalBallotsCast={stats?.totalBallotsCast || 0}
              reportingPercentage={stats?.reportingPercentage || 0}
              lastUpdated={stats?.lastUpdated || "N/A"}
            />

            <div className="space-y-6 pt-4">
              {electionPositions.map((position) => {
                const candidatesForPos = allCandidates.filter(
                  (c) => c.position_id === position.id,
                );
                const sortedCandidates = candidatesForPos.sort(
                  (a, b) => b.vote_count - a.vote_count,
                );

                const transformedCandidates = sortedCandidates.map((c) => ({
                  id: c.id,
                  firstName: c.first_name,
                  lastName: c.last_name,
                  partyName: c.partylist_id
                    ? partylists[c.partylist_id].name
                    : "Independent",
                  voteCount: c.vote_count,
                  percentage: c.percentage,
                  colorHex: c.color_hex,
                }));

                return (
                  <CandidateRaceCard
                    key={position.id}
                    positionName={position.name}
                    statusText={getStatusText(sortedCandidates)}
                    candidates={transformedCandidates}
                  />
                );
              })}

              {electionPositions.length === 0 && (
                <div className="text-center text-muted-foreground p-8 border border-dashed border-border rounded-lg">
                  No positions configured for this election yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
