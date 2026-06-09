"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Voter } from "@/types/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export interface VoteAuthResult {
  success: boolean;
  error?: string;
  voterId?: string;
}

export async function authenticateVoter(
  electionId: string,
  studentId: string,
  votingCode: string,
): Promise<VoteAuthResult> {
  let voter: Voter | undefined;

  try {
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
    );

    const normalizedCode = votingCode.replace(/-/g, "").toUpperCase();
    const normalizedStudentId = studentId.trim();
    const escapedStudentId = normalizedStudentId.replace(/%/g, "\\%").replace(/_/g, "\\_");

    const { data: voters, error: queryError } = await supabaseAdmin
      .from("voters")
      .select("*")
      .eq("election_id", electionId)
      .ilike("student_id", escapedStudentId)
      .eq("is_deleted", false);

    if (queryError) {
      console.error("Error querying voters:", queryError);
      return { success: false, error: "Database error occurred" };
    }

    voter = voters?.find((v: Voter) => {
      const normalizedVoterCode = v.voting_code.replace(/-/g, "");
      return normalizedVoterCode === normalizedCode;
    });

    if (!voter) {
      return {
        success: false,
        error: "Invalid student ID or voting code",
      };
    }

    if (voter.code_status === "VOTED") {
      return {
        success: false,
        error: "You have already voted in this election",
      };
    }

    if (voter.code_status !== "SENT") {
      return {
        success: false,
        error: "Your voting code is not valid. Please check your email.",
      };
    }
  } catch (error) {
    console.error("Error in authenticateVoter:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set("agora_voter_session", voter!.id, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production", 
    maxAge: 60 * 60, 
  });

  return { success: true };
}
