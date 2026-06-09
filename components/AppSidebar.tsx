import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.svg";
import { NavUser } from "./nav-user";
import type { SidebarProfile } from "@/types/sidebar-items";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { SidebarNavItems } from "./SidebarNavItems";
import type { User } from "@/types/database";

type AppSidebarProps = {
  user?: User | null;
};

export async function AppSidebar({ user: providedUser }: AppSidebarProps) {
  const user = providedUser ?? (await getCurrentUser());
  // Map user data to match SideProfile structure
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const sidebarProfile: SidebarProfile = {
    name: fullName || user?.email || "Guest",
    email: user?.email || "guest@example.com",
    avatar_url: user?.avatar_url ?? undefined,
  };

  const role = user?.role === "superadmin" ? "superadmin" : "admin";
  return (
    <Sidebar
      className="flex h-full flex-col overflow-hidden"
      collapsible="icon"
    >
      <SidebarHeader className="shrink-0">
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <Link
              href={`/${role}/dashboard`}
              className="flex items-center gap-2"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <Image
                  src={logo}
                  height={32}
                  width={32}
                  alt="logo"
                  className="shrink-0"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">
                  SOES
                </span>
                <span className="truncate text-[10px] text-muted-foreground">
                  Student Organization Election System
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <div className="px-2">
        <SidebarSeparator className="mx-0" />
      </div>
      <SidebarContent className="flex-1 min-h-0 overflow-y-auto pb-2">
        <SidebarGroup>
          <SidebarNavItems role={role} />
        </SidebarGroup>
      </SidebarContent>
      <div className="px-2">
        <SidebarSeparator className="mx-0" />
      </div>
      <SidebarFooter className="sticky bottom-0 z-10 mt-auto shrink-0 border-t border-sidebar-border/60 bg-sidebar pb-2 pt-2">
        <NavUser
          user={{
            name: sidebarProfile.name ?? "Guest",
            email: sidebarProfile.email ?? "guest@example.com",
            avatar_url: sidebarProfile.avatar_url,
          }}
          role={role}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
