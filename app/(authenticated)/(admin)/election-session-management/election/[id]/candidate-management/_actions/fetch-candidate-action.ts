"use server";

import { fetchCandidatesQuery, fetchPositionsQuery, fetchPartyslistsQuery, Position, Partylist } from "../_queries/candidate-queries";
import { CandidateTableRow } from "../_types/candidate-types";

export async function fetchCandidatesAction(electionId: string): Promise<{ data: CandidateTableRow[] | null; error: string | null }> {
    const response = await fetchCandidatesQuery(electionId);
    if (response.error) {
        console.error("Error fetching candidates:", response.error);
        return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
}

export async function fetchPositionsAction(electionId: string): Promise<{ data: Position[] | null; error: string | null }> {
    const response = await fetchPositionsQuery(electionId);
    if (response.error) {
        console.error("Error fetching positions:", response.error);
        return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
}

export async function fetchPartylistsAction(electionId: string): Promise<{ data: Partylist[] | null; error: string | null }> {
    const response = await fetchPartyslistsQuery(electionId);
    if (response.error) {
        console.error("Error fetching partylists:", response.error);
        return { data: null, error: response.error };
    }
    return { data: response.data, error: null };
}