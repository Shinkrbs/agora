"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
  Organization,
  OrganizationPayment,
  ElectionPayment,
} from "@/types/database";

export interface PendingOrganization extends Organization {
  member_count?: number;
}

export interface PendingPaymentWithDetails extends OrganizationPayment {
  type: "organization";
  organization_name: string;
  submitter_email: string;
}

export interface PendingElectionPaymentWithDetails extends ElectionPayment {
  type: "election";
  organization_name: string;
  election_title: string;
  submitter_email: string;
}

export type PendingPayment =
  | PendingPaymentWithDetails
  | PendingElectionPaymentWithDetails;

export interface GlobalStats {
  pending_orgs_count: number;
  pending_payments_count: number;
  approved_orgs_count: number;
  total_verified_revenue: number;
}

export interface HistoricalEntry {
  id: string;
  type: "organization" | "payment";
  name: string;
  status: string;
  amount?: number;
  created_at: string;
}

/**
 * Phase 1: Fetch all pending organizations from the database.
 * Excludes deleted organizations.
 */
export async function getPendingOrganizations(): Promise<
  PendingOrganization[]
> {
  try {
    const supabase = await createClient(await cookies());

    const { data: orgs, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("approval_status", "pending")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching pending organizations:", error);
      return [];
    }

    return (orgs || []) as PendingOrganization[];
  } catch (error) {
    console.error("Unexpected error in getPendingOrganizations:", error);
    return [];
  }
}

/**
 * Phase 1: Fetch all pending payments (both org and election) with joined data.
 * Includes organization name and submitter email.
 */
export async function getPendingPayments(): Promise<PendingPayment[]> {
  try {
    const supabase = await createClient(await cookies());

    // Fetch pending organization payments (without joins first)
    const { data: orgPayments, error: orgError } = await supabase
      .from("organization_payments")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (orgError) {
      console.error("Error fetching pending org payments:", orgError);
    }

    // Fetch pending election payments (without joins first)
    const { data: electionPayments, error: electionError } = await supabase
      .from("election_payments")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (electionError) {
      console.error("Error fetching pending election payments:", electionError);
    }

    // Fetch all organizations for lookup
    const { data: organizations, error: orgsError } = await supabase
      .from("organizations")
      .select("id, name");

    if (orgsError) {
      console.error("Error fetching organizations:", orgsError);
    }

    // Fetch all users for lookup
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email");

    if (usersError) {
      console.error("Error fetching users:", usersError);
    }

    // Fetch all election sessions for lookup
    const { data: sessions, error: sessionsError } = await supabase
      .from("election_sessions")
      .select("id, title");

    if (sessionsError) {
      console.error("Error fetching election sessions:", sessionsError);
    }

    // Create lookup maps
    const orgMap = new Map(
      (organizations || []).map((org: any) => [org.id, org.name])
    );
    const userMap = new Map((users || []).map((user: any) => [user.id, user.email]));
    const sessionMap = new Map(
      (sessions || []).map((session: any) => [session.id, session.title])
    );

    // Format organization payments
    const formattedOrgPayments: PendingPaymentWithDetails[] = (
      orgPayments || []
    ).map((payment: any) => ({
      ...payment,
      type: "organization" as const,
      organization_name: orgMap.get(payment.organization_id) || "Unknown",
      submitter_email: userMap.get(payment.user_id) || "Unknown",
    }));

    // Format election payments
    const formattedElectionPayments: PendingElectionPaymentWithDetails[] = (
      electionPayments || []
    ).map((payment: any) => ({
      ...payment,
      type: "election" as const,
      organization_name: orgMap.get(payment.organization_id) || "Unknown",
      election_title: sessionMap.get(payment.election_id) || "Unknown",
      submitter_email: userMap.get(payment.user_id) || "Unknown",
    }));

    return [...formattedOrgPayments, ...formattedElectionPayments];
  } catch (error) {
    console.error("Unexpected error in getPendingPayments:", error);
    return [];
  }
}

/**
 * Phase 1: Fetch global stats across the entire system.
 * Includes: pending org count, pending payment count, approved org count, total verified revenue.
 */
