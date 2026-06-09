"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/auth/logout";

export function LogoutButton() {
const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Button type="button" onClick={handleLogout}>
      <LogOut />
      <span>Log out</span>
    </Button>
  );
}
