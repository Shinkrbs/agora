"use client";

import React from "react";
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

interface DeleteVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: VoterTableRow | null;
}

export function DeleteVoterModal({
  isOpen,
  onClose,
  voter,
}: DeleteVoterModalProps) {
  // Early return if voter is null to prevent crashes
  if (!voter) {
    return null;
  }

  const handleDelete = async () => {
    // Placeholder for delete action
    console.log("Deleting voter:", voter.id);
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Voter</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <span className="font-semibold">{voter.full_name}</span>? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
