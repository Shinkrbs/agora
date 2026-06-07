"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { User, Organization } from "@/types/database";

export async function getCurrentUser(): Promise<User | null> {
    try {
        const supabase = await createClient(await cookies());

        const { data, error: claimsError } = await supabase.auth.getClaims();
        
        if (claimsError || !data?.claims?.sub) {
            return null; 
        }

        const { data: publicUser, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.claims.sub)
            .single();

        if (userError) {
            console.error("Error fetching user data:", userError);
            return null; 
        }

        return publicUser as User;

    } catch (error) {
        console.error("Unexpected error in getCurrentUser:", error);
        return null;
    }
}

export async function getAllUsers(): Promise<User[] | null> {
    try {
        const supabase = await createClient(await cookies());

        const { data: users, error } = await supabase
            .from("users")
            .select("*").eq("is_deleted", false);
        if (error) {
            console.error("Error fetching users:", error);
            return null;
        }
        return users as User[];
    } catch (error) {
        console.error("Unexpected error in getAllUsers:", error);
        return null;
    }
}

export async function getUserById(userId: string): Promise<User | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();
        if (error) {
            console.error("Error fetching user:", error);
            return null;
        }
        return user as User;
    } catch (error) {
        console.error("Unexpected error in getUserById:", error);
        return null;
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    try {
        const supabase = await createClient(await cookies());
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
        if (error) {
            console.error("Error fetching user by email:", error);
            return null;
        }
        return user as User;
    } catch (error) {
        console.error("Unexpected error in getUserByEmail:", error);
        return null;
    }
}

export async function getUserOrganizations(userId: string): Promise<Organization[] | null> {
    try {
        const supabase = await createClient(await cookies());

        const { data: orgs, error } = await supabase
            .from("organizations")
            .select("*, organization_members!inner(user_id)")
            .eq("organization_members.user_id", userId)
            .eq("is_deleted", false);
        if (error) {
            console.error("Error fetching user organizations:", error);
            return null;
        }
        return orgs as Organization[];
    } catch (error) {
        console.error("Unexpected error in getUserOrganizations:", error);
        return null;
    }
}

export async function getUserRole(): Promise<string> {
    const user = await getCurrentUser();
    return user?.role || "";
}

export async function isAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === "admin" || role === "superadmin";
}

export async function isSuperAdmin(): Promise<boolean> {
    const role = await getUserRole();
    return role === "superadmin";
}

export async function isLoggedIn(): Promise<boolean> {
    const user = await getCurrentUser();
    return !!user;
}