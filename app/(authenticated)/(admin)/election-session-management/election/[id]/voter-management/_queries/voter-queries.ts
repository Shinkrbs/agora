"use server";

import { createClient } from "@/lib/supabase/server";
import { Voter } from "@/types/database";
import { cookies } from "next/headers";

export async function fetchVoters(electionId: string): Promise<{data: Voter[] | null; error: string | null}> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { data, error } = await supabase
            .from("voters")
            .select("*")
            .eq("election_id", electionId).eq("is_deleted", false);
        
        if(error) {
            console.error("Error fetching voters:", error);
            return { data: null, error: error.message };
        }

        return { data, error: null };
    } catch (err) {
        console.error("Unexpected error fetching voters:", err);
        return { data: null, error: "An unexpected error occurred while fetching voters." };
    }
}