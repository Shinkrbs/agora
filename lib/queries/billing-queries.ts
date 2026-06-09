import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { QueryData } from "@supabase/supabase-js";

export type AppSupabaseClient = Awaited<ReturnType<typeof createClient>>;

// ============================================================================
// SUPERADMIN QUERIES (The Verification Queue)
// ============================================================================

// 1. Pending Organization Payments
export function pendingOrgPaymentsQuery(supabase: AppSupabaseClient) {
    return supabase
        .from("organization_payments")
        .select(`
            *,
            organization:organizations (id, name, shorthand_name),
            user:users!user_id (id, first_name, last_name, email)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
}

export type PendingOrgPayment = QueryData<ReturnType<typeof pendingOrgPaymentsQuery>>[number];

export async function getPendingOrganizationPayments() {
    try {
        const supabase = await createClient(await cookies());
        const { data, error } = await pendingOrgPaymentsQuery(supabase);

        if (error) {
            console.error("Error in getPendingOrganizationPayments:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Unexpected error in getPendingOrganizationPayments:", error);
        return null;
    }
}

// 2. Pending Election Payments
export function pendingElectionPaymentsQuery(supabase: AppSupabaseClient) {
    return supabase
        .from("election_payments")
        .select(`
            *,
            organization:organizations (id, name, shorthand_name),
            election:election_sessions (id, title),
            user:users!user_id (id, first_name, last_name, email)
        `)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
}

export type PendingElectionPayment = QueryData<ReturnType<typeof pendingElectionPaymentsQuery>>[number];

export async function getPendingElectionPayments() {
    try {
        const supabase = await createClient(await cookies());
        const { data, error } = await pendingElectionPaymentsQuery(supabase);

        if (error) {
            console.error("Error in getPendingElectionPayments:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Unexpected error in getPendingElectionPayments:", error);
        return null;
    }
}

// ============================================================================
// ORGANIZATION OFFICER QUERIES (Payment History)
// ============================================================================

// 3. Organization Payment History
export function orgPaymentHistoryQuery(supabase: AppSupabaseClient, orgId: string) {
    return supabase
        .from("organization_payments")
        .select(`
            *,
            verifier:users!verified_by (first_name, last_name)
        `)
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
}

export type OrgPaymentHistory = QueryData<ReturnType<typeof orgPaymentHistoryQuery>>[number];

export async function getOrganizationPaymentHistory(orgId: string) {
    try {
        const supabase = await createClient(await cookies());
        const { data, error } = await orgPaymentHistoryQuery(supabase, orgId);

        if (error) {
            console.error("Error in getOrganizationPaymentHistory:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Unexpected error in getOrganizationPaymentHistory:", error);
        return null;
    }
}

// 4. Election Payment History
export function electionPaymentHistoryQuery(supabase: AppSupabaseClient, orgId: string) {
    return supabase
        .from("election_payments")
        .select(`
            *,
            election:election_sessions (title, status),
            verifier:users!verified_by (first_name, last_name)
        `)
        .eq("organization_id", orgId)
        .order("created_at", { ascending: false });
}

export type ElectionPaymentHistory = QueryData<ReturnType<typeof electionPaymentHistoryQuery>>[number];

export async function getElectionPaymentHistory(orgId: string) {
    try {
        const supabase = await createClient(await cookies());
        const { data, error } = await electionPaymentHistoryQuery(supabase, orgId);

        if (error) {
            console.error("Error in getElectionPaymentHistory:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Unexpected error in getElectionPaymentHistory:", error);
        return null;
    }
}