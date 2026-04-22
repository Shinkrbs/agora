import React from "react";
import { LandingPageHeader } from "../landing/_components/LandingPageHeader";
import { LiveElectionHeader } from "./_components/LiveElectionHeader";
import { CandidateRaceCard } from "./_components/CandidateRaceCard";
import {
  currentElection,
  electionStats,
  presidentCandidates,
} from "./_data/mock-election-data";

function page() {
  const transformedPresidentCandidates = presidentCandidates.map((c) => ({
    id: c.id,
    firstName: c.first_name,
    lastName: c.last_name,
    partyName:
      c.partylist_id === "party-1" ? "Alyansang Tapat" : "Lakas Estudyante",
    voteCount: c.vote_count,
    percentage: c.percentage,
    colorHex: c.color_hex,
  }));
  return (
    <div>
      <LandingPageHeader />
      <LiveElectionHeader
        title={currentElection.title}
        totalBallotsCast={electionStats.totalBallotsCast}
        reportingPercentage={electionStats.reportingPercentage}
        lastUpdated={electionStats.lastUpdated}
      />
      <div className="lg:col-span-2 space-y-6">
        <CandidateRaceCard
          positionName="Student Body President"
          statusText="Too close to call"
          candidates={transformedPresidentCandidates}
        />
      </div>
    </div>
  );
}

export default page;
