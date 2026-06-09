"use server";

import { fetchElection as fetchElectionData } from "../_queries/fetch-election";

export async function fetchElectionAction(electionId: string) {
    return await fetchElectionData(electionId);
}