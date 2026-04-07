import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ElectionCardSummary } from "../_types/election-card-type";
import { getCurrentUser } from "@/lib/queries/users-queries";

export async function getElectionsByOrganization(organizationId: string): Promise<{ data: ElectionCardSummary[] | null, message: string | null, error: string | null }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();

        if (!user) {
            return { data: null, message: null, error: "User not authenticated" };
        }

        if(! (await isMemberOfOrganization(organizationId))) {
            return { data: null, message: null, error: "User is not a member of the organization" };
        }

        const { data: turnOutData, error: turnoutError } = await supabase.rpc("get_election_turnouts_by_org", { p_organization_id: organizationId });

        if (turnoutError) {
            console.error("Error fetching election turnouts:", turnoutError);
            return { data: null, message: null, error: "Failed to fetch election turnouts" };
        }

        const { data, error } = await supabase.
            from("election_sessions").
            select('id, title, status, start_date, end_date').
            eq("organization_id", organizationId);

        if (error) {
            console.error("Error fetching elections:", error);
            return { data: null, message: null, error: "Failed to fetch elections" };
        }

        const { data: paymentStatusData, error: paymentError } = await supabase.from("election_payments").select("election_id, status").eq("organization_id", organizationId);

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
                payment_status: paymentInfo?.status ?? "Not Paid",
                turnout_percentage: turnoutInfo ? turnoutInfo.turnout_percentage : 0,
            };
        });

        return { data: elections, message: "Elections fetched successfully", error: null };
    } catch (error) {
        console.error("Error fetching elections:", error);
        return { data: null, message: null, error: "An unexpected error occurred" };
    }
}

export async function isMemberOfOrganization(organizationId: string): Promise<boolean> {
    try{
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const user = await getCurrentUser();

        const { data, error } = await supabase
            .from("organization_members")
            .select("*")
            .eq("organization_id", organizationId)
            .eq("user_id", user?.id).maybeSingle();
        
        if (error) {
            console.error("Error checking organization membership:", error);
            return false;
        }

        return data !== null;
    } catch (error) {
        console.error("Error checking organization membership:", error);
        return false;
    }
}