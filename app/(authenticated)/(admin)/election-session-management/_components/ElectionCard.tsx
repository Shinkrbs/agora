"use client";

import { ElectionCardSummary } from "../_types/election-card-type";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElectionStatus, PaymentStatus } from "@/types/database";
import NextLink from "next/link";

interface ElectionCardProps {
  election: ElectionCardSummary;
}

export function ElectionCard({ election }: ElectionCardProps) {
  const getStatusColor = (status: ElectionStatus) => {
    const colors: Record<ElectionStatus, string> = {
      draft:
        "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
      scheduled:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      active:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      completed:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
      archived:
        "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
    };
    return colors[status];
  };

  const normalizePaymentStatus = (status: PaymentStatus | null | string) => {
    if (!status) return "unpaid" as const;
    const normalized = status
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_");

    if (normalized === "pending") return "pending" as const;
    if (normalized === "verified") return "verified" as const;
    if (normalized === "rejected") return "rejected" as const;
    return "unpaid" as const;
  };

  const getPaymentStatusColor = (status: PaymentStatus | null | string) => {
    const normalized = normalizePaymentStatus(status);
    const colors: Record<PaymentStatus, string> = {
      unpaid: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      pending:
        "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
      verified:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    };
    if (normalized === "unpaid") {
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
    }
    return colors[normalized];
  };

  const getPaymentStatusDisplay = (status: PaymentStatus | null | string) => {
    const normalized = normalizePaymentStatus(status);
    if (normalized === "unpaid") return "Unpaid";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <NextLink
      href={`/election-session-management/election/${election.id}/dashboard`}
      className="block w-full"
    >
      <Card className="w-full min-w-0 p-4 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm leading-tight text-foreground flex-1">
              {election.title}
            </h3>
            <Badge
              className={`text-xs whitespace-nowrap ${getStatusColor(election.status)}`}
            >
              {election.status.charAt(0).toUpperCase() +
                election.status.slice(1)}
            </Badge>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex justify-between">
              <span className="font-medium">Start:</span>
              <span>{formatDate(election.start_date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">End:</span>
              <span>{formatDate(election.end_date)}</span>
            </div>
          </div>

          {election.turnout_percentage !== undefined && (
            <div className="bg-secondary rounded p-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Turnout:</span>
                <span className="font-medium">
                  {election.turnout_percentage !== null
                    ? `${election.turnout_percentage}%`
                    : "—"}
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-2">
            <div className="text-xs text-muted-foreground mb-1">
              Payment Status
            </div>
            <Badge
              className={`text-xs w-full justify-center py-1 ${getPaymentStatusColor(
                election.payment_status,
              )}`}
            >
              {getPaymentStatusDisplay(election.payment_status)}
            </Badge>
          </div>
        </div>
      </Card>
    </NextLink>
  );
}
