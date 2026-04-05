"use server";

import { createClient } from "@/lib/supabase/server";
import { EditOrganizationState, editOrganizationSchema } from "../_schema/edit-organization-schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { uploadFile } from "./create-organization";

export async function updateOrganization(
  prevState: EditOrganizationState,
  formData: FormData
): Promise<EditOrganizationState> {
  const rawData = {
    organizationId: formData.get("organizationId"),
    name: formData.get("name") || undefined,
    shorthandName: formData.get("shorthandName") || undefined,
    logo: formData.get("logo"),
  };

  const validatedFields = editOrganizationSchema.safeParse(rawData);

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

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("id", organizationId)
      .single();

    if (orgError || !org) {
      return { message: "Organization not found.", success: false };
    }

    const { data: member, error: memberError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("organization_id", organizationId)
      .eq("user_id", user.id)
      .single();

    if (memberError || !member || member.role !== "owner") {
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

    revalidatePath("/admin/organization-management");
    return { message: "Organization updated successfully.", success: true };
    
  } catch (error) {
    console.error("Update Organization Error:", error);
    return { message: "An unexpected error occurred.", success: false };
  }
}