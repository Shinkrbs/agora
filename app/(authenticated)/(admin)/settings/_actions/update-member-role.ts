"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateMemberRole(organizationId: string, targetUserId: string, newRole: "admin" | "member") {
  try {
    const supabase = await createClient(await cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    // Get current user's role in the org
    const { data: currentMember, error: currentMemberError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .is("kicked_at", null)
      .single();

    if (currentMemberError || !currentMember) {
      return { success: false, message: "You are not a member of this organization." };
    }

    if (currentMember.role === "member") {
      return { success: false, message: "You don't have permission to change roles." };
    }

    // Get target user's current role
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
      return { success: false, message: "Cannot change the role of the owner. Use Transfer Ownership." };
    }

    // Admin trying to change another Admin's role (only Owner can do this, or Admin can if allowed? Let's say Admins can only promote members to Admin, or demote Admins to members, wait rules say: "Admin Powers: Can promote members to admin and demote admins to members.")
    // Okay, Admin can promote/demote. 

    const { error: updateError } = await supabase
      .from("organization_members")
      .update({ role: newRole })
      .eq("id", targetMember.id);

    if (updateError) {
      console.error("Update Role Error:", updateError);
      return { success: false, message: "Failed to update role." };
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Role updated successfully." };

  } catch (error) {
    console.error("Update Member Role Exception:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
