"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { uploadFile } from "@/app/(authenticated)/(admin)/organization-management/_actions/create-organization";
import { updateOrgProfileSchema, UpdateOrgProfileState } from "../_schema/update-org-profile-schema";

export async function updateOrgProfile(
  prevState: UpdateOrgProfileState,
  formData: FormData
): Promise<UpdateOrgProfileState> {
  const rawData = {
    organizationId: formData.get("organizationId"),
    name: formData.get("name") || undefined,
    shorthandName: formData.get("shorthandName") || undefined,
    logo: formData.get("logo"),
  };

  const validatedFields = updateOrgProfileSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      message: "Please check the form for errors.",
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    const supabase = await createClient(await cookies());

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { message: "Unauthorized. Please log in.", success: false };
    }

    const { organizationId, name, shorthandName, logo } = validatedFields.data;

    // Check member role (owner or admin can update profile? Let's say owner only or owner/admin. Let's stick to owner for critical updates or admin)
    // Wait, the rule says "Owner Powers: ...", usually editing profile is for owner or admin. Let's allow owner and admin.
    const { data: member, error: memberError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single();

    if (memberError || !member || (member.role !== "owner" && member.role !== "admin")) {
      return { message: "You don't have permission to edit this organization.", success: false };
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (shorthandName) updateData.shorthand_name = shorthandName;

    if (logo instanceof File && logo.size > 0) {
      const logoUpload = await uploadFile(supabase, "organizations", logo, organizationId);
      
      if (logoUpload.error) {
        return { message: "Failed to upload logo.", success: false };
      }
      updateData.logo_url = logoUpload.url;
    }

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabase
        .from("organizations")
        .update(updateData)
        .eq("id", organizationId);

      if (updateError) {
        console.error("Organization Update Error:", updateError);
        return { message: "Failed to update organization.", success: false };
      }
    }

    revalidatePath("/admin/settings");
    return { message: "Organization updated successfully.", success: true };
    
  } catch (error) {
    console.error("Update Organization Error:", error);
    return { message: "An unexpected error occurred.", success: false };
  }
}
