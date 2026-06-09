"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrganizationCardsProps {
  elections: any[];
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {elections.map((election) => {
        const orgStats = electionStats[election.id];
        const org = election.organizations; // Assuming organizations joined data

        return (
          <Card
            key={election.id}
            onClick={() => router.push(`/live-election/${election.id}`)}
            className="group cursor-pointer overflow-hidden relative transition-all duration-300 border-border bg-card hover:shadow-xl hover:-translate-y-1 hover:border-primary/50"
          >
            {/* Subtle top gradient accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <CardHeader className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {org && (
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarImage src={org.logo_url || ""} alt={org.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {org.shorthand_name || org.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {org?.shorthand_name || org?.name || "Organization"}
                    </span>
                    <CardTitle className="text-xl font-bold text-foreground leading-tight mt-1 line-clamp-2">
                      {election.title}
                    </CardTitle>
                  </div>
                </div>
              </div>

              <CardDescription className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <span className="text-sm font-medium flex items-center gap-2 group-hover:text-primary transition-colors">
                  View Live Results
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-4 h-4 transition-transform group-hover:translate-x-1"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
                
                {orgStats && (
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-muted-foreground mb-1">Turnout</span>
                    <span className="text-sm font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-md border border-primary/20">
                      {orgStats.reportingPercentage}%
                    </span>
                  </div>
                )}
              </CardDescription>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
