import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  ElectionSession,
} from "@/types/database";

export interface CandidateWithVotes {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  partylist_shorthand: string;
  vote_count: number;
  isWinner: boolean;
}

export interface PositionTally {
  position_id: string;
  position_name: string;
  seat_count: number;
  candidates: CandidateWithVotes[];
}

export interface ReportData {
  election: ElectionSession;
  total_voters: number;
  voted_count: number;
  turnout_percentage: number;
  positions: PositionTally[];
  generated_at: string;
}

const getSupabaseClient = async () => {
  const cookieStore = await cookies();
  return createClient(cookieStore);
};

/**
 * Fetches the election session data
 */
async function getElectionData(
  supabase: Awaited<ReturnType<typeof createClient>>,
  electionId: string
): Promise<ElectionSession | null> {
  try {
    const { data, error } = await supabase
      .from("election_sessions")
      .select("*")
      .eq("id", electionId)
      .single();

    if (error) {
      console.error("Error fetching election session:", error);
      return null;
    }

    return data as ElectionSession;
  } catch (error) {
    console.error("Unexpected error fetching election session:", error);
    return null;
  }
}

/**
 * Fetches turnout stats: total voters and voted count
 */
async function getTurnoutStats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  electionId: string
): Promise<{ total_voters: number; voted_count: number }> {
  try {
    const [totalRes, votedRes] = await Promise.all([
      supabase
        .from("voters")
        .select("id", { count: "exact" })
        .eq("election_id", electionId),
      supabase
        .from("voters")
        .select("id", { count: "exact" })
        .eq("election_id", electionId)
        .eq("code_status", "VOTED"),
    ]);

    if (totalRes.error) {
      console.error("Error fetching total voters:", totalRes.error);
    }
    if (votedRes.error) {
      console.error("Error fetching voted count:", votedRes.error);
    }

    return {
      total_voters: totalRes.count || 0,
      voted_count: votedRes.count || 0,
    };
  } catch (error) {
    console.error("Unexpected error fetching turnout stats:", error);
    return { total_voters: 0, voted_count: 0 };
  }
}

/**
 * Fetches all positions for an election with their candidates and vote tallies
 */
async function getPositionTallies(
  supabase: Awaited<ReturnType<typeof createClient>>,
  electionId: string
): Promise<PositionTally[]> {
  try {
    // Fetch all positions
    const { data: positions, error: positionsError } = await supabase
      .from("positions")
      .select("*")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (positionsError) {
      console.error("Error fetching positions:", positionsError);
      return [];
    }

    if (!positions || positions.length === 0) {
      return [];
    }

    const positionTallies: PositionTally[] = [];

    for (const position of positions) {
      // Fetch candidates for this position
      const { data: candidates, error: candidatesError } = await supabase
        .from("candidates")
        .select("*")
        .eq("position_id", position.id)
        .eq("election_id", electionId)
        .eq("is_deleted", false);

      if (candidatesError) {
        console.error(
          `Error fetching candidates for position ${position.id}:`,
          candidatesError
        );
        continue;
      }

      if (!candidates || candidates.length === 0) {
        positionTallies.push({
          position_id: position.id,
          position_name: position.name,
          seat_count: position.seat_count,
          candidates: [],
        });
        continue;
      }

      // Fetch all votes for this position
      const { data: votes, error: votesError } = await supabase
        .from("votes")
        .select("*")
        .eq("position_id", position.id)
        .eq("election_id", electionId)
        .eq("is_deleted", false);

      if (votesError) {
        console.error(
          `Error fetching votes for position ${position.id}:`,
          votesError
        );
      }

      // Aggregate votes by candidate
      const voteMap = new Map<string, number>();
      if (votes) {
        for (const vote of votes) {
          voteMap.set(vote.candidate_id, (voteMap.get(vote.candidate_id) || 0) + 1);
        }
      }

      // Build candidate list with vote counts
      const candidateList: CandidateWithVotes[] = [];
      
      for (const candidate of candidates) {
        // Fetch partylist data if candidate has one
        let partylist_shorthand = "IND"; // Default to Independent

        if (candidate.partylist_id) {
          try {
            const { data: partylist, error: partListError } = await supabase
              .from("partylists")
              .select("shorthand_name")
              .eq("id", candidate.partylist_id)
              .single();

            if (!partListError && partylist) {
              partylist_shorthand = partylist.shorthand_name;
            }
          } catch (error) {
            console.error(
              `Error fetching partylist for candidate ${candidate.id}:`,
              error
            );
          }
        }

        candidateList.push({
          id: candidate.id,
          first_name: candidate.first_name,
          last_name: candidate.last_name,
          middle_name: candidate.middle_name,
          suffix: candidate.suffix,
          partylist_shorthand,
          vote_count: voteMap.get(candidate.id) || 0,
          isWinner: false, // Will be set after sorting
        });
      }

      // Sort by vote count descending and mark winners
      candidateList.sort((a, b) => b.vote_count - a.vote_count);

      for (let i = 0; i < Math.min(position.seat_count, candidateList.length); i++) {
        candidateList[i].isWinner = true;
      }

      positionTallies.push({
        position_id: position.id,
        position_name: position.name,
        seat_count: position.seat_count,
        candidates: candidateList,
      });
    }

    return positionTallies;
  } catch (error) {
    console.error("Unexpected error fetching position tallies:", error);
    return [];
  }
}

/**
 * Aggregates all report data for an election
 */
export async function getReportData(
  electionId: string
): Promise<ReportData | null> {
  try {
    const supabase = await getSupabaseClient();

    const [election, turnoutStats, positions] = await Promise.all([
      getElectionData(supabase, electionId),
      getTurnoutStats(supabase, electionId),
      getPositionTallies(supabase, electionId),
    ]);

    if (!election) {
      return null;
    }

    const turnout_percentage =
      turnoutStats.total_voters > 0
        ? Math.round(
            (turnoutStats.voted_count / turnoutStats.total_voters) * 100
          )
        : 0;

    return {
      election,
      total_voters: turnoutStats.total_voters,
      voted_count: turnoutStats.voted_count,
      turnout_percentage,
      positions,
      generated_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error in getReportData:", error);
    return null;
  }
}
