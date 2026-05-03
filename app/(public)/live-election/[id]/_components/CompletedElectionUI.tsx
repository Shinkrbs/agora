"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { LandingPageHeader } from "@/app/(public)/landing/_components/LandingPageHeader";

interface CompletedElectionUIProps {
  title: string;
}

export function CompletedElectionUI({ title }: CompletedElectionUIProps) {
  return (
    <>
      <LandingPageHeader />
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center space-y-6 p-4">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold">{title}</h1>
          
          <p className="text-xl text-muted-foreground">
            Voting has concluded
          </p>

          <div className="pt-4">
            <Link href="/live-election">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Elections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
