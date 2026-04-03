import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { Organization, ElectionSession, ElectionStatus, Posi, Position, Partylist, Candidate } from "@/types/database";


export async function getElectionSessionById(sessionId: string): Promise<ElectionSession | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: session, error } = await supabase
            .from("election_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();
        if (error) {
            console.error("Error fetching election session data:", error);
            return null; 
        }
        return session as ElectionSession;
    } catch (error) {
        console.error("Unexpected error in getElectionSessionById:", error);
        return null;
    }
}

export async function getAllElectionSessions(): Promise<ElectionSession[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: sessions, error } = await supabase
            .from("election_sessions")
            .select("*")
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching election sessions:", error);
            return null; 
        }
        return sessions as ElectionSession[];
    } catch (error) {
        console.error("Unexpected error in getAllElectionSessions:", error);
        return null;
    }
}

export async function getElectionSessionsByOrganizationId(orgId: string): Promise<ElectionSession[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: sessions, error } = await supabase
            .from("election_sessions")
            .select("*")
            .eq("organization_id", orgId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching election sessions for organization:", error);
            return null; 
        }
        return sessions as ElectionSession[];
    } catch (error) {
        console.error("Unexpected error in getElectionSessionsByOrganizationId:", error);
        return null;
    }
}

export async function getElectionSessionsByStatus(status: ElectionStatus): Promise<ElectionSession[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: sessions, error } = await supabase
            .from("election_sessions")
            .select("*")
            .eq("status", status)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching election sessions by status:", error);
            return null; 
        }
        return sessions as ElectionSession[];
    } catch (error) {
        console.error("Unexpected error in getElectionSessionsByStatus:", error);
        return null;
    }
}

export async function getElectionSessionsByOrganizationAndStatus(orgId: string, status: ElectionStatus): Promise<ElectionSession[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: sessions, error } = await supabase
            .from("election_sessions")
            .select("*")
            .eq("organization_id", orgId)
            .eq("status", status)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching election sessions by organization and status:", error);
            return null; 
        }
        return sessions as ElectionSession[];
    } catch (error) {
        console.error("Unexpected error in getElectionSessionsByOrganizationAndStatus:", error);
        return null;
    }
}

export async function getPositionsByElectionSessionId(sessionId: string): Promise<Position[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: positions, error } = await supabase
            .from("positions")
            .select("*")
            .eq("election_id", sessionId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching positions for election session:", error);
            return null; 
        }
        return positions as Position[];
    } catch (error) {
        console.error("Unexpected error in getPositionsByElectionSessionId:", error);
        return null;
    }
}

export async function getPartylistsByElectionSessionId(sessionId: string): Promise<Partylist[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: partylists, error } = await supabase
            .from("partylists")
            .select("*")
            .eq("election_id", sessionId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching partylists for election session:", error);
            return null; 
        }
        return partylists as Partylist[];
    } catch (error) {
        console.error("Unexpected error in getPartylistsByElectionSessionId:", error);
        return null;
    }
}

export async function getCandidatesByPositionId(positionId: string): Promise<Candidate[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: candidates, error } = await supabase
            .from("candidates")
            .select("*")
            .eq("position_id", positionId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching candidates for position:", error);
            return null; 
        }
        return candidates as Candidate[];
    } catch (error) {
        console.error("Unexpected error in getCandidatesByPositionId:", error);
        return null;
    }
}

export async function getCandidatesByPartylistId(partylistId: string): Promise<Candidate[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: candidates, error } = await supabase
            .from("candidates")
            .select("*")
            .eq("partylist_id", partylistId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching candidates for partylist:", error);
            return null; 
        }
        return candidates as Candidate[];
    } catch (error) {
        console.error("Unexpected error in getCandidatesByPartylistId:", error);
        return null;
    }
}