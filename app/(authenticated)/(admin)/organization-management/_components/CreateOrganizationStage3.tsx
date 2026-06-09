"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface CreateOrganizationStage3Props {
  uiState: any;
  setUiState: React.Dispatch<React.SetStateAction<any>>;
  onPrevious: () => void;
  isPending: boolean;
  errors?: Record<string, string[]>;
}

export function CreateOrganizationStage3({
  uiState,
  setUiState,
  onPrevious,
  isPending,
  errors,
}: CreateOrganizationStage3Props) {
  const isReceiptValid = uiState.receiptFile !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Submit Receipt
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Step 3 of 3 - Payment Verification
        </p>
      </div>

      <div className="flex gap-2">
        <div className="h-1 flex-1 bg-primary rounded-full"></div>
        <div className="h-1 flex-1 bg-primary rounded-full"></div>
        <div className="h-1 flex-1 bg-primary rounded-full"></div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Please upload a screenshot or image of your GCash payment receipt.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="receipt">Payment Receipt</Label>
        <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8">
          <input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setUiState((prev: any) => ({
                ...prev,
                receiptFile: e.target.files?.[0] || null,
              }))
            }
            className="hidden"
          />
          <label
            htmlFor="receipt"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            {uiState.receiptFile ? (
              <div className="text-center">
                <Upload className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {uiState.receiptFile.name}
                </p>
                <p className="text-xs text-slate-500 mt-1">Click to change</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  Click to upload receipt
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            )}
          </label>
        </div>
        {errors?.receipt && (
          <p className="text-red-500 text-xs">{errors.receipt[0]}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
          disabled={isPending}
          className="flex-1"
        >
          Previous
        </Button>
        <Button
          type="submit" // CRITICAL: This natively submits the form action
          disabled={!isReceiptValid || isPending}
          className="flex-1"
        >
          {isPending ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
