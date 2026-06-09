"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function transferOwnership(organizationId: string, targetUserId: string) {
  try {
    const supabase = await createClient(await cookies());
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized. Please log in." };
    }

    // Get current user's role
    const { data: currentMember, error: currentMemberError } = await supabase
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .is("kicked_at", null)
      .single();

    if (currentMemberError || !currentMember || currentMember.role !== "owner") {
      return { success: false, message: "Only the current owner can transfer ownership." };
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

    if (targetMember.role !== "admin") {
      return { success: false, message: "Ownership can only be transferred to an Admin." };
    }

    // Perform transfer ownership transaction-like operation
    // 1. Demote current owner to admin
    const { error: demoteError } = await supabase
      .from("organization_members")
      .update({ role: "admin" })
      .eq("id", currentMember.id);

    if (demoteError) {
      console.error("Demote Owner Error:", demoteError);
      return { success: false, message: "Failed to demote current owner." };
    }

    // 2. Promote target admin to owner
    const { error: promoteError } = await supabase
      .from("organization_members")
      .update({ role: "owner" })
      .eq("id", targetMember.id);

    if (promoteError) {
      console.error("Promote New Owner Error:", promoteError);
      // We should ideally rollback here, but for simplicity we assume success or manual fix if this fails
      return { success: false, message: "Demoted owner, but failed to promote new owner. Please contact support." };
    }

    revalidatePath("/admin/settings");
    return { success: true, message: "Ownership transferred successfully." };

  } catch (error) {
    console.error("Transfer Ownership Exception:", error);
    return { success: false, message: "An unexpected error occurred." };
  }
}
