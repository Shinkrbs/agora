"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
  totalBallotsCast: number;
  reportingPercentage: number;
  lastUpdated: string;
}

export function LiveElectionHeader({
  title,
  totalBallotsCast,
  reportingPercentage,
  lastUpdated,
}: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 bg-red-100 text-red-700 px-2 py-1 rounded-md font-semibold text-xs tracking-wider">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
            </span>
            LIVE RESULTS
          </div>
          <span>Last updated: {lastUpdated}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-sm text-muted-foreground">
            Total Ballots Cast
          </div>
          <div className="text-2xl font-bold">
            {totalBallotsCast.toLocaleString()}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Reporting</div>
          <div className="text-2xl font-bold">{reportingPercentage}%</div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          className={
            isRefreshing
              ? "animate-spin text-muted-foreground"
              : "text-muted-foreground"
          }
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
