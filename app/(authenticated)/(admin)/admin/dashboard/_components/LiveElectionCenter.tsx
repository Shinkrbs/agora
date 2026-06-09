"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import { Zap } from "lucide-react";

interface LiveElectionCenterProps {
  electionId: string;
  title: string;
  endDate: string | null;
  totalVoters: number;
  votedCount: number;
}

export function LiveElectionCenter({
  electionId,
  title,
  endDate,
  totalVoters,
  votedCount,
}: LiveElectionCenterProps) {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [turnoutPercentage, setTurnoutPercentage] = useState<number>(0);

  useEffect(() => {
    // Calculate turnout percentage
    if (totalVoters > 0) {
      setTurnoutPercentage((votedCount / totalVoters) * 100);
    }

    // Calculate time remaining
    if (!endDate) return;

    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Election Ended");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeRemaining(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endDate, totalVoters, votedCount]);

  return (
    <Card className="relative overflow-hidden bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-400 dark:border-green-600 shadow-lg mb-8">
      {/* Subtle animated background accent */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-green-200 dark:bg-green-700 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />

      <div className="relative p-8">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            {/* Live Indicator and Title */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-full animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full" />
                <span className="text-sm font-semibold">LIVE</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 truncate">
                {title}
              </h2>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {/* Time Remaining */}
              <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Time Remaining
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {timeRemaining}
                </p>
              </div>

              {/* Voted Count */}
              <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Votes Cast
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {votedCount.toLocaleString()}
                </p>
              </div>

              {/* Total Registered */}
              <div className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">
                  Total Registered
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {totalVoters.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Turnout Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Voter Turnout
                </p>
                <span className="text-sm font-bold text-green-600 dark:text-green-400">
                  {turnoutPercentage.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={turnoutPercentage}
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => router.push(`/dashboard/elections/${electionId}`)}
            className="shrink-0 h-fit bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white flex items-center gap-2"
            size="lg"
          >
            <Zap className="w-4 h-4" />
            Live Monitor
          </Button>
        </div>
      </div>
    </Card>
  );
}
