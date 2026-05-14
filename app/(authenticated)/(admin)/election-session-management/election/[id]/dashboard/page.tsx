import React from "react";
import { fetchElection } from "../_queries/fetch-election";
import { fetchRecentVotes } from "../_queries/fetch-recent-votes";
import { DraftDashboardUI, ActiveDashboardUI, LoadingSpinner } from "../_components";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  if (election.status === "active" || election.status === "scheduled") {
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

  // Render Completed State
  if (election.status === "completed") {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Election Completed</CardTitle>
            <CardDescription>This election has concluded.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {election.title || "Your election"} has been completed. View detailed results and reports to analyze the outcomes.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <a href={`/election/${electionId}/reports`}>View Reports</a>
              </Button>
              <Button asChild variant="outline">
                <a href="/admin">Back to Elections</a>
              </Button>
            </div>
          </CardContent>
        </Card>
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