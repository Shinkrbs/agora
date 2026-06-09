"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function deletePartylist(partylistId: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { error } = await supabase.from("partylists").update({ is_deleted: true }).eq("id", partylistId);
        if (error) {
            throw new Error("Failed to delete partylist");
        } else {
            const {error} = await supabase.from("candidates").update({ partylist_id: null }).eq("partylist_id", partylistId);
            if(error) {
                throw new Error("Failed to update candidates");
            }
        }
        return { success: true, error: null };
    } catch (error) {
        return { success: false, error: "Failed to delete partylist" };
    }
}