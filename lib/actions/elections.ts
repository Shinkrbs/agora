"use server";

import { ElectionSession } from "@/types/database";
import { getElectionSessionById } from "../queries/elections-queries";

export async function fetchElectionSessionAction(electionId: string): Promise<{data: ElectionSession | null; error: string | null}> {
    const electionData = await getElectionSessionById(electionId);
    if (electionData === null) {
        console.error("Error fetching election session:");
        return { data: null, error: "Election session not found" };
    }
    return { data: electionData, error: null };
}