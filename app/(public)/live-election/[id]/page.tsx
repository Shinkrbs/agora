"use server";

import LandingPageHeader from "../../landing/_components/LandingPageHeader";
import { UpcomingElectionUI } from "./_components/UpcomingElectionUI";
import { CompletedElectionUI } from "./_components/CompletedElectionUI";
import { LiveElectionHeader } from "../_components/LiveElectionHeader";
import { CandidateRaceCard } from "../_components/CandidateRaceCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import {
  getElectionSessionById,
  getPositionsByElectionSessionId,
  getPartylistsByElectionSessionId,
  getCandidatesWithVotesForPosition,
  getElectionStats,
} from "@/lib/queries/elections-queries";
import Link from "next/link";

interface ElectionDetailsPageProps {
  params: Promise<{ id: string }>;
}

// Helper function to determine election state
function getElectionState(election: {
  status: string;
  start_date: string | null;
  end_date: string | null;
}): "upcoming" | "active" | "completed" {
  const now = new Date();
  const startDate = election.start_date ? new Date(election.start_date) : null;
  const endDate = election.end_date ? new Date(election.end_date) : null;

  // Check explicit status first
  if (election.status === "completed") {
    return "completed";
  }

  if (election.status === "active") {
    return "active";
  }

  // Fall back to date comparison
  if (endDate && now > endDate) {
    return "completed";
  }

  if (startDate && endDate && now >= startDate && now < endDate) {
    return "active";
  }

  // Default to upcoming
  return "upcoming";
}

export default async function ElectionDetailsPage({
  params,
}: ElectionDetailsPageProps) {
  const { id: electionId } = await params;

  // Fetch election session data
  const currentElection = await getElectionSessionById(electionId);

  // If the election doesn't exist
  if (!currentElection) {
    return (
      <>
        <LandingPageHeader />
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-4">
          <div className="text-xl text-muted-foreground">
            Election not found.
          </div>
          <Link href="/live-election">
            <Button variant="outline">Go Back</Button>
          </Link>
        </div>
      </>
    );
  }

  // Determine election state and render accordingly
  const electionState = getElectionState(currentElection);

  if (electionState === "upcoming") {
    return <UpcomingElectionUI election={currentElection} />;
  }

  if (electionState === "completed") {
    return <CompletedElectionUI title={currentElection.title} />;
  }

  // For active elections, render the detailed view with candidates
  const [positions, partylists, stats] = await Promise.all([
    getPositionsByElectionSessionId(electionId),
    getPartylistsByElectionSessionId(electionId),
    getElectionStats(electionId),
  ]);

  // Build a map of partylists for quick lookup
  const partylistsMap =
    partylists?.reduce(
      (acc, party) => {
        acc[party.id] = party;
        return acc;
      },
      {} as Record<string, (typeof partylists)[number]>,
    ) || {};

  return (
    <>
      <LandingPageHeader />

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-200">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Navigation */}
          <Link href="/live-election">
            <Button
              variant="ghost"
              className="-ml-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Active Elections
            </Button>
          </Link>

          {/* Election Header */}
          <LiveElectionHeader
            title={currentElection.title}
            totalBallotsCast={stats?.totalBallotsCast || 0}
            reportingPercentage={stats?.reportingPercentage || 0}
            lastUpdated={stats?.lastUpdated || "N/A"}
            organization={currentElection.organizations}
          />

          {/* Access Ballot CTA */}
          <div className="flex justify-center py-8">
            <Link href={`/live-election/${electionId}/vote`}>
              <Button size="lg" className="px-8 py-6 text-lg font-semibold">
                Access Ballot
              </Button>
            </Link>
          </div>

          {/* Race Cards */}
          <div className="space-y-6 pt-4 border-t border-border">
            {positions && positions.length > 0 ? (
              await Promise.all(
                positions.map(async (position) => {
                  const candidatesWithVotes =
                    await getCandidatesWithVotesForPosition(position.id);

                  if (
                    !candidatesWithVotes ||
                    candidatesWithVotes.length === 0
                  ) {
                    return null;
                  }

                  // Sort by vote count (descending)
                  const sortedCandidates = candidatesWithVotes.sort(
                    (a, b) => b.vote_count - a.vote_count,
                  );

                  // Check if race is too close to call
                  const getStatusText = () => {
                    if (sortedCandidates.length < 2) return undefined;
                    const diff = Math.abs(
                      sortedCandidates[0].percentage -
                        sortedCandidates[1].percentage,
                    );
                    return diff < 5 ? "Too close to call" : undefined;
                  };

                  // Transform candidates for the component
                  const transformedCandidates = sortedCandidates.map((c) => ({
                    id: c.id,
                    firstName: c.first_name,
                    lastName: c.last_name,
                    partyName: c.partylist_id
                      ? partylistsMap[c.partylist_id]?.name || "Independent"
                      : "Independent",
                    voteCount: c.vote_count,
                    percentage: c.percentage,
                    colorHex: c.color_hex,
                  }));

                  return (
                    <CandidateRaceCard
                      key={position.id}
                      positionName={position.name}
                      statusText={getStatusText()}
                      candidates={transformedCandidates}
                    />
                  );
                }),
              )
            ) : (
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
