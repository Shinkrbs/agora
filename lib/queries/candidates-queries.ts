import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { Candidate } from "@/types/database";

export async function fetchCandidates(electionId: string): Promise<{data: Candidate[] | []; error: string | null}> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase
            .from("candidates")
            .select("*")
            .eq("election_id", electionId)
            .eq("is_deleted", false);
        
        if (error) {
            console.error("Error fetching candidates:", error);
            return { data: [], error: error.message };
        }
        return { data: data || [], error: null };
    } catch (error) {
        console.error("Unexpected error fetching candidates:", error);
        return { data: [], error: "Unexpected error occurred" };
    }
}