"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function submitBallotAction(
  electionId: string,
  votes: Record<string, string | string[]>,
) {
  try {
    const cookieStore = await cookies();
    const voterId = cookieStore.get('agora_voter_session')?.value;
    
    if (!voterId) {
        throw new Error("Unauthorized: Invalid voting session.");
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY! 
    );

    const { data: voter, error: voterError } = await supabaseAdmin
      .from("voters")
      .select("*")
      .eq("id", voterId)
      .single();

    if (voterError || !voter) {
      throw new Error("Unauthorized");
    }

    if (voter.code_status === "VOTED") {
      throw new Error("You have already cast your ballot");
    }

    const { data: positions, error: positionsError } = await supabaseAdmin
      .from("positions")
      .select("id, seat_count")
      .eq("election_id", electionId);

    if (positionsError || !positions) {
      throw new Error("Failed to fetch election positions");
    }

    const seatCountMap = new Map(positions.map((p) => [p.id, p.seat_count]));

    const validVotes: Record<string, string[]> = {};
    for (const [positionId, candidateIds] of Object.entries(votes)) {
      if (candidateIds === "ABSTAIN") {
        continue;
      }

      const candidates = Array.isArray(candidateIds) ? candidateIds : [candidateIds];
      const seatCount = seatCountMap.get(positionId);

      if (!seatCount) {
        throw new Error(`Invalid position: ${positionId}`);
      }

      if (candidates.length > seatCount) {
        throw new Error(`Too many candidates selected for a position. Maximum is ${seatCount}.`);
      }

      validVotes[positionId] = candidates;
    }

    const votesToInsert = Object.entries(validVotes).flatMap(([positionId, candidates]) => {
      return candidates.map((candidateId) => ({
        voter_id: voterId,
        election_id: electionId,
        position_id: positionId,
        candidate_id: candidateId,
      }));
    });

    if (votesToInsert.length > 0) {
      const { error: insertError } = await supabaseAdmin.from("votes").insert(votesToInsert);

      if (insertError) {
        console.error("Error inserting votes:", insertError);
        throw new Error("Failed to submit ballot");
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("voters")
      .update({ code_status: "VOTED" })
      .eq("id", voterId);

    if (updateError) {
      console.error("Error updating voter status:", updateError);
      throw new Error("Failed to update voting status");
    }

    cookieStore.delete("agora_voter_session");

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(errorMessage);
  }
}
