"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminSidebarItems,
  superAdminSidebarItems,
  type SidebarItem,
} from "@/types/sidebar-items";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

function normalizePath(path: string) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }
  return path;
}

function isActivePath(currentPath: string, href: string) {
  const current = normalizePath(currentPath);
  const target = normalizePath(href);

  if (target === "/") {
    return current === "/";
  }

  return current === target || current.startsWith(`${target}/`);
}

export function SidebarNavItems({ role }: { role: "admin" | "superadmin" }) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const items: SidebarItem[] =
    role === "superadmin" ? superAdminSidebarItems : adminSidebarItems;

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={isActivePath(pathname, item.href)}
          >
            <Link href={item.href} onClick={handleNavigate}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
