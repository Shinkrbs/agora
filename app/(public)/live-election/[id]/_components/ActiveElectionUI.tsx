"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ElectionSession } from "@/types/database";
import { LandingPageHeader } from "@/app/(public)/landing/_components/LandingPageHeader";

interface ActiveElectionUIProps {
  election: ElectionSession;
}

export function ActiveElectionUI({ election }: ActiveElectionUIProps) {
  return (
    <>
      <LandingPageHeader />
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-6 p-4">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">{election.title}</h1>
          
          <div className="inline-block px-4 py-2 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
            Voting Active
          </div>

          <Link href={`/live-election/${election.id}/vote`} className="block">
            <Button size="lg" className="w-full px-8 py-6 text-lg font-semibold">
              Access Ballot
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
