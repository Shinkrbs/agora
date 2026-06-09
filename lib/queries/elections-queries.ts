import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { ElectionSession, ElectionStatus, Position, Partylist, Candidate } from "@/types/database";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";


export async function getElectionSessionById(sessionId: string): Promise<any | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: session, error } = await supabase
            .from("election_sessions")
            .select("*, organizations(*)")
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

// ==========================================
// LIVE ELECTION STATS & CANDIDATES WITH VOTES
// ==========================================

export interface CandidateWithVotes extends Candidate {
    vote_count: number;
    percentage: number;
    color_hex: string;
}

// Color palette for candidates
const candidateColors = [
    "#2563eb", // blue
    "#16a34a", // green
    "#9333ea", // purple
    "#dc2626", // red
    "#ea580c", // orange
    "#0891b2", // cyan
    "#7c3aed", // violet
    "#db2777", // pink
];

export async function getCandidatesWithVotesForPosition(
    positionId: string,
): Promise<CandidateWithVotes[] | null> {
    try {
        const supabase = await createClient(await cookies());
        
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        );
        
        // Fetch candidates for the position
        const { data: candidates, error: candidatesError } = await supabase
            .from("candidates")
            .select("*")
            .eq("position_id", positionId)
            .eq("is_deleted", false);
        
        if (candidatesError) {
            console.error("Error fetching candidates:", candidatesError);
            return null;
        }

        if (!candidates || candidates.length === 0) {
            return [];
        }

        // For each candidate, count their votes
        const candidatesWithVotes: CandidateWithVotes[] = [];
        
        for (let i = 0; i < candidates.length; i++) {
            const candidate = candidates[i] as Candidate;
            
            // Count votes for this candidate
            const { count, error: countError } = await supabaseAdmin
                .from("votes")
                .select("*", { count: "exact", head: true })
                .eq("candidate_id", candidate.id)
                .eq("is_deleted", false);
            
            if (countError) {
                console.error(`Error counting votes for candidate ${candidate.id}:`, countError);
            }

            const voteCount = count || 0;
            candidatesWithVotes.push({
                ...candidate,
                vote_count: voteCount,
                percentage: 0, // Will be calculated after we have all counts
                color_hex: candidateColors[i % candidateColors.length],
            });
        }

        // Calculate total votes for this position
        const totalVotes = candidatesWithVotes.reduce((sum, c) => sum + c.vote_count, 0);

        // Calculate percentages
        const candidatesWithPercentages: CandidateWithVotes[] = candidatesWithVotes.map(
            (candidate) => ({
                ...candidate,
                percentage: totalVotes > 0 ? (candidate.vote_count / totalVotes) * 100 : 0,
            }),
        );

        return candidatesWithPercentages;
    } catch (error) {
        console.error("Unexpected error in getCandidatesWithVotesForPosition:", error);
        return null;
    }
}

export async function getElectionStats(
    electionId: string,
): Promise<{
    totalBallotsCast: number;
    reportingPercentage: number;
    lastUpdated: string;
} | null> {
    try {
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!
        );

        // Count total unique voters who voted in this election
        const { data: voters, error: votersError } = await supabaseAdmin
            .from("voters")
            .select("id")
            .eq("election_id", electionId)
            .eq("code_status", "VOTED")
            .eq("is_deleted", false);

        if (votersError) {
            console.error("Error fetching voter count:", votersError);
            return null;
        }

        // Count total registered voters
        const { count: totalVoters, error: totalError } = await supabaseAdmin
            .from("voters")
            .select("*", { count: "exact", head: true })
            .eq("election_id", electionId)
            .eq("is_deleted", false);

        if (totalError) {
            console.error("Error fetching total voters:", totalError);
            return null;
        }

        const ballotsCast = voters?.length || 0;
        const totalRegistered = totalVoters || 1; // Avoid division by zero
        const reportingPercentage = Math.round((ballotsCast / totalRegistered) * 100);

        // Get the last vote timestamp or use current time
        const { data: lastVote } = await supabaseAdmin
            .from("votes")
            .select("created_at")
            .eq("is_deleted", false)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        let lastUpdated = "Just now";
        if (lastVote?.created_at) {
            const voteTime = new Date(lastVote.created_at);
            const now = new Date();
            const diffMinutes = Math.floor((now.getTime() - voteTime.getTime()) / (1000 * 60));
            
            if (diffMinutes === 0) {
                lastUpdated = "Just now";
            } else if (diffMinutes < 60) {
                lastUpdated = `${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"} ago`;
            } else {
                const diffHours = Math.floor(diffMinutes / 60);
                lastUpdated = `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
            }
        }

        return {
            totalBallotsCast: ballotsCast,
            reportingPercentage,
            lastUpdated,
        };
    } catch (error) {
        console.error("Unexpected error in getElectionStats:", error);
        return null;
    }
}