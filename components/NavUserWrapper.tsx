"use client";

import dynamic from "next/dynamic";
import type { SidebarProfile } from "@/types/sidebar-items";

const NavUserDynamic = dynamic(() => import("./nav-user").then(mod => ({ default: mod.NavUser })), {
  ssr: false,
  loading: () => <div className="h-10 w-full" />,
});

type NavUserWrapperProps = {
  user: SidebarProfile;
  role: "admin" | "superadmin";
};

export function NavUserWrapper({ user, role }: NavUserWrapperProps) {
  return <NavUserDynamic user={user} role={role} />;
}
