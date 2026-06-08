"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function kickMember(organizationId: string, targetUserId: string) {
  try {
    const supabase = await createClient(await cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    // Get current user's role
    const { data: currentMember, error: currentMemberError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .is("kicked_at", null)
      .single();

    if (currentMemberError || !currentMember || currentMember.role === "member") {
      return { success: false, message: "You don't have permission to kick members." };
    }

    // Get target user's role
    const { data: targetMember, error: targetMemberError } = await supabase
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", organizationId)
      .eq("user_id", targetUserId)
      .is("kicked_at", null)
      .single();

    if (targetMemberError || !targetMember) {
      return { success: false, message: "Target member not found." };
    }

    if (targetMember.role === "owner") {
      return { success: false, message: "Cannot kick the owner of the organization." };
    }

    if (currentMember.role === "admin" && targetMember.role === "admin") {
      return { success: false, message: "Admins cannot kick other admins. Only the owner can do this." };
    }

    const { error: updateError } = await supabase
      .from("organization_members")
      .update({ kicked_at: new Date().toISOString() })
      .eq("id", targetMember.id);

    if (updateError) {
      console.error("Kick Member Error:", updateError);
      return { success: false, message: "Failed to kick member." };
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Member kicked successfully." };

  } catch (error) {
    console.error("Kick Member Exception:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
