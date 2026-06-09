"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { VoterTableRow } from "../_types/voter-types";
import { deleteVoter } from "../_actions/voter-actions";
import { toast } from "sonner";

interface DeleteVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: VoterTableRow | null;
  onSuccess?: () => void;
}

export function DeleteVoterModal({
  isOpen,
  onClose,
  voter,
  onSuccess,
}: DeleteVoterModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!voter) {
    return null;
  }

  const isVoted = voter.code_status === "VOTED";

  const handleDelete = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const result = await deleteVoter(voter.id, voter.election_id);

      if (!result.success) {
        setError(result.error || "Failed to delete voter");
        toast.error(result.error || "Failed to delete voter");
        return;
      }
      toast.success("Voter deleted successfully");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error deleting voter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Voter</AlertDialogTitle>
          <AlertDialogDescription>
            {isVoted ? (
              <div>
                Cannot delete voter <span className="font-semibold">{voter.student_id}</span> ({voter.email}). This voter has already voted and cannot be removed.
              </div>
            ) : (
              <div>
                Are you sure you want to delete the voter <span className="font-semibold">{voter.student_id}</span> ({voter.email})? This action cannot be undone.
              </div>
            )}
            {error && (
              <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-2">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {isVoted ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {!isVoted && (
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
