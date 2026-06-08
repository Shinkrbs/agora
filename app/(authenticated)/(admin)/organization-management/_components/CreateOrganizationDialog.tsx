"use client";

import { useState, useActionState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";
import { CreateOrganizationStage1 } from "./CreateOrganizationStage1";
import { CreateOrganizationStage2 } from "./CreateOrganizationStage2";
import { CreateOrganizationStage3 } from "./CreateOrganizationStage3";
import { submitForm } from "../_actions/create-organization";
import { toast } from "sonner";

interface CreateOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState = { message: "", success: false };

export function CreateOrganizationDialog({
  isOpen,
  onClose,
}: CreateOrganizationDialogProps) {
  if (!isOpen) return null;
  return <CreateOrganizationDialogContent onClose={onClose} />;
}

interface CreateOrganizationDialogContentProps {
  onClose: () => void;
}

function CreateOrganizationDialogContent({
  onClose,
}: CreateOrganizationDialogContentProps) {
  const [stage, setStage] = useState(1);
  const [state, formAction, isPending] = useActionState(submitForm, initialState);
  const [uiState, setUiState] = useState({
    name: "",
    shorthandName: "",
    logoFile: null as File | null,
    receiptFile: null as File | null,
  });

  const handleNextStage = () => setStage((prev) => Math.min(prev + 1, 3));
  const handlePreviousStage = () => setStage((prev) => Math.max(prev - 1, 1));
  const handleClose = useCallback(() => {
    setStage(1);
    setUiState({ name: "", shorthandName: "", logoFile: null, receiptFile: null });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (state.success) {
      toast.success("Organization created successfully!");
      onClose();
    } else {
      toast.error(state.message || "Failed to create organization. Please try again.");
    }
  }, [state.success, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <form action={formAction}>
          <div className={stage === 1 ? "block" : "hidden"}>
            <CreateOrganizationStage1
              uiState={uiState}
              setUiState={setUiState}
              onNext={handleNextStage}
              errors={state.errors}
            />
          </div>
          <div className={stage === 2 ? "block" : "hidden"}>
            <CreateOrganizationStage2
              onNext={handleNextStage}
              onPrevious={handlePreviousStage}
            />
          </div>
          <div className={stage === 3 ? "block" : "hidden"}>
            <CreateOrganizationStage3
              uiState={uiState}
              setUiState={setUiState}
              onPrevious={handlePreviousStage}
              isPending={isPending}
              errors={state.errors}
            />
          </div>
          {state.message && !state.success && (
            <p className="text-red-500 text-sm mt-4 text-center">{state.message}</p>
          )}
        </form>
      </Card>
    </div>
  );
}

