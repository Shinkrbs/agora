"use server";

import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type {
  EditableFieldsByRole,
  ProfileActionState,
} from "@/types/profile-types";
import type { UserRole } from "@/types/database";

const editableByRole: EditableFieldsByRole = {
  admin: [
    "avatar_url",
    "username",
    "first_name",
    "last_name",
    "middle_name",
    "suffix",
    "email",
  ],
  superadmin: [
    "avatar_url",
    "username",
    "first_name",
    "last_name",
    "middle_name",
    "suffix",
    "email",
  ],
};

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const avatar_url = String(formData.get("avatar_url") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim();
  const first_name = String(formData.get("first_name") ?? "").trim();
  const last_name = String(formData.get("last_name") ?? "").trim();
  const middle_nameRaw = String(formData.get("middle_name") ?? "").trim();
  const suffixRaw = String(formData.get("suffix") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  const middle_name = middle_nameRaw.length ? middle_nameRaw : null;
  const suffix = suffixRaw.length ? suffixRaw : null;

  const fieldErrors: ProfileActionState["fieldErrors"] = {};
  if (!username) fieldErrors.username = ["Username is required."];
  if (!first_name) fieldErrors.first_name = ["First name is required."];
  if (!last_name) fieldErrors.last_name = ["Last name is required."];
  if (!email || !email.includes("@"))
    fieldErrors.email = ["Valid email is required."];
  if (avatar_url && !/^https?:\/\//i.test(avatar_url)) {
    fieldErrors.avatar_url = ["Avatar URL must start with http or https."];
  }

  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient(await cookies());

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) return { error: "Not authenticated." };

  const userId = authData.user.id;

  const { data: currentUser, error: currentUserError } = await supabase
    .from("users")
    .select("role, email")
    .eq("id", userId)
    .single();

  if (currentUserError || !currentUser)
    return { error: "Unable to load current user." };

  const role = currentUser.role as UserRole;
  const allowed = new Set(editableByRole[role]);

  const usersUpdatePayload: Record<string, string | null> = {};
  if (allowed.has("avatar_url") && avatar_url.length > 0)
    usersUpdatePayload.avatar_url = avatar_url;
  if (allowed.has("username")) usersUpdatePayload.username = username;
  if (allowed.has("first_name")) usersUpdatePayload.first_name = first_name;
  if (allowed.has("last_name")) usersUpdatePayload.last_name = last_name;
  if (allowed.has("middle_name")) usersUpdatePayload.middle_name = middle_name;
  if (allowed.has("suffix")) usersUpdatePayload.suffix = suffix;
  if (allowed.has("email")) usersUpdatePayload.email = email;

  const { error: updateUsersError } = await supabase
    .from("users")
    .update(usersUpdatePayload)
    .eq("id", userId);

  if (updateUsersError) return { error: updateUsersError.message };

  if (allowed.has("email") && email !== currentUser.email) {
    const { error: updateAuthEmailError } = await supabase.auth.updateUser({
      email,
    });
    if (updateAuthEmailError) return { error: updateAuthEmailError.message };
  }

  return { success: "Profile updated successfully." };
}

export async function changePasswordAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const fieldErrors: ProfileActionState["fieldErrors"] = {};
  if (newPassword.length < 8)
    fieldErrors.newPassword = ["Password must be at least 8 characters."];
  if (newPassword !== confirmPassword)
    fieldErrors.confirmPassword = ["Passwords do not match."];

  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    return { error: "Please fix password fields.", fieldErrors };
  }

  const supabase = await createClient(await cookies());
  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) return { error: error.message };

  return { success: "Password updated successfully." };
}
