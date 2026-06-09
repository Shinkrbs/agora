import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function fetchRecentVotes(
  electionId: string,
  limit: number = 5
): Promise<
  Array<{
    id: string;
    created_at: string;
  }>
> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("votes")
      .select("id, created_at")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching recent votes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching recent votes:", error);
    return [];
  }
}
