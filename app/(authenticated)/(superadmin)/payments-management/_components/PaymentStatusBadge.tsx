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
      className: "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100",
    },
    verified: {
      label: "Verified",
      className: "bg-green-100 text-green-800 border-green-300 hover:bg-green-100",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 border-red-300 hover:bg-red-100",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
