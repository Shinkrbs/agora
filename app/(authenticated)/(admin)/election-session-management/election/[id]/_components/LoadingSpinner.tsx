"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  isVisible: boolean;
}

export function LoadingSpinner({ isVisible }: LoadingSpinnerProps) {
  if (!isVisible) return null;

  return (
    <div className="flex min-h-100 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading...</p>
      </div>
    </div>
  );
}
