"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import Image from "next/image";

interface ViewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
}

export function ViewOrganizationDialog({
  isOpen,
  onClose,
  name,
  shorthandName,
  logoUrl,
}: ViewOrganizationDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-8 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            View Members
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Here you can see the members of the organization.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm text-slate-500 dark:text-slate-400">
              Organization Name
            </Label>
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">
              {name || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-500 dark:text-slate-400">
              Shorthand Name
            </Label>
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">
              {shorthandName || "N/A"}
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-slate-500 dark:text-slate-400">
              Organization Logo
            </Label>
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 flex justify-center items-center bg-slate-50 dark:bg-slate-900/50">
              {logoUrl ? (
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                    <Image
                      src={logoUrl}
                      alt={`${name} logo`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 dark:text-slate-400 py-4">
                  <p className="text-sm font-medium">No logo provided</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button type="button" onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
