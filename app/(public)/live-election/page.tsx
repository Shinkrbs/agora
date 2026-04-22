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
  const getStatusText = (candidates: typeof allCandidates) => {
    if (candidates.length < 2) return undefined;
    const diff = Math.abs(candidates[0].percentage - candidates[1].percentage);
    return diff < 5 ? "Too close to call" : undefined;
  };

  return (
    <>
      <LandingPageHeader />

      {/* FIX: Removed bg-[#f8fafc] -> Replaced with bg-background */}
      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <LiveElectionHeader
            title={currentElection.title}
            totalBallotsCast={electionStats.totalBallotsCast}
            reportingPercentage={electionStats.reportingPercentage}
            lastUpdated={electionStats.lastUpdated}
          />

          <div className="space-y-6 pt-4">
            {positions.map((position) => {
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
          </div>
        </div>
      </div>
    </>
  );
}
