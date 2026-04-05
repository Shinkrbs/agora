"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CreateOrganizationStage2Props {
  onNext: () => void;
  onPrevious: () => void;
}

export function CreateOrganizationStage2({
  onNext,
  onPrevious,
}: CreateOrganizationStage2Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Payment Method
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Step 2 of 3 - Complete Payment
        </p>
      </div>

      <div className="flex gap-2">
        <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
        <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
        <div className="h-1 flex-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>

      {/* Description and Image remain the same... */}
      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          To complete your organization setup, please send a payment of
          <span className="font-semibold"> ₱100</span> via GCash.
        </p>
      </div>

      <div className="flex justify-center">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
          <Image
            src="/gcash.jpg"
            alt="GCash QR Code"
            width={300}
            height={300}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        {/* CRITICAL: Explicit type="button" prevents accidental form submission */}
        <Button type="button" variant="outline" onClick={onPrevious} className="flex-1">
          Previous
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}