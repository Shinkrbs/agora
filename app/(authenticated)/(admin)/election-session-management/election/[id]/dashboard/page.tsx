import { fetchElection } from "../_queries/fetch-election";
import { fetchRecentVotes } from "../_queries/fetch-recent-votes";
import { DraftDashboardUI, ActiveDashboardUI } from "../_components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ElectionDashboardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id: electionId } = await params;

  // Fetch election data
  const { data: election, error, message } = await fetchElection(electionId);

  if (error || !election) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-800">{message || "Unable to fetch election data."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render Draft State
  if (election.status === "draft") {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {election.title || "Election Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">Set up and prepare your election for launch</p>
        </div>
        <DraftDashboardUI election={election} />
      </div>
    );
  }

  // Render Active State
  if (election.status === "active" || election.status === "scheduled" || election.status === "completed") {
    // Fetch recent votes for the activity ticker
    const recentVotes = await fetchRecentVotes(electionId, 5);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {election.title || "Election Dashboard"}
          </h1>
          <p className="text-muted-foreground mt-1">Live monitoring and management</p>
        </div>
        <ActiveDashboardUI election={election} recentVotes={recentVotes} />
      </div>
    );
  }

  // Fallback for other statuses
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Status: <span className="font-medium capitalize">{election.status}</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}