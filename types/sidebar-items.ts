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
    title: "Voter Management",
    href: "/voter-management",
    icon: UserCog,
  },
  {
    title: "Candidate Management",
    href: "/candidate-management",
    icon: FileUser,
  },
  {
    title: "Election Session Management",
    href: "/election-session",
    icon: Vote,
  },
  {
    title: "Organization Management",
    href: "/organization-management",
    icon: Building2,
  },
  {
    title: "Partylist Management",
    href: "/partylist-management",
    icon: BookUser,
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
  }
];

export interface SidebarProfile {
  name: string;
  email: string;
  avatar_url?: string;
}
