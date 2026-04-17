"use server";

import { Candidate } from "@/types/database";
import { fetchCandidates } from "../queries/candidates-queries";

export async function fetchCandidatesAction(electionId: string): Promise<{data: Candidate[] | []; error: string | null}> {
    const candidatesData = await fetchCandidates(electionId);
    if (candidatesData.error) {
        console.error("Error fetching candidates:", candidatesData.error);
        return { data: [], error: candidatesData.error };
    }
    return { data: candidatesData.data, error: null };
}