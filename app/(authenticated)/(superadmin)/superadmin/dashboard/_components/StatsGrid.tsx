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
    <div className="mb-6 grid grid-cols-1 gap-3 md:mb-8 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Card
            key={index}
            className="border-border bg-card p-4 transition-shadow hover:shadow-lg md:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-medium text-muted-foreground md:text-sm">
                  {item.label}
                </p>
                <p className="wrap-break-word text-2xl font-bold text-foreground md:text-3xl">
                  {item.value}
                </p>
              </div>
              <div
                className={`${item.bgColor} shrink-0 rounded-lg p-2.5 md:p-3`}
              >
                <Icon className={`h-5 w-5 md:h-6 md:w-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
