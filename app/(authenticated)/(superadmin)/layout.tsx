import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { superAdminSidebarItems } from "@/types/sidebar-items";
import { SuperadminHeaderClient } from "./_components/SuperadminHeaderClient";

export default async function SuperadminLayout({
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

  if (user?.role !== "superadmin") redirect("/unauthorized");
  const breadcrumbItems = superAdminSidebarItems.map(({ title, href }) => ({
    title,
    href,
  }));
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <main className="min-h-svh min-w-0 flex-1 overflow-x-hidden">
        <SuperadminHeaderClient breadcrumbItems={breadcrumbItems} />
        <section className="min-w-0 overflow-x-hidden p-4 md:p-6">
          {children}
        </section>
      </main>
    </SidebarProvider>
  );
}
