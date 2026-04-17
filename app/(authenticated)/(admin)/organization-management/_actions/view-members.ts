"use server";

import { cookies } from "next/headers"; // 1. Import cookies
import { createClient } from "@/lib/supabase/server";
import { MemberDetails } from "@/types/database";

export async function getOrganizationMembers(
  orgId: string,
): Promise<MemberDetails[]> {
  // 2. Await the cookies() function to get the cookieStore
  const cookieStore = await cookies();

  // 3. Pass the cookieStore into createClient and await the result
  const supabase = await createClient(cookieStore);

  // Perform the JOIN query between organization_members and users
  const { data, error } = await supabase
    .from("organization_members")
    .select(
      `
      id,
      organization_id,
      user_id,
      role,
      joined_at,
      kicked_at,
      users!inner (
        first_name,
        last_name,
        email,
        avatar_url
      )
    `,
    )
    .eq("organization_id", orgId)
    .order("joined_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch organization members:", error);
    return []; // Return empty array on error so the UI doesn't crash
  }

  // Map the nested Supabase response into our flat MemberDetails array
  const formattedMembers: MemberDetails[] = data.map((row: any) => ({
    id: row.id,
    organization_id: row.organization_id,
    user_id: row.user_id,
    role: row.role,
    joined_at: row.joined_at,
    kicked_at: row.kicked_at,
    // Flatten the user data
    first_name: row.users.first_name,
    last_name: row.users.last_name,
    email: row.users.email,
    avatar_url: row.users.avatar_url,
  }));

  return formattedMembers;
}
