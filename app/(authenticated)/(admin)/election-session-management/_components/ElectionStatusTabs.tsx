"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ElectionStatus } from "@/types/database";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function ElectionStatusTabs({
  activeStatus,
  onStatusChange,
}: ElectionStatusTabsProps) {
  const activeStatusConfig =
    statuses.find((status) => status.value === activeStatus) ?? statuses[0];

  return (
    <div className="w-full">
      <div className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-10 justify-between rounded-xl text-sm"
            >
              <span>{activeStatusConfig.label}</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-(--radix-dropdown-menu-trigger-width)"
          >
            {statuses.map(({ value, label }) => (
              <DropdownMenuItem
                key={value}
                onClick={() => onStatusChange(value)}
              >
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:block">
        <Tabs
          value={activeStatus}
          onValueChange={(value) =>
            onStatusChange(value as ElectionStatus | "all")
          }
          className="w-full"
        >
          <TabsList className="w-full h-auto justify-start gap-1 rounded-xl border border-border/50 bg-muted/50 p-1">
            {statuses.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="rounded-lg border-0 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/60"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
