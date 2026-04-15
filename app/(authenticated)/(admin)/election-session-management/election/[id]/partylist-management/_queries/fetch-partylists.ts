import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PartylistWithCandidateCount } from "../_types/partylist-types";

export async function fetchPartylists(electionId: string): Promise<{data: PartylistWithCandidateCount[] | null, error: string | null}> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        
        const { data, error } = await supabase.from("partylists").select("*, candidates(count)").eq("election_id", electionId).eq("is_deleted", false);

        if (error) {
            throw new Error("Failed to fetch partylists");
        }

        const formattedData: PartylistWithCandidateCount[] = (data || []).map((partylist) => {
            const count = partylist.candidates?.count || 0;
            const { candidates, ...rest } = partylist;

            return {
                ...rest,
                candidate_count: count,
            }
        })
        console.log("Fetched partylists with candidate counts:", formattedData);
        return { data: formattedData, error: null };
    } catch (error) {
        console.error("Error fetching partylists:", error);
        return { data: null, error: "Failed to fetch partylists" };
    }
}