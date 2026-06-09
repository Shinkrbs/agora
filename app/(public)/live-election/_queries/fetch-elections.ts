"use server";

import { createClient } from "@/lib/supabase/server";
import { ElectionSession } from "@/types/database";
import { cookies } from "next/headers";

export async function fetchLiveElections(): Promise<{data: any[] | null; error: string | null}> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data, error} = await supabase.from("election_sessions").select("*, organizations(*)").eq("status", "active").eq("is_deleted", false).order("created_at", { ascending: false });
        
        if (error) {
            console.error("Error fetching live elections:", error);
            return { data: null, error: "Failed to fetch live elections" };
        }
        return { data, error: null };
    } catch (error) {
        return { data: null, error: "Failed to fetch live elections" };
    }
}