"use client";

import { HeaderBreadcrumb } from "@/components/HeaderBreadcrumb";
import { ModeToggle } from "@/components/ModeToggle";

interface SuperadminHeaderClientProps {
  breadcrumbItems: Array<{ title: string; href: string }>;
}

export function SuperadminHeaderClient({
  breadcrumbItems,
}: SuperadminHeaderClientProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex-1">
          <HeaderBreadcrumb sidebarItems={breadcrumbItems} />
        </div>
        <div className="flex items-center gap-1">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
