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

    const votesToInsert = Object.entries(votes).flatMap(([positionId, candidateIds]) => {
      const candidates = Array.isArray(candidateIds) ? candidateIds : [candidateIds];
      return candidates.map((candidateId) => ({
        voter_id: voterId,
        election_id: electionId,
        position_id: positionId,
        candidate_id: candidateId,
      }));
    });

    const { error: insertError } = await supabaseAdmin.from("votes").insert(votesToInsert);

    if (insertError) {
      console.error("Error inserting votes:", insertError);
      throw new Error("Failed to submit ballot");
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
