"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { uploadFile } from "@/lib/utils/upload-file";

interface EditPartylistData {
  partylistId: string;
  organizationId: string;
  electionId: string;
  name: string;
  description: string;
  addedMemberIds: string[];
  removedMemberIds: string[];
  logoFile?: File | null;
}

export async function editPartylist(data: EditPartylistData): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    // Handle logo upload if a new logo file is provided
    let updateData: any = {
      name: data.name,
      description: data.description,
    };

    if (data.logoFile && data.logoFile.size > 0) {
      const folderPath = `${data.organizationId}/${data.electionId}`;
      const uploadResult = await uploadFile(supabase, "elections", data.logoFile, folderPath);
      if (uploadResult.error) {
        throw new Error("Failed to upload logo");
      }
      updateData.logo_url = uploadResult.url;
    }

    // Update partylist name, description, and logo (if provided)
    const { error: partylistError } = await supabase
      .from("partylists")
      .update(updateData)
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
