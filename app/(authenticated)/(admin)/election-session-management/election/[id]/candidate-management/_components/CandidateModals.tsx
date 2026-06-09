"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCandidateAction,
  editCandidateAction,
  deleteCandidateAction,
} from "../_actions/candidate-actions";
import {
  CandidateTableRow,
  CandidateFormData,
  CandidatePlatform,
} from "../_types/candidate-types";

interface Position {
  id: string;
  name: string;
}

interface Partylist {
  id: string;
  name: string;
  shorthand_name: string;
}

interface AddEditCandidateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateTableRow | null;
  positions: Position[];
  partylists: Partylist[];
  electionId: string;
  onSuccess: () => void;
}

export function AddEditCandidateModal({
  open,
  onOpenChange,
  candidate,
  positions,
  partylists,
  electionId,
  onSuccess,
}: AddEditCandidateModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CandidateFormData>({
    first_name: "",
    last_name: "",
    middle_name: null,
    suffix: null,
    position_id: "",
    partylist_id: null,
    vision: "",
    key_projects: [],
  });

  // Initialize form when modal opens or candidate changes
  useEffect(() => {
    if (candidate && open) {
      const platformData = (candidate.raw_candidate
        .platform as CandidatePlatform | null) || {
        vision: "",
        key_projects: [],
      };
      setFormData({
        first_name: candidate.raw_candidate.first_name,
        last_name: candidate.raw_candidate.last_name,
        middle_name: candidate.raw_candidate.middle_name,
        suffix: candidate.raw_candidate.suffix,
        position_id: candidate.raw_candidate.position_id,
        partylist_id: candidate.raw_candidate.partylist_id,
        vision: platformData.vision || "",
        key_projects: platformData.key_projects || [],
      });
    } else if (!candidate && open) {
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: null,
        suffix: null,
        position_id: "",
        partylist_id: null,
        vision: "",
        key_projects: [],
      });
    }
  }, [open, candidate]);

  const handleSubmit = async () => {
    if (!formData.first_name.trim() || !formData.last_name.trim()) {
      toast.error("First name and last name are required");
      return;
    }

    if (!formData.position_id) {
      toast.error("Position is required");
      return;
    }

    setIsLoading(true);
    try {
      let result;

      if (candidate) {
        result = await editCandidateAction({
          candidate_id: candidate.id,
          ...formData,
        });

        if (result.success) {
          toast.success("Candidate updated successfully!");
        } else {
          toast.error(result.error || "Failed to update candidate");
        }
      } else {
        result = await createCandidateAction({
          election_id: electionId,
          ...formData,
        });

        if (result.success) {
          toast.success("Candidate created successfully!");
        } else {
          toast.error(result.error || "Failed to create candidate");
        }
      }

      if (result.success) {
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {candidate ? "Edit Candidate" : "Add Candidate"}
          </DialogTitle>
          <DialogDescription>
            {candidate
              ? "Update the candidate details"
              : "Create a new candidate"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first-name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="First name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last-name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Last name"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="middle-name">Middle Name</Label>
              <Input
                id="middle-name"
                value={formData.middle_name || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    middle_name: e.target.value || null,
                  })
                }
                placeholder="Middle name (optional)"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="suffix">Suffix</Label>
              <Input
                id="suffix"
                value={formData.suffix || ""}
                onChange={(e) =>
                  setFormData({ ...formData, suffix: e.target.value || null })
                }
                placeholder="Suffix (optional)"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">
              Position <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.position_id}
              onValueChange={(value) =>
                setFormData({ ...formData, position_id: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="position">
                <SelectValue placeholder="Select a position" />
              </SelectTrigger>
              <SelectContent>
                {positions.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="partylist">Partylist</Label>
            <Select
              value={formData.partylist_id || "independent"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  partylist_id: value === "independent" ? null : value,
                })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="partylist">
                <SelectValue placeholder="Select a partylist or independent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">
                  Independent / No Party
                </SelectItem>
                {partylists.map((partylist) => (
                  <SelectItem key={partylist.id} value={partylist.id}>
                    {partylist.shorthand_name} ({partylist.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vision">Vision Statement</Label>
            <textarea
              id="vision"
              value={formData.vision}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  vision: e.target.value,
                })
              }
              placeholder="Enter the candidate's vision (optional)"
              disabled={isLoading}
              className="w-full min-h-20 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Key Projects</Label>
            <div className="space-y-2">
              {formData.key_projects.map((project, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={project}
                    onChange={(e) => {
                      const updated = [...formData.key_projects];
                      updated[index] = e.target.value;
                      setFormData({ ...formData, key_projects: updated });
                    }}
                    placeholder={`Project ${index + 1}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const updated = formData.key_projects.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, key_projects: updated });
                    }}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setFormData({
                    ...formData,
                    key_projects: [...formData.key_projects, ""],
                  });
                }}
                disabled={isLoading}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: CandidateTableRow | null;
  onSuccess: () => void;
}

export function DeleteCandidateDialog({
  open,
  onOpenChange,
  candidate,
  onSuccess,
}: DeleteCandidateDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!candidate) return;

    setIsLoading(true);
    try {
      const result = await deleteCandidateAction(candidate.id);

      if (result.success) {
        toast.success(
          `Candidate "${candidate.full_name}" deleted successfully!`,
        );
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to delete candidate");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {candidate?.full_name}
            </span>
            ? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
