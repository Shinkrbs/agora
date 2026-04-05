"use client";

import { Calendar } from "lucide-react";

export function ElectionsPaymentsTable() {
  return (
    <div className="rounded-lg border border-border border-dashed bg-muted/30 p-12 text-center">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-muted p-3">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Elections Payments
      </h3>
      <p className="text-muted-foreground">
        The elections payments table is coming soon. Check back for updates.
      </p>
    </div>
  );
}
