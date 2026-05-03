"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Voter } from "@/types/database";

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
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const normalizedCode = votingCode.replace(/-/g, "");
    const normalizedStudentId = studentId.trim();

    const { data: voters, error: queryError } = await supabase
      .from("voters")
      .select("*")
      .eq("election_id", electionId)
      .eq("student_id", normalizedStudentId)
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

  redirect(`/live-election/${electionId}/ballot`);
}
