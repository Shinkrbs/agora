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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-md mx-auto mt-20">
          <Card className="p-8 text-center border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-900 dark:text-red-100 mb-2">
              Access Denied
            </h1>
            <p className="text-red-700 dark:text-red-300">
              You do not have permission to access the Superadmin Dashboard.
              This page is restricted to superadmin users only.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // Fetch all required data in parallel
  const [
    pendingPayments,
    globalStats,
    recentActivity,
  ] = await Promise.all([
    getPendingPayments(),
    getGlobalStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Phase 2: Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Superadmin Console
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            System Overview &amp; Management Center
          </p>
        </div>

        {/* Phase 2: Stats Grid */}
        <StatsGrid stats={globalStats} />

        {/* Phase 3: Pending Payments Overview */}
        <Card className="mb-8 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pending Payments ({pendingPayments.length})
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Awaiting verification and approval
            </p>
          </div>
          <div className="p-6">
            <PendingPaymentsTab payments={pendingPayments} />
          </div>
        </Card>

        {/* Phase 4: Historical Ledger */}
        <Card className="border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Activity &amp; Audit Log
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
