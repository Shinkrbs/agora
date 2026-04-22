"use client";

import { LandingPageHeader } from "../landing/_components/LandingPageHeader";
import { LiveElectionHeader } from "./_components/LiveElectionHeader";
import { CandidateRaceCard } from "./_components/CandidateRaceCard";

import {
  currentElection,
  electionStats,
  positions,
  allCandidates,
  partylists,
} from "./_data/mock-election-data";

export default function LiveElectionPage() {
  // Helper function to figure out if a race is close based on margin
  const getStatusText = (candidates: typeof allCandidates) => {
    if (candidates.length < 2) return undefined;
    const diff = Math.abs(candidates[0].percentage - candidates[1].percentage);
    return diff < 5 ? "Too close to call" : undefined;
  };

  return (
    <>
      <LandingPageHeader />

      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans">
        {/* Changed to max-w-4xl since we no longer have sidebars */}
        <div className="max-w-4xl mx-auto space-y-8">
          <LiveElectionHeader
            title={currentElection.title}
            totalBallotsCast={electionStats.totalBallotsCast}
            reportingPercentage={electionStats.reportingPercentage}
            lastUpdated={electionStats.lastUpdated}
          />

          <div className="space-y-6 pt-4">
            {positions.map((position) => {
              // 1. Filter candidates for this specific position
              const candidatesForPos = allCandidates.filter(
                (c) => c.position_id === position.id,
              );

              // 2. Sort them by highest vote count first
              const sortedCandidates = candidatesForPos.sort(
                (a, b) => b.vote_count - a.vote_count,
              );

              // 3. Transform data for the UI component
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

              // 4. Render the Card
              return (
                <CandidateRaceCard
                  key={position.id}
                  positionName={position.name}
                  statusText={getStatusText(sortedCandidates)}
                  candidates={transformedCandidates}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