export async function getGlobalStats(): Promise<GlobalStats> {
  try {
    const supabase = await createClient(await cookies());

    // Count pending organizations
    const { count: pendingOrgsCount, error: pendingOrgsError } = await supabase
      .from("organizations")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "pending")
      .eq("is_deleted", false);

    // Count approved organizations
    const { count: approvedOrgsCount, error: approvedOrgsError } = await supabase
      .from("organizations")
      .select("id", { count: "exact", head: true })
      .eq("approval_status", "approved")
      .eq("is_deleted", false);

    // Count pending payments (org + election combined)
    const { count: pendingOrgPaymentsCount, error: pendingOrgPaymentsError } =
      await supabase
        .from("organization_payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

    const { count: pendingElectionPaymentsCount, error: pendingElectionPaymentsError } =
      await supabase
        .from("election_payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");

    // Sum verified revenue (org payments only)
    const { data: verifiedOrgPayments, error: verifiedOrgPaymentsError } =
      await supabase
        .from("organization_payments")
        .select("amount")
        .eq("status", "verified");

    // Sum verified revenue (election payments)
    const { data: verifiedElectionPayments, error: verifiedElectionPaymentsError } =
      await supabase
        .from("election_payments")
        .select("amount")
        .eq("status", "verified");

    const totalOrgVerified =
      (verifiedOrgPayments || []).reduce(
        (sum: number, payment: any) => sum + (payment.amount || 0),
        0,
      ) || 0;

    const totalElectionVerified =
      (verifiedElectionPayments || []).reduce(
        (sum: number, payment: any) => sum + (payment.amount || 0),
        0,
      ) || 0;

    const errors = [
      pendingOrgsError,
      approvedOrgsError,
      pendingOrgPaymentsError,
      pendingElectionPaymentsError,
      verifiedOrgPaymentsError,
      verifiedElectionPaymentsError,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error("Errors fetching global stats:", errors);
    }

    return {
      pending_orgs_count: pendingOrgsCount || 0,
      pending_payments_count:
        (pendingOrgPaymentsCount || 0) + (pendingElectionPaymentsCount || 0),
      approved_orgs_count: approvedOrgsCount || 0,
      total_verified_revenue: totalOrgVerified + totalElectionVerified,
    };
  } catch (error) {
    console.error("Unexpected error in getGlobalStats:", error);
    return {
      pending_orgs_count: 0,
      pending_payments_count: 0,
      approved_orgs_count: 0,
      total_verified_revenue: 0,
    };
  }
}

/**
 * Phase 4: Fetch the last 10 non-pending payments and organizations for the audit log.
 */
export async function getRecentActivity(): Promise<HistoricalEntry[]> {
  try {
    const supabase = await createClient(await cookies());

    // Fetch recent verified/rejected org payments
    const { data: recentOrgPayments, error: recentOrgPaymentsError } =
      await supabase
        .from("organization_payments")
        .select("id, status, amount, created_at, organization_id")
        .in("status", ["verified", "rejected"])
        .order("created_at", { ascending: false })
        .limit(5);

    // Fetch recent verified/rejected election payments
    const { data: recentElectionPayments, error: recentElectionPaymentsError } =
      await supabase
        .from("election_payments")
        .select("id, status, amount, created_at, organization_id")
        .in("status", ["verified", "rejected"])
        .order("created_at", { ascending: false })
        .limit(5);

    // Fetch recent approved organizations
    const { data: recentOrgs, error: recentOrgsError } = await supabase
      .from("organizations")
      .select("id, name, approval_status, created_at")
      .eq("approval_status", "approved")
      .eq("is_deleted", false)
      .order("created_at", { ascending: false })
      .limit(5);

    // Fetch all organizations for lookup
    const { data: organizations, error: orgsError } = await supabase
      .from("organizations")
      .select("id, name");

    if (orgsError) {
      console.error("Error fetching organizations for recent activity:", orgsError);
    }

    const errors = [
      recentOrgPaymentsError,
      recentElectionPaymentsError,
      recentOrgsError,
    ].filter(Boolean);

    if (errors.length > 0) {
      console.error("Errors fetching recent activity:", errors);
    }

    // Create lookup map
    const orgMap = new Map(
      (organizations || []).map((org: any) => [org.id, org.name])
    );

    const formattedPayments: HistoricalEntry[] = [
      ...(recentOrgPayments || []).map((payment: any) => ({
        id: payment.id,
        type: "payment" as const,
        name: `${orgMap.get(payment.organization_id) || "Unknown"} - Organization Payment`,
        status: payment.status,
        amount: payment.amount,
        created_at: payment.created_at,
      })),
      ...(recentElectionPayments || []).map((payment: any) => ({
        id: payment.id,
        type: "payment" as const,
        name: `${orgMap.get(payment.organization_id) || "Unknown"} - Election Payment`,
        status: payment.status,
        amount: payment.amount,
        created_at: payment.created_at,
      })),
      ...(recentOrgs || []).map((org: any) => ({
        id: org.id,
        type: "organization" as const,
        name: org.name,
        status: org.approval_status,
        created_at: org.created_at,
      })),
    ].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

    return formattedPayments.slice(0, 10);
  } catch (error) {
    console.error("Unexpected error in getRecentActivity:", error);
    return [];
  }
}

/**
 * Fetch organization details including member count
 */
export async function getOrganizationWithMemberCount(
  orgId: string,
): Promise<PendingOrganization | null> {
  try {
    const supabase = await createClient(await cookies());

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", orgId)
      .single();

    if (orgError) {
      console.error("Error fetching organization:", orgError);
      return null;
    }

    const { count: memberCount } = await supabase
      .from("organization_members")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId);

    return {
      ...(org as Organization),
      member_count: memberCount || 0,
    };
  } catch (error) {
    console.error("Unexpected error in getOrganizationWithMemberCount:", error);
    return null;
  }
}
