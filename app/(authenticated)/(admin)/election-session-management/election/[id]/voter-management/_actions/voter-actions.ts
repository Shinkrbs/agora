"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { generateVoterCode } from "../_utils/generate-voter-code";
import { sendVotingCodeEmail } from "@/lib/mailer";

export async function addVoter(electionId: string, studentId: string, email: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const votingCode = generateVoterCode();

        const { error } = await supabase
            .from("voters")
            .insert({
                election_id: electionId,
                student_id: studentId,
                email: email,
                voting_code: votingCode,
                code_status: "UNSENT",
            });
        
        if (error) {
            console.error("Error adding voter:", error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Unexpected error adding voter:", err);
        return { success: false, error: "An unexpected error occurred while adding the voter." };
    }
}

export async function importVotersCSVAction(
  electionId: string, 
  parsedVoters: { student_id: string; email: string }[]
) {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Check for existing voters in this election
    const studentIds = parsedVoters.map(v => v.student_id);
    const { data: existingVoters, error: queryError } = await supabase
      .from("voters")
      .select("student_id, email")
      .eq("election_id", electionId)
      .in("student_id", studentIds)
      .eq("is_deleted", false);

    if (queryError) {
      console.error("Error checking existing voters:", queryError);
      return { success: false, error: "Failed to validate voter data." };
    }

    if (existingVoters && existingVoters.length > 0) {
      const existingIds = existingVoters.map(v => v.student_id);
      return { 
        success: false, 
        error: `The following Student IDs already exist in this election: ${existingIds.join(", ")}. Please remove duplicates and try again.` 
      };
    }

    const votersToInsert = parsedVoters.map((voter) => ({
      election_id: electionId,
      student_id: voter.student_id,
      email: voter.email,
      voting_code: generateVoterCode(),
      code_status: "UNSENT",
    }));

    const { data, error } = await supabase
      .from("voters")
      .insert(votersToInsert)
      .select(); 
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "One or more Student IDs or emails already exist in this election." };
      }
      throw new Error(error.message);
    }

    return { 
      success: true, 
      message: `Successfully imported ${data.length} voters.` 
    };

  } catch (error) {
    console.error("Bulk import error:", error);
    return { success: false, error: "Failed to process bulk import." };
  }
}

export async function editVoter(voterId: string, studentId: string, email: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { error } = await supabase
            .from("voters")
            .update({
                student_id: studentId,
                email: email,
            })
            .eq("id", voterId);
        
        if (error) {
            console.error("Error editing voter:", error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Unexpected error editing voter:", err);
        return { success: false, error: "An unexpected error occurred while editing the voter." };
    }
}

export async function deleteVoter(voterId: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { error } = await supabase
            .from("voters")
            .update({ is_deleted: true })
            .eq("id", voterId);
        
        if (error) {
            console.error("Error deleting voter:", error);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Unexpected error deleting voter:", err);
        return { success: false, error: "An unexpected error occurred while deleting the voter." };
    }
}

export async function sendVotingCode(voterId: string, electionId: string, votingCode: string, studentId: string, email: string): Promise<{ success: boolean; error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);

        const { success, error} = await sendVotingCodeEmail(email, studentId, votingCode, electionId);
        if (!success) {
            console.error("Error sending voting code email:", error);
            return { success: false, error: "Failed to send voting code email." };
        }

        const { error: updateError } = await supabase
            .from("voters")
            .update({ code_status: "SENT" })
            .eq("id", voterId);

        if (updateError) {
            console.error("Error updating voter status:", updateError);
            return { success: false, error: "Failed to update voter status." };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("Unexpected error sending voting code:", err);
        return { success: false, error: "An unexpected error occurred while sending the voting code." };
    }
}

export async function sendBatchedVotingCodesAction(
  batch: { id: string; student_id: string; email: string; voting_code: string; election_id: string }[]
): Promise<{ success: boolean; sentCount: number; failedCount: number; failedIds: string[] }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const successfulIds: string[] = [];
    const failedIds: string[] = [];

    for (const voter of batch) {
      try {
        const emailResult = await sendVotingCodeEmail(
          voter.email,
          voter.student_id,
          voter.voting_code,
          voter.election_id
        );

        if (emailResult.success) {
          successfulIds.push(voter.id);
        } else {
          failedIds.push(voter.id);
          console.error(`Failed to send email to ${voter.email}:`, emailResult.error);
        }
      } catch (error) {
        failedIds.push(voter.id);
        console.error(`Error processing voter ${voter.id}:`, error);
      }

      await new Promise((res) => setTimeout(res, 200));
    }

    if (successfulIds.length > 0) {
      const { error: updateError } = await supabase
        .from("voters")
        .update({ code_status: "SENT" })
        .in("id", successfulIds);

      if (updateError) {
        console.error("Error updating voter statuses:", updateError);
      }
    }

    return {
      success: failedIds.length === 0,
      sentCount: successfulIds.length,
      failedCount: failedIds.length,
      failedIds,
    };
  } catch (error) {
    console.error("Batch sending error:", error);
    return {
      success: false,
      sentCount: 0,
      failedCount: batch.length,
      failedIds: batch.map((v) => v.id),
    };
  }
}