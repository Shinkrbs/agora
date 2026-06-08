import { Card } from "@/components/ui/card";
import { GlobalStats } from "../_queries/get-superadmin-data";
import { Building2, Coins, TrendingUp, Briefcase } from "lucide-react";

interface StatsGridProps {
  stats: GlobalStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: "Pending Organizations",
      value: stats.pending_orgs_count,
      icon: Building2,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-950",
      badgeVariant: "secondary" as const,
    },
    {
      label: "Pending Payments",
      value: stats.pending_payments_count,
      icon: Coins,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      badgeVariant: "secondary" as const,
    },
    {
      label: "Approved Organizations",
      value: stats.approved_orgs_count,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
      badgeVariant: "secondary" as const,
    },
    {
      label: "Total Verified Revenue",
      value: `₱${stats.total_verified_revenue.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: Briefcase,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      badgeVariant: "secondary" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="border-border p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {item.value}
                </p>
              </div>
              <div className={`${item.bgColor} p-3 rounded-lg ml-2`}>
                <Icon className={`h-6 w-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
