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
import { PendingPayment } from "../_queries/get-superadmin-data";
import { DollarSign } from "lucide-react";

interface PendingPaymentsTabProps {
  payments: PendingPayment[];
}

export function PendingPaymentsTab({ payments }: PendingPaymentsTabProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <DollarSign className="h-12 w-12 text-green-500 mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
          No pending payments
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm">
          All payments have been verified.
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
              Submitter
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Organization
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Payment Type
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-gray-900 dark:text-white">
              Date Applied
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow
              key={payment.id}
              className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <TableCell className="font-medium text-gray-900 dark:text-white">
                {payment.submitter_email}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {payment.organization_name}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {payment.type === "organization"
                    ? "Organization"
                    : "Election"}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-gray-900 dark:text-white">
                ₱{payment.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-gray-600 dark:text-gray-400">
                {new Date(payment.created_at).toLocaleDateString("en-US", {
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
