"use client";

import { ElectionSession } from "@/types/database";
import { LandingPageHeader } from "../../landing/_components/LandingPageHeader";

interface UpcomingElectionUIProps {
  election: ElectionSession;
}

export function UpcomingElectionUI({ election }: UpcomingElectionUIProps) {
  return (
    <>
      <LandingPageHeader />
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-6 p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-4xl font-bold">{election.title}</h1>
          <p className="text-lg text-muted-foreground">
            Voting has not started yet
          </p>
          
          {/* Placeholder for countdown timer */}
          <div className="mt-8 p-6 bg-secondary rounded-lg border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Voting begins:
            </p>
            <div className="text-2xl font-semibold text-foreground">
              {election.start_date
                ? new Date(election.start_date).toLocaleString()
                : "TBA"}
            </div>
            {/* Countdown timer component would go here */}
          </div>
        </div>
      </div>
    </>
  );
}
