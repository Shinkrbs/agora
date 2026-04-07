"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createElectionAction } from "../_actions/create-election";
import { useCurrentOrganization } from "../../_components/OrganizationContext";

export function CreateElectionDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createElectionAction, null);
  const organization = useCurrentOrganization();  

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (state) {
      if (state.message) {
        toast.success(state.message);
        handleOpenChange(false);
      }
      if (state.error) {
        toast.error(state.error);
      }
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Election
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground mb-4">
          Start by giving your election a title. You&apos;ll be able to add positions, candidates, and
          more after creation.
        </p>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Election Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Student Government Elections 2024"
              type="text"
              disabled={isPending}
              required
            />
          </div>

          <div>
            <input type="hidden" name="organization_id" value={organization?.id || ""} />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Election"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
