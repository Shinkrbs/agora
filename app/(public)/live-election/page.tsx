import { LandingPageHeader } from "../landing/_components/LandingPageHeader";
import { OrganizationCards } from "./_components/OrganizationCard";
import { fetchLiveElections } from "./_queries/fetch-elections";
import { getElectionStats } from "@/lib/queries/elections-queries";
import { ElectionSession } from "@/types/database";

export default async function LiveElectionIndexPage() {
  const { data: activeElections, error } = await fetchLiveElections();

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="p-8 text-center text-muted-foreground">
          Error fetching live elections.
        </div>
      </div>
    );
  }

  if (!activeElections || activeElections.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="p-8 text-center text-muted-foreground">
          No active elections at this time.
        </div>
      </div>
    );
  }

  // Fetch stats for all elections in parallel
  const statsPromises = activeElections.map((election: ElectionSession) =>
    getElectionStats(election.id),
  );
  const statsResults = await Promise.all(statsPromises);

  // Build a map of election stats
  const electionStats = activeElections.reduce(
    (
      acc: Record<
        string,
        {
          totalBallotsCast: number;
          reportingPercentage: number;
          lastUpdated: string;
        }
      >,
      election: ElectionSession,
      index: number,
    ) => {
      const stats = statsResults[index];
      if (stats) {
        acc[election.id] = {
          totalBallotsCast: stats.totalBallotsCast,
          reportingPercentage: stats.reportingPercentage,
          lastUpdated: stats.lastUpdated,
        };
      }
      return acc;
    },
    {},
  );

  return (
    <>
      <LandingPageHeader />

      <div className="min-h-screen bg-background text-foreground p-4 md:p-8 font-sans transition-colors duration-200">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-foreground">
              Live Elections
            </h1>
            <p className="text-muted-foreground">
              Select a student organization to view real-time election results.
            </p>
          </div>

          <OrganizationCards
            elections={activeElections}
            electionStats={electionStats}
          />
        </div>
      </div>
    </>
  );
}
