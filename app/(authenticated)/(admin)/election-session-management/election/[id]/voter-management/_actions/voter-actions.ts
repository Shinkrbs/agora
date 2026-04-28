"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { generateVoterCode } from "../_utils/generate-voter-code";

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
                code_status: "unsent",
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

    const votersToInsert = parsedVoters.map((voter) => ({
      election_id: electionId,
      student_id: voter.student_id,
      email: voter.email,
      voting_code: generateVoterCode(),
      code_status: "unsent",
    }));

    const { data, error } = await supabase
      .from("voters")
      .insert(votersToInsert)
      .select(); 
    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "One or more Student IDs already exist in this election." };
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