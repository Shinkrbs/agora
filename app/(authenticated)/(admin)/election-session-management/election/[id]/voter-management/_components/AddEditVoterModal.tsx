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

interface AddEditVoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter?: VoterTableRow | null;
}

export function AddEditVoterModal({
  isOpen,
  onClose,
  voter,
}: AddEditVoterModalProps) {
  const [formData, setFormData] = useState({
    student_id: "",
    email: "",
  });

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
  }, [voter, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Placeholder for save action
    console.log("Saving voter:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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
          <div className="grid gap-2">
            <Label htmlFor="student_id">Student ID</Label>
            <Input
              id="student_id"
              name="student_id"
              placeholder="e.g., STU001"
              value={formData.student_id}
              onChange={handleInputChange}
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
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {isEditMode ? "Update Voter" : "Add Voter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
