"use client";

import { Card } from "@/components/ui/card";
import { Hourglass } from "lucide-react";

export function OngoingElectionFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="mb-6 flex justify-center">
          <Hourglass className="w-16 h-16 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Official Results Sealed
        </h2>
        <p className="text-gray-600 leading-relaxed">
          The election is currently ongoing or has not yet started. Reports will
          be generated and available for download immediately after the polls
          close.
        </p>
      </Card>
    </div>
  );
}
