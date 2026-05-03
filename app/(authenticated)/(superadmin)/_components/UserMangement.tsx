"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const pendingApprovals = [
  {
    id: 1,
    name: "Engineering Student Council",
    type: "Organization",
    date: "Today",
  },
  { id: 2, name: "Debate Society", type: "Organization", date: "Yesterday" },
];

const recentActivities = [
  {
    id: 1,
    admin: "Moe Ester",
    action: "Approved 'Drama Club' registration",
    time: "2 hours ago",
  },
  {
    id: 2,
    admin: "System",
    action: "Automated backup completed",
    time: "5 hours ago",
  },
];

export function UserManagementTabs() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Access Management</CardTitle>
        <CardDescription>
          Handle approvals and monitor admin actions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApprovals.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.type} • Requested {item.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Decline
                  </Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{activity.admin.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="text-primary">{activity.admin}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
