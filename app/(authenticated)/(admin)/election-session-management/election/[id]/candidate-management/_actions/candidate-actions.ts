"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { CandidateFormData } from "../_types/candidate-types";

interface CreateCandidateInput extends CandidateFormData {
  election_id: string;
}

interface EditCandidateInput extends CandidateFormData {
  candidate_id: string;
}

/**
 * Create a new candidate
 */
export async function createCandidateAction(
  data: CreateCandidateInput
): Promise<{ success: boolean; error: string | null; candidateId?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Validate required fields
    if (!data.first_name?.trim() || !data.last_name?.trim()) {
      return {
        success: false,
        error: "First name and last name are required",
      };
    }

    if (!data.position_id) {
      return { success: false, error: "Position is required" };
    }

    // Build platform object with vision and key_projects
    const platform =
      data.vision || (data.key_projects && data.key_projects.length > 0)
        ? {
            vision: data.vision || "",
            key_projects: data.key_projects || [],
          }
        : null;

    const { data: result, error } = await supabase
      .from("candidates")
      .insert({
        election_id: data.election_id,
        position_id: data.position_id,
        partylist_id: data.partylist_id || null,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        middle_name: data.middle_name?.trim() || null,
        suffix: data.suffix?.trim() || null,
        platform,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Supabase error creating candidate:", error);
      return { success: false, error: "Failed to create candidate" };
    }

    return {
      success: true,
      error: null,
      candidateId: result?.id,
    };
  } catch (error) {
    console.error("Unexpected error creating candidate:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
}

/**
 * Edit an existing candidate
 */
export async function editCandidateAction(
  data: EditCandidateInput
): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Validate required fields
    if (!data.first_name?.trim() || !data.last_name?.trim()) {
      return {
        success: false,
        error: "First name and last name are required",
      };
    }

    if (!data.position_id) {
      return { success: false, error: "Position is required" };
    }

    // Build platform object with vision and key_projects
    const platform =
      data.vision || (data.key_projects && data.key_projects.length > 0)
        ? {
            vision: data.vision || "",
            key_projects: data.key_projects || [],
          }
        : null;

    const { error } = await supabase
      .from("candidates")
      .update({
        position_id: data.position_id,
        partylist_id: data.partylist_id || null,
        first_name: data.first_name.trim(),
        last_name: data.last_name.trim(),
        middle_name: data.middle_name?.trim() || null,
        suffix: data.suffix?.trim() || null,
        platform,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.candidate_id);

    if (error) {
      console.error("Supabase error updating candidate:", error);
      return { success: false, error: "Failed to update candidate" };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error updating candidate:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
}

/**
 * Soft delete a candidate
 */
export async function deleteCandidateAction(
  candidateId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { error } = await supabase
      .from("candidates")
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", candidateId);

    if (error) {
      console.error("Supabase error deleting candidate:", error);
      return { success: false, error: "Failed to delete candidate" };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error deleting candidate:", error);
    return { success: false, error: "Unexpected error occurred" };
  }
}
