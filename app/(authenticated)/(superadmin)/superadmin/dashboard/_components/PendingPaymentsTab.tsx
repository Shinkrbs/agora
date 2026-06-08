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
        <p className="text-lg font-medium text-foreground">
          No pending payments
        </p>
        <p className="text-sm text-muted-foreground">
          All payments have been verified.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-muted/50">
            <TableHead className="font-semibold text-foreground">
              Submitter
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Organization
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Payment Type
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Amount
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Date Applied
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow
              key={payment.id}
              className="border-border transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-medium text-foreground">
                {payment.submitter_email}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {payment.organization_name}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {payment.type === "organization"
                    ? "Organization"
                    : "Election"}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-foreground">
                ₱
                {payment.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell className="text-muted-foreground">
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
