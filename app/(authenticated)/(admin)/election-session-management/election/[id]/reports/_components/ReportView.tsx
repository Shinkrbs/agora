"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { ReportData } from "../_queries/get-report-data";

interface ReportViewProps {
  data: ReportData;
  electionId: string;
}

export function ReportView({ data, electionId }: ReportViewProps) {
  const handleViewReport = () => {
    // Open report document in a new tab
    window.open(`/elections/${electionId}/report-document`, "_blank");
  };

  return (
    <div className="space-y-6 p-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {data.election.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Official Election Report - Status: Completed
            </p>
          </div>
          <Button
            onClick={handleViewReport}
            className="gap-2"
            size="lg"
          >
            <Download className="w-4 h-4" />
            View & Download Report
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Election Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Voters</p>
            <p className="text-2xl font-bold text-foreground">{data.total_voters}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Votes Cast</p>
            <p className="text-2xl font-bold text-foreground">{data.voted_count}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-muted-foreground">Turnout</p>
            <p className="text-3xl font-bold text-foreground">
              {data.turnout_percentage}%
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Positions ({data.positions.length})
        </h3>
        <ul className="space-y-2">
          {data.positions.map((position) => (
            <li key={position.position_id} className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{position.position_name}</span>
              {" "} — {position.candidates.filter(c => c.isWinner).length} of {position.seat_count} seats filled
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
