import React from "react";
import { LandingPageHeader } from "../landing/_components/LandingPageHeader";
import { LiveElectionHeader } from "./_components/LiveElectionHeader";
import {
  currentElection,
  electionStats,
  presidentCandidates,
} from "./_data/mock-election-data";
function page() {
  return (
    <div>
      <LandingPageHeader />
      <LiveElectionHeader
        title={currentElection.title}
        totalBallotsCast={electionStats.totalBallotsCast}
        reportingPercentage={electionStats.reportingPercentage}
        lastUpdated={electionStats.lastUpdated}
      />
      This is the Live Election Page
    </div>
  );
}

export default page;
