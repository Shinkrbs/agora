import { LogoutButton } from "@/components/LogoutButton";
import { KPICards } from "../../_components/KPICards";
import { SystemHealth } from "../../_components/SystemHealth";
import { UserManagementTabs } from "../../_components/UserMangement";
export default function page() {
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
      <KPICards />
      <SystemHealth />
      <UserManagementTabs />
    </div>
  );
}
