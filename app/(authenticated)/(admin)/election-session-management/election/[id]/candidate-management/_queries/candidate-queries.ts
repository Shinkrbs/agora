import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { CandidateTableRow } from "../_types/candidate-types";

export interface CandidateRow {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  image_url: string | null;
  position_id: string;
  partylist_id: string | null;
  platform: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  positions: { name: string } | { name: string }[] | null;
  partylists: { name: string; shorthand_name: string } | { name: string; shorthand_name: string }[] | null;
}

export interface Position {
  id: string;
  name: string;
}

export interface Partylist {
  id: string;
  name: string;
  shorthand_name: string;
}

/**
 * Fetch all candidates for an election with position and partylist relations
 * Returns flattened CandidateTableRow[] for the data table
 */
export async function fetchCandidatesQuery(
  electionId: string
): Promise<{ data: CandidateTableRow[] | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Query candidates with position and partylist joins
    const { data, error } = await supabase
      .from("candidates")
      .select(
        `
        id,
        first_name,
        last_name,
        middle_name,
        suffix,
        image_url,
        position_id,
        partylist_id,
        platform,
        is_deleted,
        positions:position_id(name),
        partylists:partylist_id(name, shorthand_name)
      `
      )
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching candidates:", error);
      return { data: null, error: "Failed to fetch candidates" };
    }

    if (!data) {
      return { data: [], error: null };
    }

    // Transform to flattened CandidateTableRow[]
    const tableRows: CandidateTableRow[] = (data as unknown as CandidateRow[]).map(
      (row) => {
        const full_name = [
          row.first_name,
          row.middle_name,
          row.last_name,
          row.suffix,
        ]
          .filter((part) => part)
          .join(" ");

        // Handle both single object and array responses from Supabase
        const positionData = Array.isArray(row.positions) ? row.positions[0] : row.positions;
        const partylistData = Array.isArray(row.partylists) ? row.partylists[0] : row.partylists;

        return {
          id: row.id,
          image_url: row.image_url,
          full_name,
          position_id: row.position_id,
          position_name: positionData?.name || "Unknown Position",
          partylist_id: row.partylist_id,
          partylist_name: partylistData?.name || null,
          partylist_shorthand: partylistData?.shorthand_name || null,
          is_independent: row.partylist_id === null,
          has_platform: !!row.platform,
          raw_candidate: {
            id: row.id,
            position_id: row.position_id,
            election_id: electionId,
            partylist_id: row.partylist_id,
            first_name: row.first_name,
            last_name: row.last_name,
            middle_name: row.middle_name,
            suffix: row.suffix,
            image_url: row.image_url,
            platform: row.platform,
            created_at: row.created_at,
            updated_at: row.updated_at,
            is_deleted: row.is_deleted,
            position: positionData
              ? { name: positionData.name }
              : undefined,
            partylist: partylistData
              ? {
                  name: partylistData.name,
                  shorthand_name: partylistData.shorthand_name,
                }
              : null,
          },
        };
      }
    );

    return { data: tableRows, error: null };
  } catch (error) {
    console.error("Unexpected error in fetchCandidatesQuery:", error);
    return { data: null, error: "Unexpected error fetching candidates" };
  }
}

/**
 * Fetch positions for an election (for the select dropdown)
 */
export async function fetchPositionsQuery(
  electionId: string
): Promise<{ data: Position[] | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("positions")
      .select("id, name")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching positions:", error);
      return { data: null, error: "Failed to fetch positions" };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error in fetchPositionsQuery:", error);
    return { data: null, error: "Unexpected error fetching positions" };
  }
}

/**
 * Fetch partylists for an election (for the select dropdown)
 */
export async function fetchPartyslistsQuery(
  electionId: string
): Promise<{ data: Partylist[] | null; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const { data, error } = await supabase
      .from("partylists")
      .select("id, name, shorthand_name")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching partylists:", error);
      return { data: null, error: "Failed to fetch partylists" };
    }

    return { data: data || [], error: null };
  } catch (error) {
    console.error("Unexpected error in fetchPartyslistsQuery:", error);
    return {
      data: null,
      error: "Unexpected error fetching partylists",
    };
  }
}
