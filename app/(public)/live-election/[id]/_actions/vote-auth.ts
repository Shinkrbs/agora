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

    // Normalize the voting code by removing hyphens
    const normalizedCode = votingCode.replace(/-/g, "");
    const normalizedStudentId = studentId.trim();

    // Query for the voter
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

    // Find voter with matching voting code (also normalize for comparison)
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

    // Check if already voted
    if (voter.code_status === "VOTED") {
      return {
        success: false,
        error: "You have already voted in this election",
      };
    }

    // Check if code status is SENT
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

  // If validation passed, set cookie and redirect (outside try-catch to avoid catching redirect error)
  const cookieStore = await cookies();
  cookieStore.set("agora_voter_session", voter!.id, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    maxAge: 60 * 60, // 1 hour expiration
  });

  redirect(`/live-election/${electionId}/ballot`);
}
