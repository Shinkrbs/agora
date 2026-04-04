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
import logo from "@/public/logo.svg";
import { NavUserWrapper } from "./NavUserWrapper";
import type { SidebarProfile } from "@/types/sidebar-items";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { SidebarNavItems } from "./SidebarNavItems";

export async function AppSidebar() {
  // Fetch the current user data
  const user = await getCurrentUser();
  // Map user data to match SideProfile structure
  const sidebarProfile: SidebarProfile = {
    name: user?.first_name + " " + user?.last_name,
    email: user?.email || "",
    avatar_url: user?.avatar_url || "/default-avatar.png", // Fallback avatar
  };

  const role = user?.role === "superadmin" ? "superadmin" : "admin";
  return (
    <Sidebar className="flex flex-col h-full" collapsible="icon">
      <SidebarHeader className="shrink-0">
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a
              href={`/${user?.role}/dashboard`}
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
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarHeader>
      <div className="px-2">
        <SidebarSeparator className="mx-0" />
      </div>
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarNavItems role={role} />
        </SidebarGroup>
      </SidebarContent>
      <div className="px-2">
        <SidebarSeparator className="mx-0" />
      </div>
      <SidebarFooter>
        <NavUserWrapper
          user={{
            name: sidebarProfile.name ?? "Guest",
            email: sidebarProfile.email ?? "guest@example.com",
            avatar_url: sidebarProfile.avatar_url ?? "/avatars/default.png",
          }}
          role={role}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
