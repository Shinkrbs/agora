"use client";

import { PaymentStatus } from "@/types/database";
import { Button } from "@/components/ui/button";

interface PaymentStatusFilterProps {
  selectedStatuses: PaymentStatus[];
  onStatusChange: (statuses: PaymentStatus[]) => void;
}

const STATUS_OPTIONS: { value: PaymentStatus; label: string; variant: "pending" | "verified" | "rejected" }[] = [
  { value: "pending", label: "Pending", variant: "pending" },
  { value: "verified", label: "Verified", variant: "verified" },
  { value: "rejected", label: "Rejected", variant: "rejected" },
];

export function PaymentStatusFilter({
  selectedStatuses,
  onStatusChange,
}: PaymentStatusFilterProps) {
  const toggleStatus = (status: PaymentStatus) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  const isAllSelected = selectedStatuses.length === STATUS_OPTIONS.length;
  const isNoneSelected = selectedStatuses.length === 0;

  const handleSelectAll = () => {
    if (isAllSelected) {
      onStatusChange([]);
    } else {
      onStatusChange(STATUS_OPTIONS.map((opt) => opt.value));
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-foreground">Filter:</span>
      <Button
        variant={isNoneSelected || isAllSelected ? "default" : "outline"}
        size="sm"
        onClick={handleSelectAll}
        className="text-xs"
      >
        {isAllSelected ? "All" : "None"}
      </Button>
      <div className="flex gap-2">
        {STATUS_OPTIONS.map(({ value, label }) => (
          <Button
            key={value}
            variant={selectedStatuses.includes(value) ? "default" : "outline"}
            size="sm"
            onClick={() => toggleStatus(value)}
            className="text-xs"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}
