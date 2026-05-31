"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export interface DashboardStats {
  activeElection: {
    id: string;
    title: string;
    start_date: string | null;
    end_date: string | null;
    total_voters: number;
    voted_count: number;
  } | null;
  totalElectionsHosted: number;
  totalElectorateReached: number;
  totalVotesProcessed: number;
}

export async function getOrgDashboardStats(
  organizationId: string
): Promise<DashboardStats> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  try {
    // Fetch Active Election
    const { data: activeElectionData } = await supabase
      .from("election_sessions")
      .select("id, title, start_date, end_date")
      .eq("organization_id", organizationId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    let activeElection = null;
    if (activeElectionData) {
      // Get voter stats for active election
      const { count: totalVoters } = await supabase
        .from("voters")
        .select("id", { count: "exact" })
        .eq("election_id", activeElectionData.id);

      const { count: votedCount } = await supabase
        .from("voters")
        .select("id", { count: "exact" })
        .eq("election_id", activeElectionData.id)
        .eq("code_status", "VOTED");

      activeElection = {
        id: activeElectionData.id,
        title: activeElectionData.title,
        start_date: activeElectionData.start_date,
        end_date: activeElectionData.end_date,
        total_voters: totalVoters || 0,
        voted_count: votedCount || 0,
      };
    }

    // Fetch Total Elections Hosted (completed or active)
    const { count: totalElectionsHosted } = await supabase
      .from("election_sessions")
      .select("id", { count: "exact" })
      .eq("organization_id", organizationId)
      .in("status", ["completed", "active"])
      .eq("is_deleted", false);

    // Fetch all elections for this organization to count electorate and votes
    const { data: orgElections } = await supabase
      .from("election_sessions")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("is_deleted", false);

    const electionIds = orgElections?.map((e) => e.id) || [];

    let totalElectorateReached = 0;
    let totalVotesProcessed = 0;

    if (electionIds.length > 0) {
      // Count total voters across all elections
      const { count: electorateCount } = await supabase
        .from("voters")
        .select("id", { count: "exact" })
        .in("election_id", electionIds);

      totalElectorateReached = electorateCount || 0;

      // Count total votes across all elections
      const { count: votesCount } = await supabase
        .from("votes")
        .select("id", { count: "exact" })
        .in("election_id", electionIds);

      totalVotesProcessed = votesCount || 0;
    }

    return {
      activeElection,
      totalElectionsHosted: totalElectionsHosted || 0,
      totalElectorateReached,
      totalVotesProcessed,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      activeElection: null,
      totalElectionsHosted: 0,
      totalElectorateReached: 0,
      totalVotesProcessed: 0,
    };
  }
}
