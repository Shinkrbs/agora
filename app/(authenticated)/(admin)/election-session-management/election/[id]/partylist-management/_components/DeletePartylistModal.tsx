"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { deletePartylist } from "../_actions/delete-partylist-action";
import { PartylistWithCandidateCount } from "../_types/partylist-types";

interface DeletePartylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partylist: PartylistWithCandidateCount | null;
  onSuccess: () => void;
}

export function DeletePartylistModal({
  open,
  onOpenChange,
  partylist,
  onSuccess,
}: DeletePartylistModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!partylist) return;

    setIsLoading(true);
    try {
      const result = await deletePartylist(partylist.id);

      if (result.success) {
        toast.success(`Partylist "${partylist.name}" deleted successfully!`);
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to delete partylist");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Partylist</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {partylist?.name}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
