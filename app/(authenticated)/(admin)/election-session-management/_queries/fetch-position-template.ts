import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PositionTemplate } from "@/types/database";
import { redirect } from "next/navigation";

export async function fetchPositionTemplatebyId(positionTemplateId: string): Promise<{data: PositionTemplate | null, error: string | null}> {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect("/login");    
    }
    
    try {
        const { data, error } = await supabase.from("position_templates").select("*").eq("id", positionTemplateId).eq("is_deleted", false).maybeSingle();
        if(error) {
            console.error("Error fetching position template:", error);
            return { data: null, error: error.message };
        }
        return { data, error: null };
    } catch (error) {
        console.error("Unexpected error fetching position template:", error);
        return { data: null, error: "An unexpected error occurred while fetching position template." };
    }
}