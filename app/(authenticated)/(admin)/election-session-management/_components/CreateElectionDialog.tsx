"use client";

import { useState, useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"; // Add shadcn select imports
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createElectionAction } from "../_actions/create-election";
import { useCurrentOrganization } from "../../_components/OrganizationContext";
import { fetchPositionTemplatesAction } from "../../position-templates/_actions/fetch-position-templates-action" // Adjust path as needed
import { PositionTemplate } from "@/types/database";

export function CreateElectionDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createElectionAction, null);
  const organization = useCurrentOrganization();

  // New State for templates
  const [templates, setTemplates] = useState<PositionTemplate[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedTemplateId("");
    }
  };

  useEffect(() => {
    async function loadTemplates() {
      if (open && organization?.id) {
        setIsLoadingTemplates(true);
        const { data, error } = await fetchPositionTemplatesAction(organization.id);

        if (error) {
          toast.error("Failed to load position templates");
        } else if (data) {
          setTemplates(data);
        }
        setIsLoadingTemplates(false);
      }
    }

    loadTemplates();
  }, [open, organization?.id]);

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
    <div suppressHydrationWarning>
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
            Start by giving your election a title. You&apos;ll be able to add candidates
            and more after creation.
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

            <div className="space-y-2">
              <Label htmlFor="template">Position Template</Label>
              <Select
                value={selectedTemplateId}
                onValueChange={setSelectedTemplateId}
                disabled={isPending || isLoadingTemplates || templates.length === 0}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    isLoadingTemplates
                      ? "Loading templates..."
                      : templates.length === 0
                        ? "No templates found"
                        : "Select a position template"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.positions.length} positions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="position_template_id"
                value={selectedTemplateId}
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
              <Button type="submit" disabled={isPending || !selectedTemplateId}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Election"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}