"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Trophy, Users, CheckCircle2 } from "lucide-react";

interface StatsGridProps {
  totalElectionsHosted: number;
  totalElectorateReached: number;
  totalVotesProcessed: number;
}

export function StatsGrid({
  totalElectionsHosted,
  totalElectorateReached,
  totalVotesProcessed,
}: StatsGridProps) {
  const stats = [
    {
      label: "Elections Hosted",
      value: totalElectionsHosted,
      icon: Trophy,
      color: "bg-blue-100 dark:bg-blue-950",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Electorate Reached",
      value: totalElectorateReached,
      icon: Users,
      color: "bg-purple-100 dark:bg-purple-950",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Votes Processed",
      value: totalVotesProcessed,
      icon: CheckCircle2,
      color: "bg-green-100 dark:bg-green-950",
      iconColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {stat.value.toLocaleString()}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
