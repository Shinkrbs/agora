"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { MemberDetails } from "@/types/database";

export async function getOrganizationMembers(organizationId: string): Promise<MemberDetails[]> {
  const supabase = await createClient(await cookies());

  const { data, error } = await supabase
    .from("organization_members")
    .select(`
      *,
      users:user_id (
        first_name,
        last_name,
        email,
        avatar_url
      )
    `)
    .eq("organization_id", organizationId)
    .is("kicked_at", null); // Only fetch active members

  if (error) {
    console.error("Error fetching organization members:", error);
    return [];
  }

  // Format the data to match the MemberDetails interface
  return (data || []).map((member: any) => ({
    id: member.id,
    organization_id: member.organization_id,
    user_id: member.user_id,
    role: member.role,
    joined_at: member.joined_at,
    kicked_at: member.kicked_at,
    first_name: member.users?.first_name || "Unknown",
    last_name: member.users?.last_name || "User",
    email: member.users?.email || "No email",
    avatar_url: member.users?.avatar_url,
  }));
}
