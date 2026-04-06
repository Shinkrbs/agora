import { ElectionCardSummary } from "../_types/election-card-type";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ElectionStatus, PaymentStatus } from "@/types/database";

interface ElectionCardProps {
  election: ElectionCardSummary;
}

export function ElectionCard({ election }: ElectionCardProps) {
  const getStatusColor = (status: ElectionStatus) => {
    const colors: Record<ElectionStatus, string> = {
      draft: "bg-muted text-muted-foreground",
      scheduled: "bg-secondary text-secondary-foreground",
      active: "bg-accent text-accent-foreground",
      completed: "bg-secondary text-secondary-foreground",
      cancelled: "bg-destructive/20 text-destructive",
      archived: "bg-muted text-muted-foreground",
    };
    return colors[status];
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    const colors: Record<PaymentStatus, string> = {
      pending: "bg-secondary text-secondary-foreground",
      verified: "bg-accent text-accent-foreground",
      rejected: "bg-destructive/20 text-destructive",
    };
    return colors[status];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="min-w-80 shrink-0 p-4  hover:shadow-lg transition-shadow">
      <div className="space-y-3">
        {/* Header with title and status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-sm leading-tight text-foreground flex-1">
            {election.title}
          </h3>
          <Badge className={`text-xs whitespace-nowrap ${getStatusColor(election.status)}`}>
            {election.status.charAt(0).toUpperCase() + election.status.slice(1)}
          </Badge>
        </div>

        {/* Dates */}
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span className="font-medium">Start:</span>
            <span>{formatDate(election.start_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">End:</span>
            <span>{formatDate(election.end_date)}</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-secondary rounded p-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-secondary-foreground">Positions:</span>
            <span className="font-medium">{election.metrics.positions_count}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-foreground">Turnout:</span>
            <span className="font-medium">
              {election.metrics.turnout_percentage !== null
                ? `${election.metrics.turnout_percentage}%`
                : "—"}
            </span>
          </div>
        </div>

        {/* Payment Status */}
        <div className="border-t border-border pt-2">
          <div className="text-xs text-muted-foreground mb-1">Payment Status</div>
          <Badge
            className={`text-xs w-full justify-center py-1 ${getPaymentStatusColor(
              election.payment_status
            )}`}
          >
            {election.payment_status.charAt(0).toUpperCase() +
              election.payment_status.slice(1)}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
