import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { Organization, OrganizationMember, ApprovalStatus } from "@/types/database";

// ------------------------------------------
// ADMIN DASHBOARD QUERIES
// ------------------------------------------

export async function getOrganizationById(orgId: string): Promise<Organization | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: organization, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("id", orgId)
            .single();
        if (error) {
            console.error("Error fetching organization data:", error);
            return null; 
        }
        return organization as Organization;
    } catch (error) {
        console.error("Unexpected error in getOrganizationById:", error);
        return null;
    }
}

export async function getAllOrganizations(): Promise<Organization[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: organizations, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching organizations:", error);
            return null; 
        }
        return organizations as Organization[];
    } catch (error) {
        console.error("Unexpected error in getAllOrganizations:", error);
        return null;
    }
}

export async function getOrganizationByInviteCode(inviteCode: string): Promise<Organization | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: organization, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("invite_code", inviteCode)
            .eq("is_deleted", false)
            .single();
        if (error) {
            console.error("Error fetching organization by invite code:", error);
            return null; 
        }
        return organization as Organization;
    } catch (error) {
        console.error("Unexpected error in getOrganizationByInviteCode:", error);
        return null;
    }
}

export async function getOrganizationMembers(orgId: string): Promise<OrganizationMember[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: members, error } = await supabase
            .from("organization_members")
            .select("*")
            .eq("organization_id", orgId).is("kicked_at", null).order("joined_at", { ascending: true });
        if (error) {
            console.error("Error fetching organization members:", error);
            return null; 
        }
        return members as OrganizationMember[];
    } catch (error) {
        console.error("Unexpected error in getOrganizationMembers:", error);
        return null;
    }
}

// ------------------------------------------
// SUPERADMIN DASHBOARD QUERIES
// ------------------------------------------

export async function getOrganizationsByApprovalStatus(status: ApprovalStatus): Promise<Organization[] | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: organizations, error } = await supabase
            .from("organizations")
            .select("*")
            .eq("approval_status", status)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching organizations by approval status:", error);
            return null; 
        }
        return organizations as Organization[];
    } catch (error) {
        console.error("Unexpected error in getOrganizationsByApprovalStatus:", error);
        return null;
    }
}