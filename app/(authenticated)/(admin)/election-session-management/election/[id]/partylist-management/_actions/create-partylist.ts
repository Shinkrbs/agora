"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { uploadFile } from "@/lib/utils/upload-file";

export async function createPartylist(formData: FormData): Promise<{ success: boolean; error: string | null; partylistId?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);

    const organizationId = formData.get("organization_id") as string;
    const electionId = formData.get("election_id") as string;
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const logoFile = formData.get("logo") as File | null;

    if (!organizationId || !electionId || !name) {
      return { success: false, error: "Organization ID, Election ID, and name are required" };
    }

    let logoUrl = "";

    // Upload logo if provided
    if (logoFile && logoFile.size > 0) {
      const folderPath = `${organizationId}/${electionId}`;
      const uploadResult = await uploadFile(supabase, "elections", logoFile, folderPath);
      if (uploadResult.error) {
        return { success: false, error: "Failed to upload logo" };
      }
      logoUrl = uploadResult.url || "";
    }

    // Generate shorthand name from first letters of words
    const shorthandName = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 5);

    // Insert new partylist
    const { data, error: insertError } = await supabase
      .from("partylists")
      .insert({
        election_id: electionId,
        name,
        description: description || "",
        logo_url: logoUrl,
        shorthand_name: shorthandName,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating partylist:", insertError);
      return { success: false, error: "Failed to create partylist" };
    }

    return { success: true, error: null, partylistId: data.id };
  } catch (error) {
    console.error("Error in createPartylist:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
