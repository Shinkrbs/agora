"use client";

import { useState, useActionState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload } from "lucide-react";
import Image from "next/image";
import { updateOrganization } from "../_actions/update-organization";

interface EditOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
  initialName: string;
  initialShorthand: string;
  initialLogoUrl?: string | null;
}

const initialState = { message: "", success: false };

export function EditOrganizationDialog({
  isOpen,
  onClose,
  organizationId,
  initialName,
  initialShorthand,
  initialLogoUrl,
}: EditOrganizationDialogProps) {
  const [state, formAction, isPending] = useActionState(updateOrganization, initialState);
  const [uiState, setUiState] = useState({
    name: initialName,
    shorthandName: initialShorthand,
    logoFile: null as File | null,
    logoPreview: initialLogoUrl || null,
  });

  const handleClose = () => {
    setUiState({
      name: initialName,
      shorthandName: initialShorthand,
      logoFile: null,
      logoPreview: initialLogoUrl || null,
    });
    onClose();
  };

  useEffect(() => {
    if (state.success) {
      handleClose();
    }
  }, [state.success]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUiState((prev) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUiState((p) => ({
            ...p,
            logoFile: file,
            logoPreview: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
        return prev;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Edit Organization
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Update your organization details
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="organizationId" value={organizationId} />

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name (Optional)</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter organization name..."
              value={uiState.name}
              onChange={(e) =>
                setUiState((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {state.errors?.name && (
              <p className="text-red-500 text-xs">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shorthandName">Shorthand Name (Optional)</Label>
            <Input
              id="shorthandName"
              name="shorthandName"
              placeholder="e.g., ACME"
              maxLength={10}
              value={uiState.shorthandName}
              onChange={(e) =>
                setUiState((prev) => ({ ...prev, shorthandName: e.target.value }))
              }
            />
            {state.errors?.shorthandName && (
              <p className="text-red-500 text-xs">{state.errors.shorthandName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Organization Logo (Optional)</Label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6">
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label htmlFor="logo" className="flex flex-col items-center justify-center cursor-pointer">
                {uiState.logoPreview && typeof uiState.logoPreview === "string" ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={uiState.logoPreview}
                        alt="Logo preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {uiState.logoFile ? uiState.logoFile.name : "Current logo"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Click to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
            {state.errors?.logo && (
              <p className="text-red-500 text-xs">{state.errors.logo[0]}</p>
            )}
          </div>

          {state.message && !state.success && (
            <p className="text-red-500 text-sm text-center">{state.message}</p>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1">
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
