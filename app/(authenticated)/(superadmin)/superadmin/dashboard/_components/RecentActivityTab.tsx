"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HistoricalEntry } from "../_queries/get-superadmin-data";
import { CheckCircle } from "lucide-react";

interface RecentActivityTabProps {
  activities: HistoricalEntry[];
}

export function RecentActivityTab({ activities }: RecentActivityTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-12">
        <CheckCircle className="mb-4 h-10 w-10 text-muted-foreground/50 md:h-12 md:w-12" />
        <p className="text-base font-medium text-foreground md:text-lg">
          No recent activity
        </p>
        <p className="text-xs text-muted-foreground md:text-sm">
          Activity log is empty.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {activities.map((activity) => (
          <article
            key={activity.id}
            className="rounded-lg border border-border bg-background p-4"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {activity.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {activity.type === "organization"
                    ? "Organization"
                    : "Payment"}
                </p>
              </div>
              <Badge className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-foreground">
                    {activity.amount ? (
                      <span className="text-green-600 dark:text-green-400">
                        ₱
                        {activity.amount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    ) : (
                      "-"
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-xs text-foreground">
                    {new Date(activity.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-border bg-muted/50">
              <TableHead className="font-semibold text-foreground">
                Type
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Status
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow
                key={activity.id}
                className="border-border transition-colors hover:bg-muted/50"
              >
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {activity.type === "organization"
                      ? "Organization"
                      : "Payment"}
                  </Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate font-medium text-foreground">
                  {activity.name}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {activity.amount ? (
                    <div className="flex items-center font-semibold text-foreground">
                      <span className="mr-1 text-green-600 dark:text-green-400">
                        ₱
                      </span>
                      {activity.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(activity.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
