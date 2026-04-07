import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { ElectionSession, ElectionStatus, Position, Partylist, Candidate } from "@/types/database";
import type { ElectionCardSummary } from "@/app/(authenticated)/(admin)/election-session-management/_types/election-card-type";
import { getCurrentUser } from "./users-queries";


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

export async function getElectionSessionsByOrganizationId(orgId: string): Promise<{ data: ElectionCardSummary[] | null, message: string | null, error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();

        if (!user) {
            return { data: null, message: null, error: "User not authenticated" };
        }

        const { data: turnOutData, error: turnoutError } = await supabase.rpc("get_election_turnouts_by_org", { p_organization_id: orgId });

        if (turnoutError) {
            console.error("Error fetching election turnouts:", turnoutError);
            return { data: null, message: null, error: "Failed to fetch election turnouts" };
        }

        const { data, error } = await supabase
            .from("election_sessions")
            .select("id, title, status, start_date, end_date")
            .eq("organization_id", orgId)
            .eq("is_deleted", false);

        if (error) {
            console.error("Error fetching election sessions for organization:", error);
            return { data: null, message: null, error: "Failed to fetch elections" };
        }

        const { data: paymentStatusData, error: paymentError } = await supabase
            .from("election_payments")
            .select("election_id, status")
            .eq("organization_id", orgId);

        if (paymentError) {
            console.error("Error fetching payment statuses:", paymentError);
            return { data: null, message: null, error: "Failed to fetch payment statuses" };
        }

        const elections: ElectionCardSummary[] = data.map((election) => {
            const turnoutInfo = turnOutData.find((t: any) => t.election_id === election.id);
            const paymentInfo = paymentStatusData.find((p: any) => p.election_id === election.id);
            return {
                id: election.id,
                title: election.title,
                status: election.status,
                start_date: election.start_date,
                end_date: election.end_date,
                payment_status: paymentInfo?.status || "pending",
                metrics: {
                    positions_count: 0,
                    turnout_percentage: turnoutInfo?.turnout_percentage || 0,
                },
            };
        });

        return { data: elections, message: "Elections fetched successfully", error: null };
    } catch (error) {
        console.error("Unexpected error in getElectionSessionsByOrganizationId:", error);
        return { data: null, message: null, error: "An unexpected error occurred" };
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