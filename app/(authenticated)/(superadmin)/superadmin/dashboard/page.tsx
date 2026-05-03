import { KPICards } from "../../_components/KPICards";
import { SystemHealth } from "../../_components/SystemHealth";
import { UserManagementTabs } from "../../_components/UserMangement";

export default function SuperAdminDashboard() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard overview
        </h1>
        <p className="text-muted-foreground">
          Monitor system metrics, health status, and user activities.
        </p>
      </div>

      {/* KPI Section */}
      <KPICards />

      {/* Main Grid for Health and Management */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <UserManagementTabs />
        </div>
        <div className="col-span-3">
          <SystemHealth />
        </div>
      </div>
    </div>
  );
}
