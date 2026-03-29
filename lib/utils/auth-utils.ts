import { createClient } from "../supabase/server";
import { cookies } from "next/headers";

export async function getUserRole() {
  const supabase = await createClient(await cookies());

  const { data } = await supabase.auth.getClaims();

  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("id", data?.claims.sub)
    .single();

  return user?.role || "";
}
