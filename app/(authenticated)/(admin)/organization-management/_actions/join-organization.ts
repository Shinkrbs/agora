"use server";

import { createClient } from "@/lib/supabase/server";
import { JoinOrganizationState, joinOrganizationSchema } from "../_schema/join-organization-schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function joinOrganization(
  prevState: JoinOrganizationState,
  formData: FormData
): Promise<JoinOrganizationState> {
  const rawData = {
    inviteCode: formData.get("inviteCode"),
  };

  const validatedFields = joinOrganizationSchema.safeParse(rawData);

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

    const { inviteCode } = validatedFields.data;

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id, name, approval_status")
      .eq("invite_code", inviteCode)
      .single();

    if (orgError || !org) {
      return { message: "Invalid invite code. Organization not found.", success: false };
    }

    if (org.approval_status !== "approved") {
      return { 
        message: "This organization is not open for joining yet. Please wait until it's approved.", 
        success: false 
      };
    }

    const { data: existingMember } = await supabase
      .from("organization_members")
      .select("id")
      .eq("organization_id", org.id)
      .eq("user_id", user.id)
      .single();

    if (existingMember) {
      return { message: "You're already a member of this organization.", success: false };
    }

    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: org.id,
        user_id: user.id,
        role: "member",
      });

    if (memberError) {
      console.error("Member Insert Error:", memberError);
      return { message: "Failed to join organization.", success: false };
    }

    revalidatePath("/admin/organization-management");
    return { 
      message: `Successfully joined ${org.name}!`, 
      success: true 
    };
  } catch (error) {
    console.error("Join Organization Error:", error);
    return { message: "An unexpected error occurred.", success: false };
  }
}
