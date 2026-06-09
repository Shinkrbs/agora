"use client";

import { PaymentStatus } from "@/types/database";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

interface PaymentStatusFilterProps {
  selectedStatuses: PaymentStatus[];
  onStatusChange: (statuses: PaymentStatus[]) => void;
}

const STATUS_OPTIONS: {
  value: PaymentStatus;
  label: string;
  variant: "pending" | "verified" | "rejected";
}[] = [
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

  const handleResetToDefault = () => {
    onStatusChange(["pending", "verified", "rejected"]);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 rounded-lg">
            <ListFilter className="h-4 w-4" />
            Status
            {!isAllSelected && selectedStatuses.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-4 px-1.5 text-[10px]"
              >
                {selectedStatuses.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="start">
          <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {STATUS_OPTIONS.map(({ value, label }) => (
            <DropdownMenuCheckboxItem
              key={value}
              checked={selectedStatuses.includes(value)}
              onCheckedChange={() => toggleStatus(value)}
            >
              {label}
            </DropdownMenuCheckboxItem>
          ))}
          <DropdownMenuSeparator />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-8 w-full justify-start"
          >
            {isAllSelected ? "Clear all" : "Select all"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_OPTIONS.filter(({ value }) =>
          selectedStatuses.includes(value),
        ).map(({ value, label }) => (
          <Badge
            key={value}
            variant="outline"
            className="h-6 rounded-md px-2 text-xs"
          >
            {label}
          </Badge>
        ))}
        {isNoneSelected && (
          <Badge variant="destructive" className="h-6 rounded-md px-2 text-xs">
            No status selected
          </Badge>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResetToDefault}
          className="h-7 rounded-md px-2 text-xs"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
