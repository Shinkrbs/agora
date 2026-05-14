"use client";

import React, { useState, useEffect } from "react";
import { ElectionHeaderData } from "../_types/election-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, TrendingUp, Send } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ActiveDashboardUIProps {
  election: ElectionHeaderData;
  recentVotes?: Array<{
    id: string;
    created_at: string;
  }>;
}

export const ActiveDashboardUI: React.FC<ActiveDashboardUIProps> = ({
  election,
  recentVotes = [],
}) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (election.status === "scheduled" && election.startDate) {
        const startTime = new Date(election.startDate);
        const diff = startTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining("Starting Soon");
          setIsUrgent(false);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
        } else {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        }
        setIsUrgent(false);
      }
      else if (election.status === "active" && election.endDate) {
        const endTime = new Date(election.endDate);
        const diff = endTime.getTime() - now.getTime();

        if (diff <= 0) {
          setTimeRemaining("Election Ended");
          setIsUrgent(false);
          clearInterval(interval);
          return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
        setIsUrgent(hours < 1);
      } else {
        setTimeRemaining("N/A");
        setIsUrgent(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [election.startDate, election.endDate, election.status]);

  const turnoutPercentage =
    election.totalVoters > 0
      ? Math.round((election.votedCount / election.totalVoters) * 100)
      : 0;

  const funnelData = [
    {
      name: "Total Electorate",
      value: election.totalVoters,
    },
    {
      name: "Codes Sent",
      value: election.sentCount,
    },
    {
      name: "Ballots Cast",
      value: election.votedCount,
    },
  ];

  const recentActivity = recentVotes.slice(0, 5).map((vote, idx) => {
    const voteTime = new Date(vote.created_at);
    const minutesAgo = Math.floor(
      (currentTime.getTime() - voteTime.getTime()) / (1000 * 60)
    );
    return {
      id: vote.id,
      message: "Anonymous ballot cast successfully",
      time: `${minutesAgo === 0 ? "Just now" : `${minutesAgo} min ago`}`,
    };
  });



  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {election.status === "scheduled" ? "Opening Countdown" : "Closing Countdown"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p
              className={`text-3xl font-bold font-mono ${
                isUrgent ? "text-red-600" : "text-foreground"
              }`}
            >
              {timeRemaining}
            </p>
            {isUrgent && election.status === "active" && (
              <Badge variant="destructive" className="w-fit">
                Under 1 Hour Remaining
              </Badge>
            )}
            <p className="text-sm text-muted-foreground">
              {election.status === "scheduled" && election.startDate &&
                `Starts at ${new Date(election.startDate).toLocaleTimeString()}`}
              {election.status === "active" && election.endDate &&
                `Ends at ${new Date(election.endDate).toLocaleTimeString()}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Voter Turnout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {election.votedCount} of {election.totalVoters} voted
                </span>
                <span className="text-2xl font-bold">{turnoutPercentage}%</span>
              </div>
              <Progress value={turnoutPercentage} className="h-3" />
            </div>
            <p className="text-xs text-muted-foreground">
              {election.sentCount} codes sent
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Voter Funnel</CardTitle>
          <CardDescription>
            Track voter progression from electorate to ballots cast
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]}>
                {funnelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      index === 0
                        ? "#60a5fa"
                        : index === 1
                        ? "#3b82f6"
                        : "#1d4ed8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Live Activity
          </CardTitle>
          <CardDescription>Recent ballot submissions (anonymized)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                    <p className="text-sm">{activity.message}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No votes cast yet. Waiting for first submission...
              </p>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  );
};
