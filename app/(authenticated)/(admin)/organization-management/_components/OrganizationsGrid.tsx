"use client";

import { OrganizationCard } from "./OrganizationCard";
import { Organization } from "@/types/database";

interface OrganizationsGridProps {
  organizations: Organization[];
}

export function OrganizationsGrid({ organizations }: OrganizationsGridProps) {
  if (organizations.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">
            No organizations found. Create or join an organization to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations.map((org) => (
        <OrganizationCard
          key={org.id}
          id={org.id}
          name={org.name}
          shorthandName={org.shorthand_name}
          logoUrl={org.logo_url}
          approvalStatus={org.approval_status}
        />
      ))}
    </div>
  );
}
