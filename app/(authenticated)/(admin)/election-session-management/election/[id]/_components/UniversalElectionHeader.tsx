"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import {
  ArrowLeft,
  Calendar,
  Settings,
  Play,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ElectionStatus, PaymentStatus } from "@/types/database";
import { formatDate } from "@/lib/utils";
import { EditDetailsModal } from "./EditDetailsModal";
import { LaunchPaymentModal } from "./LaunchPaymentModal";
import { useCurrentOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";

export interface UniversalElectionHeaderProps {
  electionId: string;
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ElectionStatus;
  paymentStatus: PaymentStatus;
  isSetupComplete: boolean;
}

const statusColorMap: Record<ElectionStatus, string> = {
  draft: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100",
  scheduled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  completed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  cancelled:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  archived:
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  unpaid: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

export function UniversalElectionHeader({
  electionId,
  title,
  startDate,
  endDate,
  status,
  paymentStatus,
  isSetupComplete,
}: UniversalElectionHeaderProps) {
  const [editDetailsOpen, setEditDetailsOpen] = useState(false);
  const [launchPaymentOpen, setLaunchPaymentOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const organization = useCurrentOrganization();
  const election: UniversalElectionHeaderProps = {
    electionId,
    title,
    startDate,
    endDate,
    status,
    paymentStatus,
    isSetupComplete,
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300)); // Brief animation
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-4 pb-2">
      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        {/* Back Button */}
        <NextLink
          href="/election-session-management"
          className="inline-flex w-fit"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Election Sessions
          </Button>
        </NextLink>

        {/* Refresh Button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
          onClick={handleRefresh}
          disabled={isRefreshing}
          title="Refresh page"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Header Content */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left Section: Title & Dates */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <div
              className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColorMap[status]}`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <p>
                {startDate && endDate ? (
                  <>
                    <span className="font-medium text-foreground">
                      {formatDate(startDate)}
                    </span>
                    {" — "}
                    <span className="font-medium text-foreground">
                      {formatDate(endDate)}
                    </span>
                  </>
                ) : (
                  <span className="italic">Dates not set</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Actions & Status Badges */}
        <div className="flex flex-col gap-3 sm:items-end">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Edit Details Button */}
            <Button
              size="icon"
              variant="outline"
              onClick={() => setEditDetailsOpen(true)}
              title="Edit election details"
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Primary Action Button */}
            {status === "draft" && (
              <Button
                onClick={() => setLaunchPaymentOpen(true)}
                disabled={!isSetupComplete}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Launch Election
              </Button>
            )}

            {status === "completed" && (
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download Final Report
              </Button>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2">
            {/* Payment Status Badge */}
            <Badge
              variant="secondary"
              className={paymentStatusColorMap[paymentStatus]}
            >
              Payment:{" "}
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </Badge>

            {/* Setup Status Badge */}
            <Badge
              variant="secondary"
              className={
                isSetupComplete
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
              }
            >
              {isSetupComplete ? "Setup Complete" : "Setup Incomplete"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditDetailsModal
        election={election}
        isOpen={editDetailsOpen}
        onOpenChange={setEditDetailsOpen}
      />
      <LaunchPaymentModal
        electionId={electionId}
        organizationId={organization?.id ?? ""}
        isOpen={launchPaymentOpen}
        onOpenChange={setLaunchPaymentOpen}
      />
    </div>
  );
}
