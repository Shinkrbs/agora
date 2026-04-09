import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PositionTemplate } from "@/types/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPositionTemplate(organizationId: string, templateData: Omit<PositionTemplate, 'id' | 'created_at' | 'updated_at' | 'is_deleted'>): Promise<{ success: boolean; error: string | null }> {
    try{
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            redirect("/login");
        }

        const { error } = await supabase.from("position_templates").insert({
            name: templateData.name,
            positions: templateData.positions,
            organization_id: organizationId
        });
        if (error) {
            return { success: false, error: error.message };
        }
        revalidatePath("/position-templates");
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: "An unexpected error occurred: " + (error as Error).message };
    }
}