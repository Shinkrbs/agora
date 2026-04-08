"use client";

import { Badge } from "@/components/ui/badge";
import { PaymentStatus } from "@/types/database";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      className:
        "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-300",
    },
    verified: {
      label: "Verified",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/70 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    rejected: {
      label: "Rejected",
      className:
        "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-50 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-300",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
