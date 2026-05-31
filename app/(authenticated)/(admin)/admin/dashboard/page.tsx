"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import {
  LiveElectionCenter,
  StatsGrid,
  ConfigurationGrid,
  DashboardSkeleton,
} from "./_components";
import { getOrgDashboardStats, type DashboardStats } from "./_queries/get-org-dashboard-stats";

export default function DashboardPage() {
  const router = useRouter();
  const organization = useCurrentOrganization();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!organization?.id) {
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await getOrgDashboardStats(organization.id);
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setStats({
          activeElection: null,
          totalElectionsHosted: 0,
          totalElectorateReached: 0,
          totalVotesProcessed: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [organization?.id]);

  // Show loading state if organization hasn't loaded
  if (!organization) {
    return (
      <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
        <DashboardSkeleton />
      </div>
    );
  }

  // Show loading state while fetching stats
  if (isLoading) {
    return (
      <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Overview: {organization.name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant={
                organization.approval_status === "approved"
                  ? "default"
                  : organization.approval_status === "pending"
                    ? "secondary"
                    : "destructive"
              }
              className="capitalize"
            >
              {organization.approval_status}
            </Badge>
          </div>
        </div>
        <Button
          onClick={() => router.push("/election-session-management")}
          className="bg-primary hover:bg-primary-700 text-white flex items-center gap-2 w-fit"
          size="lg"
        >
          Manage Elections
        </Button>
      </div>

      {/* Live Election Center - Conditional */}
      {stats?.activeElection && (
        <LiveElectionCenter
          electionId={stats.activeElection.id}
          title={stats.activeElection.title}
          endDate={stats.activeElection.end_date}
          totalVoters={stats.activeElection.total_voters}
          votedCount={stats.activeElection.voted_count}
        />
      )}

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Stats
        </h2>
        <StatsGrid
          totalElectionsHosted={stats?.totalElectionsHosted || 0}
          totalElectorateReached={stats?.totalElectorateReached || 0}
          totalVotesProcessed={stats?.totalVotesProcessed || 0}
        />
      </div>

      {/* Configuration Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Organization Configuration
        </h2>
        <ConfigurationGrid />
      </div>
    </div>
  );
}
