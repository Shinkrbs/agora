"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

interface EditPartylistData {
  partylistId: string;
  name: string;
  description: string;
  addedMemberIds: string[];
  removedMemberIds: string[];
}

export async function editPartylist(data: EditPartylistData): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Update partylist name and description
    const { error: partylistError } = await supabase
      .from("partylists")
      .update({
        name: data.name,
        description: data.description,
      })
      .eq("id", data.partylistId);

    if (partylistError) {
      throw new Error("Failed to update partylist");
    }

    // Handle member updates in parallel
    const memberUpdatePromises = [];

    // Add members to partylist
    if (data.addedMemberIds.length > 0) {
      memberUpdatePromises.push(
        supabase
          .from("candidates")
          .update({ partylist_id: data.partylistId })
          .in("id", data.addedMemberIds)
      );
    }

    // Remove members from partylist
    if (data.removedMemberIds.length > 0) {
      memberUpdatePromises.push(
        supabase
          .from("candidates")
          .update({ partylist_id: null })
          .in("id", data.removedMemberIds)
      );
    }

    // Execute all member updates in parallel
    const results = await Promise.all(memberUpdatePromises);

    // Check for errors in member updates
    for (const result of results) {
      if (result.error) {
        throw new Error("Failed to update candidate memberships");
      }
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error editing partylist:", error);
    return { success: false, error: "Failed to edit partylist" };
  }
}
