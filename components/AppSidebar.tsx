import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { sidebarItems } from "@/types/sidebar-items";
import Image from "next/image";
import logo from "@/public/logo.svg";

export function AppSidebar() {
  return (
    <Sidebar className="flex flex-col h-full" collapsible="icon">
      <SidebarHeader className="shrink-0">
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <a href="/admin/dashboard" className="flex items-center gap-2">
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
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div>Profile Here</div>
      </SidebarFooter>
    </Sidebar>
  );
}
