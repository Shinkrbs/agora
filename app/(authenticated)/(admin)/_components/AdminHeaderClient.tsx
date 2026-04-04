"use client";

import { Organization } from "@/types/database";
import { HeaderBreadcrumb } from "@/components/HeaderBreadcrumb";
import { OrganizationSwitcher } from "./OrganizationSwitcher";

interface AdminHeaderClientProps {
  organizations: Organization[];
  breadcrumbItems: Array<{ title: string; href: string }>;
}

export function AdminHeaderClient({ organizations, breadcrumbItems }: AdminHeaderClientProps) {
  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex-1">
          <HeaderBreadcrumb sidebarItems={breadcrumbItems} />
        </div>
        <div className="flex items-center gap-2">
          <OrganizationSwitcher organizations={organizations} />
        </div>
      </div>
    </header>
  );
}
