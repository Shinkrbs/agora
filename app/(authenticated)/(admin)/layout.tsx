import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { adminSidebarItems } from "@/types/sidebar-items";
import { getUserOrganizations } from "@/app/(authenticated)/(admin)/organization-management/_queries/organization-management-queries";
import { OrganizationProvider } from "./_components";
import { AdminHeaderClient } from "./_components/AdminHeaderClient";

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

  // Fetch user's organizations
  const { organizations } = await getUserOrganizations();

  const breadcrumbItems = adminSidebarItems.map(({ title, href }) => ({
    title,
    href,
  }));

  return (
    <OrganizationProvider initialOrganizations={organizations}>
      <SidebarProvider>
        <AppSidebar />
        <main className="min-h-svh flex-1">
          <AdminHeaderClient 
            organizations={organizations}
            breadcrumbItems={breadcrumbItems}
          />
          <section className="p-4 md:p-6">{children}</section>
        </main>
      </SidebarProvider>
    </OrganizationProvider>
  );
}
