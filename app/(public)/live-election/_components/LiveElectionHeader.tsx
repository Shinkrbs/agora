"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
  totalBallotsCast: number;
  reportingPercentage: number;
  lastUpdated: string;
  organization?: any; // Add organization prop
}

export function LiveElectionHeader({
  title,
  totalBallotsCast,
  reportingPercentage,
  lastUpdated,
  organization,
}: HeaderProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 p-6 rounded-2xl bg-card border border-border shadow-sm mb-8 relative overflow-hidden">
      {/* Decorative gradient background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="space-y-4 z-10">
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2 bg-destructive/10 text-destructive px-2.5 py-1 rounded-md font-bold text-xs tracking-wider border border-destructive/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
            </span>
            <span>LIVE RESULTS</span>
          </div>

          <span className="px-2 py-1 bg-secondary/50 rounded-md text-xs font-medium border border-border/50">
            Last updated: {lastUpdated}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {organization && (
            <Avatar className="h-14 w-14 border-2 border-background shadow-sm hidden sm:block">
              <AvatarImage src={organization.logo_url || ""} alt={organization.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {organization.shorthand_name || organization.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div>
            {organization && (
              <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-1">
                {organization.name}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {title}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 lg:gap-8 z-10 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
        <div className="text-right flex-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Ballots Cast
          </div>
          <div className="text-3xl font-black text-foreground">
            {totalBallotsCast.toLocaleString()}
          </div>
        </div>
        
        <div className="w-px h-12 bg-border"></div>

        <div className="text-right flex-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            Reporting
          </div>
          <div className="text-3xl font-black text-primary">
            {reportingPercentage}%
          </div>
        </div>

        <div className="pl-2">
          <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className={isPending ? "animate-spin" : ""}
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
        </div>
      </div>
    </div>
  );
}
