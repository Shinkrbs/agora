"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ElectionSession } from "@/types/database";

interface OrganizationCardsProps {
  elections: ElectionSession[];
  electionStats: Record<
    string,
    {
      totalBallotsCast: number;
      reportingPercentage: number;
      lastUpdated: string;
    }
  >;
}

export function OrganizationCards({
  elections,
  electionStats,
}: OrganizationCardsProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {elections.map((election) => {
        const orgStats = electionStats[election.id];

        return (
          <Card
            key={election.id}
            // Navigate to the dynamic route when clicked
            onClick={() => router.push(`/live-election/${election.id}`)}
            className="cursor-pointer transition-all duration-200 border-border bg-card hover:bg-muted hover:border-primary/50"
          >
            <CardHeader className="p-5">
              <CardTitle className="text-lg text-foreground">
                {election.title}
              </CardTitle>
              <CardDescription className="flex justify-between items-center mt-2">
                <span>Click to view live results</span>
                {orgStats && (
                  <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                    {orgStats.reportingPercentage}% Reporting
                  </span>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
