"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { VoterTableRow } from "../_types/voter-types";
import { addVoter, editVoter } from "../_actions/voter-actions";
import { toast } from "sonner";

interface AddEditVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter?: VoterTableRow | null;
  electionId: string;
  onSuccess?: () => void;
  voterList: VoterTableRow[];
}

export function AddEditVoterModal({
  isOpen,
  onClose,
  voter,
  electionId,
  onSuccess,
  voterList,
}: AddEditVoterModalProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = !!voter;

  useEffect(() => {
    if (voter) {
      setFormData({
        student_id: voter.student_id,
        email: voter.email,
      });
    } else {
      setFormData({
        student_id: "",
        email: "",
      });
    }
    setError(null);
  }, [voter, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      setIsLoading(true);

      const incompleteFields = Object.entries(formData).filter(([_, value]) => !value.trim());
      if (incompleteFields.length > 0) {
        setError("Please fill in all required fields");
        toast.error("Please fill in all required fields");
        return;
      }

        // Check for duplicate student_id or email in the current voter list
      const isDuplicateStudentId = voterList.some(
        (v) =>
          v.student_id === formData.student_id &&
          (!isEditMode || v.id !== voter?.id) // Exclude current voter in edit mode
      );
      const isDuplicateEmail = voterList.some(
        (v) =>
          v.email === formData.email &&
          (!isEditMode || v.id !== voter?.id) // Exclude current voter in edit mode
      );

      if (isDuplicateStudentId) {
        setError("A voter with the same Student ID already exists");
        return;
      }

      if (isDuplicateEmail) {
        setError("A voter with the same Email already exists");
        return;
      }

      if (isEditMode) {
        if (!voter) {
          setError("Voter data is missing");
          return;
        }

        const result = await editVoter(
          voter.id,
          formData.student_id,
          formData.email,
          electionId
        );

        if (!result.success) {
          setError(result.error || "Failed to update voter");
          return;
        }

        onSuccess?.();
        onClose();
      } else {
        const result = await addVoter(
          electionId,
          formData.student_id,
          formData.email
        );

        if (!result.success) {
          setError(result.error || "Failed to add voter");
          toast.error(result.error || "Failed to add voter");
          return;
        }
        toast.success("Voter added successfully");
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error saving voter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Voter" : "Add New Voter"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the voter information below."
              : "Enter the voter details below."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              name="student_id"
              placeholder="e.g., STU001"
              value={formData.student_id}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="e.g., voter@example.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading
              ? "Saving..."
              : isEditMode
                ? "Update Voter"
                : "Add Voter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
