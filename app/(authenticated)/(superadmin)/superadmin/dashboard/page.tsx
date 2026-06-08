import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Card } from "@/components/ui/card";
import {
  getPendingPayments,
  getGlobalStats,
  getRecentActivity,
} from "./_queries/get-superadmin-data";
import {
  StatsGrid,
  PendingPaymentsTab,
  RecentActivityTab,
} from "./_components";
import { AlertCircle } from "lucide-react";

async function getCurrentUserRole() {
  try {
    const supabase = await createClient(await cookies());
    const { data } = await supabase.auth.getClaims();

    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", data?.claims.sub)
      .single();

    return user?.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

export default async function SuperadminDashboard() {
  // Phase 2: Server-side role check
  const userRole = await getCurrentUserRole();

  if (userRole !== "superadmin") {
    return (
      <div className="min-h-screen bg-background p-6 text-foreground">
        <div className="max-w-md mx-auto mt-20">
          <Card className="border-destructive/20 bg-card p-8 text-center shadow-sm">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
            <h1 className="mb-2 text-2xl font-bold text-foreground">
              Access Denied
            </h1>
            <p className="text-muted-foreground">
              You do not have permission to access the Superadmin Dashboard.
              This page is restricted to superadmin users only.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch all required data in parallel
  const [pendingPayments, globalStats, recentActivity] = await Promise.all([
    getPendingPayments(),
    getGlobalStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="min-h-screen bg-background p-6 text-foreground">
      <div className="max-w-7xl mx-auto">
        {/* Phase 2: Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-foreground">
            Superadmin Console
          </h1>
          <p className="text-lg text-muted-foreground">
            System Overview &amp; Management Center
          </p>
        </div>

        {/* Phase 2: Stats Grid */}
        <StatsGrid stats={globalStats} />

        {/* Phase 3: Pending Payments Overview */}
        <Card className="mb-8 overflow-hidden border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <h2 className="text-xl font-semibold text-foreground">
              Pending Payments ({pendingPayments.length})
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Awaiting verification and approval
            </p>
          </div>
          <div className="p-6">
            <PendingPaymentsTab payments={pendingPayments} />
          </div>
        </Card>

        {/* Phase 4: Historical Ledger */}
        <Card className="overflow-hidden border border-border bg-card">
          <div className="border-b border-border bg-muted/50 px-6 py-4">
            <h2 className="text-xl font-semibold text-foreground">
              Recent Activity &amp; Audit Log
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Last 10 processed transactions
            </p>
          </div>

          <div className="p-6">
            <RecentActivityTab activities={recentActivity} />
          </div>
        </Card>
      </div>
    </div>
  );
}
