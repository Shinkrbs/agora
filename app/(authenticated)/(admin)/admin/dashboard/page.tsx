"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Home } from "lucide-react";
import {
  LiveElectionCenter,
  StatsGrid,
  ConfigurationGrid,
  DashboardSkeleton,
} from "./_components";
import {
  getOrgDashboardStats,
  type DashboardStats,
} from "./_queries/get-org-dashboard-stats";

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

  // Fallback UI when the user is not part of any organization
  if (!organization) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-md w-full">
          <div className="w-16 h-16 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Organization Found
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            You are currently not a part of any organization. To access the dashboard, you need to create a new organization or wait for an invitation.
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => router.push("/organization-management")} 
              className="w-full flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> 
              Create Organization
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while fetching stats
  if (isLoading) {
    return (
      <div className="min-h-svh space-y-8 bg-background p-8 text-foreground">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-svh space-y-8 bg-background p-8 text-foreground">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="mb-2 text-3xl font-bold text-foreground">
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">
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
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Organization Configuration
        </h2>
        <ConfigurationGrid />
      </div>
    </div>
  );
}