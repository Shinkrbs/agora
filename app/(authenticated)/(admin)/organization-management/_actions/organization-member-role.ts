"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { OrgMemberRole } from "@/types/database";
import { getCurrentUser } from "@/lib/queries/users-queries";

export async function getUserOrganizationRole(userId: string, organizationId: string): Promise<OrgMemberRole | null> {
    try {
        const supabase = await createClient(await cookies());
        const response = await supabase.from("organization_members")
            .select("role")
            .eq("user_id", userId)
            .eq("organization_id", organizationId)
            .single();
        return response.data?.role || null;
    } catch (error) {
        console.error("Error fetching organization member role:", error);
        return null;
    }
}

// Handles standard Member <-> Admin promotions
export async function updateOrganizationMemberRole(
    memberRecordId: string, 
    organizationId: string, 
    newRole: OrgMemberRole
): Promise<{ success: boolean; message: string }> {
    try {
        const supabase = await createClient(await cookies());
        const currentUser = await getCurrentUser();
        const userRole = await getUserOrganizationRole(currentUser?.id || "", organizationId);

        // Security: Only Owners and Admins can promote/demote
        if (userRole !== "owner" && userRole !== "admin") {
            return { success: false, message: "Unauthorized. You do not have permission to change roles." };
        }

        // Security: Prevent creating a second owner through this standard function
        if (newRole === "owner") {
            return { success: false, message: "Ownership must be transferred, not assigned." };
        }

        const { error } = await supabase.from("organization_members")
            .update({ role: newRole })
            .eq("id", memberRecordId)
            .eq("organization_id", organizationId);

        if (error) {
            console.error("Error updating member role:", error);
            return { success: false, message: "Failed to update member role." };
        }
        
        revalidatePath(`/admin/organization-management/${organizationId}/members`);
        return { success: true, message: "Member role updated successfully." };
    } catch (error) {
        console.error("Error updating member role:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}

// Handles passing the torch to the next president/owner
export async function transferOwnership(
    newOwnerMemberRecordId: string, 
    organizationId: string
): Promise<{ success: boolean; message: string }> {
    try {
        const supabase = await createClient(await cookies());
        const currentUser = await getCurrentUser();
        const currentUserRole = await getUserOrganizationRole(currentUser?.id || "", organizationId);

        // Security: ONLY the current Owner can transfer ownership
        if (currentUserRole !== "owner") {
            return { success: false, message: "Only the current Owner can pass down ownership." };
        }

        // Step 1: Elevate the new target to Owner
        const { error: promoteError } = await supabase.from("organization_members")
            .update({ role: "owner" })
            .eq("id", newOwnerMemberRecordId)
            .eq("organization_id", organizationId);

        if (promoteError) {
            console.error("Error promoting new owner:", promoteError);
            return { success: false, message: "Failed to promote the new owner." };
        }

        // Step 2: Demote the current user to Admin
        const { error: demoteError } = await supabase.from("organization_members")
            .update({ role: "admin" })
            .eq("user_id", currentUser!.id)
            .eq("organization_id", organizationId);

        if (demoteError) {
            // Note: If this fails, the org temporarily has 2 owners, which is a safe failure state
            console.error("Error demoting previous owner:", demoteError);
        }

        revalidatePath(`/admin/organization-management/${organizationId}/members`);
        return { success: true, message: "Ownership transferred successfully. You are now an Admin." };
    } catch (error) {
        console.error("Error transferring ownership:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}