"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectionStatus } from "@/types/database";

interface ElectionStatusTabsProps {
  activeStatus: ElectionStatus | "all";
  onStatusChange: (status: ElectionStatus | "all") => void;
}

const statuses: Array<{ value: ElectionStatus | "all"; label: string }> = [
  { value: "all", label: "All Elections" },
  { value: "draft", label: "Draft" },
  { value: "scheduled", label: "Scheduled" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "archived", label: "Archived" },
];

export function ElectionStatusTabs({ activeStatus, onStatusChange }: ElectionStatusTabsProps) {
  return (
    <Tabs value={activeStatus} onValueChange={(value) => onStatusChange(value as ElectionStatus | "all")} className="w-full">
      <TabsList className="w-full justify-start h-auto bg-transparent border-b border-border rounded-none p-0">
        {statuses.map(({ value, label }) => (
          <TabsTrigger
            key={value}
            value={value}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-foreground"
          >
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
