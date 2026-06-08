"use client";

import { useCurrentOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./_components/ProfileTab";
import { TeamAccessTab } from "./_components/TeamAccessTab";

export default function SettingsPage() {
  const currentOrg = useCurrentOrganization();

  if (!currentOrg) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-muted-foreground">Please select an organization first.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Organization Settings</h2>
      </div>
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="team">Team & Access</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <ProfileTab organization={currentOrg} />
        </TabsContent>
        <TabsContent value="team" className="space-y-4">
          <TeamAccessTab organization={currentOrg} />
        </TabsContent>
      </Tabs>
    </div>
  );
}