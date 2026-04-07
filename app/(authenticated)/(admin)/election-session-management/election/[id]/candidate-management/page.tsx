import React from "react";

export default function CandidateManagementPage({
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
        <h2 className="text-xl font-semibold text-foreground mb-2">Candidate Management</h2>
        <p className="text-muted-foreground text-sm">
          Manage candidates for election ID: {id}
        </p>
        <p className="text-muted-foreground text-sm mt-4">
          Candidate management content coming soon...
        </p>
      </div>
    </div>
  );
}