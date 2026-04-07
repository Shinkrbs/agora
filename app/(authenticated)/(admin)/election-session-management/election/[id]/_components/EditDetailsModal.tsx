"use client";

import React, { useState } from "react";
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

interface EditDetailsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDetailsModal({
  isOpen,
  onOpenChange,
}: EditDetailsModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSave = () => {
    // Handle save logic here (to be implemented by parent)
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
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
            <Label htmlFor="election-title">Election Title</Label>
            <Input
              id="election-title"
              placeholder="Enter election title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
