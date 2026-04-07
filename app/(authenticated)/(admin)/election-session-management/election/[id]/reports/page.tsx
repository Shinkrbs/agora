import React from "react";

export default function ReportsPage({
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
        <h2 className="text-xl font-semibold text-foreground mb-2">Reports</h2>
        <p className="text-muted-foreground text-sm">
          View reports for election ID: {id}
        </p>
        <p className="text-muted-foreground text-sm mt-4">
          Reports content coming soon...
        </p>
      </div>
    </div>
  );
}