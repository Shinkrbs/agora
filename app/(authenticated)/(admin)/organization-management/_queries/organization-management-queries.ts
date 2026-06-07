"use server";

import { getCurrentUser } from "@/lib/queries/users-queries";
import { createClient } from "@/lib/supabase/server";
import { Organization } from "@/types/database";
import { cookies } from "next/headers";

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

export async function isOwner(organizationId: string): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();
        if (!user) {
            return false;
        }
        const { data: memberRecord, error } = await supabase
            .from("organization_members")
            .select("role")
            .eq("user_id", user.id)
            .eq("organization_id", organizationId)
            .is("kicked_at", null)
            .single();
        if (error) {
            console.error("Error checking ownership:", error);
            return false;
        }
        const isOwner = memberRecord?.role === "owner";
        return isOwner;
    } catch (error) {
        console.error("Error in isOwner:", error);
        return false;
    }
}

export async function kickMember(organizationId: string, memberId: string): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();

        if (!user) {
            return { success: false, message: "Unauthorized. Please log in." };
        }

        // Check if the current user is an owner
        const isOwnerCheck = await isOwner(organizationId);
        if (!isOwnerCheck) {
            return { success: false, message: "Only organization owners can kick members." };
        }

        // Update the member's kicked_at timestamp
        const { error } = await supabase
            .from("organization_members")
            .update({ kicked_at: new Date().toISOString() })
            .eq("id", memberId)
            .eq("organization_id", organizationId);

        if (error) {
            console.error("Error kicking member:", error);
            return { success: false, message: "Failed to kick member." };
        }

        return { success: true, message: "Member kicked successfully." };
    } catch (error) {
        console.error("Error in kickMember:", error);
        return { success: false, message: "An unexpected error occurred." };
    }
}