import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  CheckCircle2,
  Globe,
  Activity,
  Timer,
} from "lucide-react";

const websiteErrorLogs = [
  {
    id: 1,
    type: "500 Internal Server Error - /api/auth",
    time: "5 mins ago",
    severity: "High",
  },
  {
    id: 2,
    type: "Uncaught TypeError in _app.js",
    time: "30 mins ago",
    severity: "Medium",
  },
  {
    id: 3,
    type: "404 Not Found - /assets/old-banner.png",
    time: "1 hour ago",
    severity: "Low",
  },
];

const websiteMetrics = [
  { id: 1, label: "Website Uptime", value: "99.99%", icon: Globe },
  { id: 2, label: "Avg Response Time", value: "124ms", icon: Timer },
  { id: 3, label: "Active Sessions", value: "1,432", icon: Activity },
];

export function SystemHealth() {
  return (
    <div className="flex flex-col h-full gap-4">
      <div>
        <h3 className="text-lg font-medium tracking-tight">
          System health and performance
        </h3>
        <p className="text-sm text-muted-foreground">
          Monitor live website status and recent application errors.
        </p>
      </div>

      {/* Website Status Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Website Status</CardTitle>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {websiteMetrics.map((metric) => (
              <div
                key={metric.id}
                className="flex flex-col gap-1 p-3 border rounded-lg bg-muted/20"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <metric.icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{metric.label}</span>
                </div>
                <p className="text-xl font-semibold">{metric.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Website Error Logs Section */}
      <Card className="flex flex-col flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Website Error Logs</CardTitle>
          <CardDescription>
            Recent frontend and backend application exceptions
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-[250px] pr-4">
            <div className="space-y-4">
              {websiteErrorLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-3 border rounded-lg bg-muted/50"
                >
                  <AlertCircle
                    className={`w-5 h-5 mt-0.5 ${
                      log.severity === "High"
                        ? "text-rose-500"
                        : log.severity === "Medium"
                          ? "text-amber-500"
                          : "text-blue-500"
                    }`}
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {log.type}
                    </p>
                    <p className="text-sm text-muted-foreground">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
