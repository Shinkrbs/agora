import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { HeaderBreadcrumb } from "@/components/HeaderBreadcrumb";
import { adminSidebarItems } from "@/types/sidebar-items";

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
  const breadcrumbItems = adminSidebarItems.map(({ title, href }) => ({
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
