import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Vote, TrendingUp, TrendingDown } from "lucide-react";

export function KPICards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Total Organizations
          </CardTitle>
          <Building2 className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,248</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="flex items-center text-primary font-medium mr-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">
            Election Sessions
          </CardTitle>
          <Vote className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">432</div>
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="flex items-center text-destructive font-medium mr-1">
              <TrendingDown className="w-3 h-3 mr-1" />
              -4%
            </span>
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
