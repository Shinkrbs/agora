import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ElectionHeaderData } from "../_types/election-header";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { PaymentStatus } from "@/types/database";

const voterCount: (electionId: string) => Promise<number> = async (electionId: string) => {
    try{ 
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase.from("voters").select("id").eq("election_id", electionId);
        if(error) {
            console.error("Error checking voter data:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking voter data:", error);
        return 0;
    }
}

const candidateCount: (electionId: string) => Promise<number> = async (electionId: string) => {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase.from("candidates").select("id").eq("election_id", electionId);
        if(error) {
            console.error("Error checking candidate data:", error);
            return 0;
        }
        return data ? data.length : 0;
    } catch (error) {
        console.error("Error checking candidate data:", error);
        return 0;
    }
}

const positionCount: (electionId: string) => Promise<number> = async (electionId: string) => {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase.from("positions").select("id").eq("election_id", electionId);
        if(error) {
            console.error("Error checking position data:", error);
            return 0;
        }
        if(data) {
            return data.length;
        }
    } catch (error) {
        console.error("Error checking position data:", error);
    }
    return 0;
}

const paymentStatus: (electionId: string) => Promise<PaymentStatus> = async (electionId: string) => {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data, error } = await supabase.from("election_payments").select("status").eq("election_id", electionId).maybeSingle();
        if(error) {
            console.error("Error checking payment status:", error);
        }
        return data === null ? "unpaid" : (data.status as PaymentStatus);
    } catch (error) {
        console.error("Error checking payment status:", error);
        return "unpaid";
    }
}

export async function fetchElection(electionId: string): Promise<{data: ElectionHeaderData | null, message: string, error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();

        let election: ElectionHeaderData = {
            title: null,
            startDate: null,
            endDate: null,
            status: "draft",
            paymentStatus: "unpaid",
            isSetupComplete: false,
        }

        if(!user) {
            return { data: null, message: "Unauthorized", error: "User not authenticated" };
        }

        if(user.role !== "admin") {
            return { data: null, message: "Forbidden", error: "User does not have admin privileges" };
        }

        const { data, error } = await supabase.from("election_sessions").select("title, start_date, end_date, status").eq("id", electionId).single();

        if(error) {
            return { data: null, message: "Error fetching election", error: error.message };
        }
        const isSetupComplete = data.start_date !== null && data.end_date !== null && (await voterCount(electionId)) > 0 && (await candidateCount(electionId)) > 0 && (await positionCount(electionId)) > 0;
        const payment_status = await paymentStatus(electionId);

        if(data) {
            election = {
                title: data.title,
                startDate: data.start_date,
                endDate: data.end_date,
                status: data.status,
                paymentStatus: payment_status, 
                isSetupComplete: isSetupComplete,
            }
        }

        return { data: election, message: "Election fetched successfully", error: null };
    } catch (error) {
        console.error("Error fetching election:", error);
        return { data: null, message: "Error fetching election", error: error instanceof Error ? error.message : String(error) };
    }
}
