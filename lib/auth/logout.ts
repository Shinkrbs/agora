import { createClient } from "@/lib/supabase/client";

export async function logoutUser() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}