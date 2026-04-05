"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateOrganizationStage1Props {
  uiState: any;
  setUiState: React.Dispatch<React.SetStateAction<any>>;
  onNext: () => void;
  errors?: Record<string, string[]>;
}

export function CreateOrganizationStage1({
  uiState,
  setUiState,
  onNext,
  errors,
}: CreateOrganizationStage1Props) {
  const isFormValid =
    uiState.name.trim() && uiState.shorthandName.trim();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          Create Organization
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Step 1 of 3 - Basic Information
        </p>
      </div>

      <div className="flex gap-2">
        <div className="h-1 flex-1 bg-blue-500 rounded-full"></div>
        <div className="h-1 flex-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        <div className="h-1 flex-1 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter organization name..."
            value={uiState.name}
            onChange={(e) => setUiState((prev: any) => ({ ...prev, name: e.target.value }))}
          />
          {errors?.name && <p className="text-red-500 text-xs">{errors.name[0]}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="shorthandName">Shorthand Name</Label>
          <Input
            id="shorthandName"
            name="shorthandName"
            placeholder="e.g., ACME"
            value={uiState.shorthandName}
            onChange={(e) =>
              setUiState((prev: any) => ({ ...prev, shorthandName: e.target.value }))
            }
            maxLength={10}
          />
          {errors?.shorthandName && (
            <p className="text-red-500 text-xs">{errors.shorthandName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo">Organization Logo</Label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setUiState((prev: any) => ({ ...prev, logoFile: e.target.files?.[0] || null }))
              }
              className="hidden"
            />
            <label
              htmlFor="logo"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              {uiState.logoFile ? (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    {uiState.logoFile.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Click to change</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                    Click to upload logo
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </label>
          </div>
          {errors?.logo && <p className="text-red-500 text-xs">{errors.logo[0]}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" onClick={onNext} disabled={!isFormValid} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}