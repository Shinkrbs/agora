import React from "react";

export default function ElectionDashboardPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = React.use(params);
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Election ID: {id}
        </p>
        <p className="text-muted-foreground text-sm mt-4">
          Dashboard content coming soon...
        </p>
      </div>
    </div>
  );
}