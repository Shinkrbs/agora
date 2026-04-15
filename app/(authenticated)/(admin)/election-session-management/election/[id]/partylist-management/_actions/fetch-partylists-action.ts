"use server";

import { fetchPartylists as fetchPartylistsAction } from "../_queries/fetch-partylists";

export async function fetchPartylists(electionId: string) {
    const result = await fetchPartylistsAction(electionId);
    return result;
}