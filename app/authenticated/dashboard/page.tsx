import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/LogoutButton";

export default async function Dashboard() {
  const supabase = await createClient(await cookies());
  const { data } = await supabase.auth.getUser();

  const { data: userData } = await supabase
    .from("users")
    .select("first_name")
    .eq("id", data.user?.id)
    .single();

  return (
    <div>
      <span>Hello {userData?.first_name}! This is dashboard.</span>
      <LogoutButton />
    </div>
  );
}
