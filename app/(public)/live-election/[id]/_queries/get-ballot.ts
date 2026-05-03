"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Position, Candidate, Partylist } from "@/types/database";

export interface BallotData {
  electionId: string;
  positions: Array<{
    id: string;
    name: string;
    seatCount: number;
    candidates: Array<{
      id: string;
      firstName: string;
      lastName: string;
      partyName: string | null;
      imageUrl: string | null;
    }>;
  }>;
}

export async function getBallot(electionId: string): Promise<BallotData | null> {
  try {
    const supabase = await createClient(await cookies());

    // Fetch positions for the election
    const { data: positions, error: positionsError } = await supabase
      .from("positions")
      .select("*")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (positionsError) {
      console.error("Error fetching positions:", positionsError);
      return null;
    }

    if (!positions || positions.length === 0) {
      return {
        electionId,
        positions: [],
      };
    }

    // Fetch all candidates and partylists for this election
    const { data: candidates, error: candidatesError } = await supabase
      .from("candidates")
      .select("*")
      .eq("election_id", electionId)
      .eq("is_deleted", false)
      .order("created_at", { ascending: true });

    if (candidatesError) {
      console.error("Error fetching candidates:", candidatesError);
      return null;
    }

    const { data: partylists, error: partylistsError } = await supabase
      .from("partylists")
      .select("*")
      .eq("election_id", electionId)
      .eq("is_deleted", false);

    if (partylistsError) {
      console.error("Error fetching partylists:", partylistsError);
      return null;
    }

    // Build a map of partylists for quick lookup
    const partylistsMap = (partylists || []).reduce(
      (acc, party) => {
        acc[party.id] = party;
        return acc;
      },
      {} as Record<string, Partylist>,
    );

    // Transform positions with their candidates
    const ballotPositions = (positions as Position[]).map((position) => {
      const positionCandidates = (candidates as Candidate[])
        .filter((c) => c.position_id === position.id)
        .map((candidate) => ({
          id: candidate.id,
          firstName: candidate.first_name,
          lastName: candidate.last_name,
          partyName: candidate.partylist_id
            ? partylistsMap[candidate.partylist_id]?.name || null
            : null,
          imageUrl: candidate.image_url || null,
        }));

      return {
        id: position.id,
        name: position.name,
        seatCount: position.seat_count,
        candidates: positionCandidates,
      };
    });

    return {
      electionId,
      positions: ballotPositions,
    };
  } catch (error) {
    console.error("Unexpected error in getBallot:", error);
    return null;
  }
}
