import { LayoutDashboard, UserCog, FileUser, Vote, Building2, BookUser, Settings, type LucideIcon} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const adminSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Election Session Management",
    href: "/election-session-management",
    icon: Vote,
  },
  {
    title: "Organization Management",
    href: "/organization-management",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export const superAdminSidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/superadmin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Payments Management",
    href: "/payments-management",
    icon: UserCog,
  },
  {
    title: "Reports Management",
    href: "/reports-management",
    icon: FileUser,
  },
  {
    title: "Settings",
    href: "/superadmin/settings",
    icon: Settings,
  },
];

export interface SidebarProfile {
  name: string;
  email: string;
  avatar_url?: string;
}
