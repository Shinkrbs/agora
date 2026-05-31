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
        return "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200";
      case "rejected":
        return "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200";
      case "pending":
        return "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-700 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No recent activity
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          Activity log is empty.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Type
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Name
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Status
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow
              key={activity.id}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {activity.type === "organization"
                    ? "Organization"
                    : "Payment"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium text-gray-900 dark:text-white max-w-xs truncate">
                {activity.name}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </TableCell>
              <TableCell>
                {activity.amount ? (
                  <div className="flex items-center font-semibold text-gray-900 dark:text-white">
                    <span className="mr-1 text-green-600 dark:text-green-400">₱</span>
                    {activity.amount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">-</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-600 dark:text-gray-400">
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
  );
}
