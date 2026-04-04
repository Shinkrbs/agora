export const STATIC_LABELS: Record<string, string> = {
    admin: "Admin",
    superadmin: "Super Admin",
    dashboard: "Profile",
    settings: "Settings",
};

export type BreadcrumbNavItem = {
  title: string;
  href: string;
};

export interface HeaderBreadcrumbProps {
  sidebarItems: BreadcrumbNavItem[];
}

export const nonNavigableSegments = new Set(["admin", "superadmin"]);