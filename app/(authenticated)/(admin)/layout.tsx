import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient(await cookies());
  const { data } = await supabase.auth.getClaims();

  const { data: user } = await supabase
    .from("users")
    .select()
    .eq("id", data?.claims.sub)
    .single();

  if (user?.role !== "admin") redirect("/unauthorized");
  return <>{children}</>;
}
