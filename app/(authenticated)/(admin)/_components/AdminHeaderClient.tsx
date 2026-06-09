"use client";

import { Organization } from "@/types/database";
import { HeaderBreadcrumb } from "@/components/HeaderBreadcrumb";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { ModeToggle } from "@/components/ModeToggle";

interface AdminHeaderClientProps {
  organizations: Organization[];
  breadcrumbItems: Array<{ title: string; href: string }>;
}

export function AdminHeaderClient({
  organizations,
  breadcrumbItems,
}: AdminHeaderClientProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex-1">
          <HeaderBreadcrumb sidebarItems={breadcrumbItems} />
        </div>
        <div className="flex items-center gap-1">
          <ModeToggle />
          <OrganizationSwitcher organizations={organizations} />
        </div>
      </div>
    </header>
  );
}
