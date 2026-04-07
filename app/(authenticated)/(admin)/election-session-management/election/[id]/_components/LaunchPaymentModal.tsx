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

interface LaunchPaymentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LaunchPaymentModal({
  isOpen,
  onOpenChange,
}: LaunchPaymentModalProps) {
  const [receipt, setReceipt] = useState<File | null>(null);

  const handleSubmit = () => {
    // Handle payment submission logic here (to be implemented by parent)
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Launch Election & Complete Payment</DialogTitle>
          <DialogDescription>
            Review the payment details and upload your receipt to proceed with
            launching your election.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Fee Summary */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="font-semibold text-foreground">Fee Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base Election Fee</span>
                <span className="font-medium">₱2,500.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Voter Management</span>
                <span className="font-medium">₱500.00</span>
              </div>
              <div className="flex justify-between border-t pt-1.5">
                <span className="font-semibold">Total Amount Due</span>
                <span className="font-bold text-lg">₱3,000.00</span>
              </div>
            </div>
          </div>

          {/* GCash QR Code Placeholder */}
          <div className="space-y-3">
            <Label>GCash QR Code</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted p-8">
              <div className="text-center">
                <div className="mx-auto h-40 w-40 rounded bg-muted-foreground/10 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    QR Code Placeholder
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt-upload">Upload Payment Receipt</Label>
            <Input
              id="receipt-upload"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setReceipt(e.target.files?.[0] || null)}
            />
            {receipt && (
              <p className="text-xs text-muted-foreground">
                Selected: {receipt.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!receipt}>
            Submit Payment & Launch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
