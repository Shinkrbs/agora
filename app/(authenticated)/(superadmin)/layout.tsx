import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { superAdminSidebarItems } from "@/types/sidebar-items";
import { HeaderBreadcrumb } from "@/components/HeaderBreadcrumb";

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
      <AppSidebar />
      <main className="min-h-svh flex-1">
        <header className="border-b bg-background">
          <HeaderBreadcrumb sidebarItems={breadcrumbItems} />
        </header>
        <section className="p-4 md:p-6">{children}</section>
      </main>
    </SidebarProvider>
  );
}
