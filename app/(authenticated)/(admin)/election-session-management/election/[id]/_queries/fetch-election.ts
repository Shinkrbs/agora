import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ElectionHeaderData } from "../_types/election-header";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { PaymentStatus } from "@/types/database";

export const dynamic = 'force-dynamic'

const getSupabaseClient = async () => {
    const cookieStore = await cookies();
    return createClient(cookieStore);
};

const voterCount = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<number> => {
    try {
        const { data, error } = await supabase.from("voters").select("id", { count: "exact" }).eq("election_id", electionId);
        if (error) {
            console.error("Error checking voter data:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking voter data:", error);
        return 0;
    }
};

const candidateCount = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<number> => {
    try {
        const { data, error } = await supabase.from("candidates").select("id", { count: "exact" }).eq("election_id", electionId);
        if (error) {
            console.error("Error checking candidate data:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking candidate data:", error);
        return 0;
    }
};

const positionCount = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<number> => {
    try {
        const { data, error } = await supabase.from("positions").select("id", { count: "exact" }).eq("election_id", electionId);
        if (error) {
            console.error("Error checking position data:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking position data:", error);
        return 0;
    }
};

const paymentStatus = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<PaymentStatus> => {
    try {
        const { data, error } = await supabase.from("election_payments").select("status").eq("election_id", electionId).maybeSingle();
        if (error) {
            console.error("Error checking payment status:", error);
        }
        return data === null ? "unpaid" : (data.status as PaymentStatus);
    } catch (error) {
        console.error("Error checking payment status:", error);
        return "unpaid";
    }
};

const votedCount = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<number> => {
    try {
        const { data, error } = await supabase
            .from("voters")
            .select("id", { count: "exact" })
            .eq("election_id", electionId)
            .eq("code_status", "VOTED");
        if (error) {
            console.error("Error checking voted count:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking voted count:", error);
        return 0;
    }
};

const sentCount = async (supabase: Awaited<ReturnType<typeof createClient>>, electionId: string): Promise<number> => {
    try {
        const { data, error } = await supabase
            .from("voters")
            .select("id", { count: "exact" })
            .eq("election_id", electionId)
            .eq("code_status", "SENT");
        if (error) {
            console.error("Error checking sent count:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking sent count:", error);
        return 0;
    }
};


export async function fetchElection(electionId: string): Promise<{ data: ElectionHeaderData | null; message: string; error: string | null }> {
    try {
        const supabase = await getSupabaseClient();
        const user = await getCurrentUser();

        if (!user) {
            return { data: null, message: "Unauthorized", error: "User not authenticated" };
        }

        if (user.role !== "admin") {
            return { data: null, message: "Forbidden", error: "User does not have admin privileges" };
        }

        const { data, error } = await supabase
            .from("election_sessions")
            .select("title, start_date, end_date, status")
            .eq("id", electionId)
            .single();

        if (error) {
            return { data: null, message: "Error fetching election", error: error.message };
        }

        // Run all independent count queries in parallel
        const [voters, candidates, positions, payment, voted, sent] = await Promise.all([
            voterCount(supabase, electionId),
            candidateCount(supabase, electionId),
            positionCount(supabase, electionId),
            paymentStatus(supabase, electionId),
            votedCount(supabase, electionId),
            sentCount(supabase, electionId),
        ]);

        const isSetupComplete = 
            data.start_date !== null && 
            data.end_date !== null && 
            voters > 0 && 
            candidates > 0 && 
            positions > 0;

        const election: ElectionHeaderData = {
            id: electionId,
            title: data.title,
            startDate: data.start_date,
            endDate: data.end_date,
            status: data.status,
            paymentStatus: payment,
            isSetupComplete: isSetupComplete,
            totalVoters: voters,
            totalCandidates: candidates,
            totalPositions: positions,
            votedCount: voted,
            sentCount: sent,
        };
        return { data: election, message: "Election fetched successfully", error: null };
    } catch (error) {
        console.error("Error fetching election:", error);
        return { data: null, message: "Error fetching election", error: error instanceof Error ? error.message : String(error) };
    }
}
