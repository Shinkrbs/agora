"use client";

import { LandingPageHeader } from "../landing/_components/LandingPageHeader";
import { OrganizationCards } from "./_components/OrganizationCard";
import { activeElections, electionStats } from "./_data/mock-election-data";

export default function LiveElectionIndexPage() {
  if (!activeElections || activeElections.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="p-8 text-center text-muted-foreground">
          No active elections at this time.
        </div>
      </div>
    );
  }

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
