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
  const mobileAccents = [
    {
      shell:
        "border-emerald-200/70 bg-emerald-50/80 dark:border-emerald-900/40 dark:bg-emerald-950/30",
      stripe: "bg-emerald-500",
      badge:
        "border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200",
      amount: "text-emerald-700 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    {
      shell:
        "border-sky-200/70 bg-sky-50/80 dark:border-sky-900/40 dark:bg-sky-950/30",
      stripe: "bg-sky-500",
      badge:
        "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-200",
      amount: "text-sky-700 dark:text-sky-400",
      dot: "bg-sky-500",
    },
    {
      shell:
        "border-violet-200/70 bg-violet-50/80 dark:border-violet-900/40 dark:bg-violet-950/30",
      stripe: "bg-violet-500",
      badge:
        "border-violet-200 bg-violet-100 text-violet-800 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-200",
      amount: "text-violet-700 dark:text-violet-400",
      dot: "bg-violet-500",
    },
    {
      shell:
        "border-amber-200/70 bg-amber-50/80 dark:border-amber-900/40 dark:bg-amber-950/30",
      stripe: "bg-amber-500",
      badge:
        "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
      amount: "text-amber-700 dark:text-amber-400",
      dot: "bg-amber-500",
    },
  ];

  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 md:py-12">
        <DollarSign className="mb-4 h-10 w-10 text-green-500 md:h-12 md:w-12" />
        <p className="text-base font-medium text-foreground md:text-lg">
          No pending payments
        </p>
        <p className="text-xs text-muted-foreground md:text-sm">
          All payments have been verified.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="-mx-4 max-h-[60vh] overflow-y-auto px-4 pb-2 md:hidden">
        <div className="flex flex-col gap-3 snap-y snap-mandatory">
          {payments.map((payment) => (
            <article
              key={payment.id}
              className={`mx-auto w-full max-w-sm snap-start overflow-hidden rounded-2xl border p-4 shadow-sm ${mobileAccents[payment.type === "organization" ? 0 : 1].shell}`}
            >
              <div
                className={`-mx-4 -mt-4 mb-4 h-1 ${mobileAccents[payment.type === "organization" ? 0 : 1].stripe}`}
              />

              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${mobileAccents[payment.type === "organization" ? 0 : 1].dot}`}
                    />
                    <p className="truncate text-sm font-semibold text-foreground">
                      {payment.organization_name}
                    </p>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {payment.submitter_email}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`shrink-0 text-xs ${mobileAccents[payment.type === "organization" ? 0 : 1].badge}`}
                >
                  {payment.type === "organization"
                    ? "Organization"
                    : "Election"}
                </Badge>
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-background/80 p-3 dark:bg-background/50">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Submitted by
                    </p>
                    <p className="font-medium text-foreground">
                      {payment.submitter_email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p
                      className={`text-base font-semibold ${mobileAccents[payment.type === "organization" ? 0 : 1].amount}`}
                    >
                      ₱
                      {payment.amount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
                <div className="rounded-xl bg-background/80 p-3 dark:bg-background/50">
                  <p className="text-xs text-muted-foreground">Date applied</p>
                  <p className="text-xs font-medium text-foreground">
                    {new Date(payment.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Swipe to browse pending payments
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
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
    </div>
  );
}
