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