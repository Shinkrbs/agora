"use client";

import { useActionState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { editElectionDetailsAction } from "../_actions/edit-election-details";
import { UniversalElectionHeaderProps } from "./UniversalElectionHeader";
import { useRouter } from "next/navigation";

interface EditDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  election: UniversalElectionHeaderProps;
}

type ActionState = {
  error?: string;
  message?: string;
} | null;

export function EditDetailsModal({
  isOpen,
  onOpenChange,
  election,
}: EditDetailsModalProps) {
  const updateAction = editElectionDetailsAction.bind(null, election.electionId);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateAction,
    null
  );
  const errorMessage = state?.error || null;
  const message = state?.message || null;
  const router = useRouter();

  useEffect(() => {
    router.refresh();
    if (state?.message) {
      const timer = setTimeout(() => {
        onOpenChange(false);
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [state?.message, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-125">
          <form action={formAction}>
            <DialogHeader>
              <DialogTitle>Edit Election Details</DialogTitle>
              <DialogDescription>
                Update the election title and dates. Changes will be saved to your
                account.
              </DialogDescription>
            </DialogHeader>
              
            <div className="space-y-4 py-4">
              {/* Election Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Election Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={election.title || ""}
                  placeholder="Enter election title"
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  name="start-date"
                  type="date"
                  defaultValue={
                    election.startDate
                      ? new Date(election.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  name="end-date"
                  type="date"
                  defaultValue={
                    election.endDate
                      ? new Date(election.endDate).toISOString().split("T")[0]
                      : ""
                  }
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="font-medium">Error</p>
                <p className="text-xs mt-1">{errorMessage}</p>
              </div>
            )}
            {message && (
              <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="font-medium">Success</p>
                <p className="text-xs mt-1">{message}</p>
              </div>
            )}

            <DialogFooter className="py-3">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Change"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
    </Dialog>
  );
}