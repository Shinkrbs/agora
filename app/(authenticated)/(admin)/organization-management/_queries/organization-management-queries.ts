"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { getUserOrganizationRole } from "../_actions/organization-member-role";
import { Organization } from "@/types/database";

export async function getUserOrganizations(): Promise<{ organizations: Organization[]; message: string; success: boolean }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();    

        if (!user) {
            return { organizations: [], message: "Unauthorized. Please log in.", success: false };
        }

        const { data: memberRecords, error } = await supabase
            .from("organization_members")
            .select(`
                organizations (*)
            `)
            .eq("user_id", user.id)
            .is("kicked_at", null); 

        if (error) {
            console.error("Error fetching organizations:", error);
            return { organizations: [], message: "Error fetching organizations.", success: false };
        }
        
        const organizations = memberRecords
            .map((record) => record.organizations as unknown as Organization)
            .filter((org) => org && !org.is_deleted);

        return { organizations, message: "Organizations fetched successfully.", success: true };
    } catch (error) {
        console.error("Error in getUserOrganizations:", error);
        return { organizations: [], message: "An unexpected error occurred.", success: false };
    }
}

export async function kickMember(organizationId: string, memberRecordId: string): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { success: false, message: "Unauthorized. Please log in." };
        }

        // 1. Fetch roles
        const currentUserRole = await getUserOrganizationRole(currentUser.id, organizationId);
        
        const { data: targetRecord } = await supabase.from("organization_members")
            .select("role")
            .eq("id", memberRecordId)
            .single();
            
        const targetRole = targetRecord?.role;

        // 2. Base Security Checks
        if (!currentUserRole || currentUserRole === "member") {
            return { success: false, message: "You do not have permission to kick members." };
        }

        if (targetRole === "owner") {
            return { success: false, message: "The organization owner cannot be kicked." };
        }

        // 3. Admin-Specific Restrictions
        if (currentUserRole === "admin" && targetRole === "admin") {
            return { success: false, message: "Admins cannot kick fellow Admins." };
        }

        // 4. Execute Kick
        const { error } = await supabase
            .from("organization_members")
            .update({ kicked_at: new Date().toISOString() })
            .eq("id", memberRecordId)
            .eq("organization_id", organizationId);

        if (error) {
            console.error("Error kicking member:", error);
            return { success: false, message: "Failed to kick member." };
        }
        revalidatePath(`/admin/organization-management/`);
        return { success: true, message: "Member kicked successfully." };
    } catch (error) {
        console.error("Error in kickMember:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}