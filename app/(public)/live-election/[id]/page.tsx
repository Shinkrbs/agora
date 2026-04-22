"use client";

import { useParams, useRouter } from "next/navigation";
import { LandingPageHeader } from "../../landing/_components/LandingPageHeader";
import { LiveElectionHeader } from "../_components/LiveElectionHeader";
import { CandidateRaceCard } from "../_components/CandidateRaceCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react"; // Make sure to import the icon

import {
  activeElections,
  electionStats,
  positions,
  allCandidates,
  partylists,
} from "../_data/mock-election-data";

export default function ElectionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Extract the election ID from the URL
  const electionId = params.id as string;

  const currentElection = activeElections.find((e) => e.id === electionId);

  // If the user types a random ID in the URL that doesn't exist
  if (!currentElection) {
    return (
      <>
        <LandingPageHeader />
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
          <div className="text-xl text-muted-foreground">
            Election not found.
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/live-election")}
          >
            Go Back
          </Button>
        </div>
      </>
    );
  }

  const stats = electionStats[currentElection.id];
  const electionPositions = positions.filter(
    (p) => p.election_id === currentElection.id,
  );

  const getStatusText = (candidates: typeof allCandidates) => {
    if (candidates.length < 2) return undefined;
    const diff = Math.abs(candidates[0].percentage - candidates[1].percentage);
    return diff < 5 ? "Too close to call" : undefined;
  };

  return (
    <>
      <LandingPageHeader />

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Navigation */}
          <Button
            variant="ghost"
            onClick={() => router.push("/live-election")}
            className="-ml-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Active Elections
          </Button>

          {/* Election Header */}
          <LiveElectionHeader
            title={currentElection.title}
            totalBallotsCast={stats?.totalBallotsCast || 0}
            reportingPercentage={stats?.reportingPercentage || 0}
            lastUpdated={stats?.lastUpdated || "N/A"}
          />

          {/* Race Cards */}
          <div className="space-y-6 pt-4 border-t border-border">
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
    </>
  );
}
