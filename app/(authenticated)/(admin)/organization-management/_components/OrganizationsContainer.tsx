"use client";

import { useState } from "react";
import { Organization } from "@/types/database";
import { ApprovalStatus } from "@/types/database";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrganizationsHeader } from "./OrganizationsHeader";
import { OrganizationsGrid } from "./OrganizationsGrid";

interface OrganizationsContainerProps {
  organizations: Organization[];
}

type FilterStatus = ApprovalStatus | "all";

export function OrganizationsContainer({
  organizations,
}: OrganizationsContainerProps) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("approved");

  const filteredOrganizations = organizations.filter((org) => {
    if (filterStatus === "all") {
      return true;
    }
    return org.approval_status === filterStatus;
  });

  return (
    <div className="min-h-screen p-5 py-1">
      <div className="max-w-7xl mx-auto">
        <OrganizationsHeader />

        {/* Filter Dropdown */}
        <div className="mb-6 flex items-center gap-3">
          <label
            htmlFor="status-filter"
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Filter by Status:
          </label>
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
            <SelectTrigger id="status-filter" className="w-48">
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="all">All Organizations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <OrganizationsGrid organizations={filteredOrganizations} />
      </div>
    </div>
  );
}
