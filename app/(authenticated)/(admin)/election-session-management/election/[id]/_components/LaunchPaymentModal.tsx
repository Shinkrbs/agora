"use client";

import { useState } from "react";
import Image from "next/image";
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
import { AGORA_PRICING } from "@/lib/constants";
import { Upload } from "lucide-react";
import { payElectionSessionAction } from "../_actions/pay-election-session";
import { toast } from "sonner";
import { ElectionPaymentType } from "../_types/election-payment-type";

interface LaunchPaymentModalProps {
  electionId: string;
  organizationId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LaunchPaymentModal({
  electionId,
  organizationId,
  isOpen,
  onOpenChange,
  onSuccess,
}: LaunchPaymentModalProps) {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!receipt) {
      toast.error("Please upload a receipt");
      return;
    }

    setIsSubmitting(true);
    try {
      const paymentData: ElectionPaymentType = {
        organization_id: organizationId,
        user_id: null, // Will be set by the server action
        election_id: electionId,
        amount: AGORA_PRICING.ELECTION_SESSION_FEE,
        receipt_url: "", // Will be set by the server action
        status: "pending",
      };

      const result = await payElectionSessionAction(paymentData, receipt);

      if (result.success) {
        toast.success(result.message);
        setReceipt(null);
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125 max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Launch Election & Complete Payment</DialogTitle>
          <DialogDescription>
            Review the payment details and upload your receipt to proceed with
            launching your election.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1">
          {/* Fee Summary */}
          <div className="space-y-2 border-b pb-4">
            <h3 className="font-semibold text-foreground">Fee Summary</h3>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Election Fee</span>
                <span className="font-medium">₱{AGORA_PRICING.ELECTION_SESSION_FEE}.00</span>
              </div>
              {/*<div className="flex justify-between">
                <span className="text-muted-foreground">Voter Management</span>
                <span className="font-medium">₱500.00</span>
              </div>*/}
              <div className="flex justify-between border-t pt-1.5">
                <span className="font-semibold">Total Amount Due</span>
                <span className="font-bold text-lg">₱{AGORA_PRICING.ELECTION_SESSION_FEE}.00</span>
              </div>
            </div>
          </div>

          {/* GCash QR Code Placeholder */}
          <div className="space-y-3">
            <Label>GCash QR Code</Label>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-gradient-to-br from-muted to-muted/50 p-6">
              <Image 
                src="/gcash.jpg" 
                alt="GCash QR Code" 
                width={160} 
                height={160}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Receipt Upload */}
          <div className="space-y-2">
            <Label htmlFor="receipt-upload">Upload Payment Receipt</Label>
            <label
              htmlFor="receipt-upload"
              className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary hover:bg-muted/50"
              } ${receipt ? "bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-700" : "bg-muted/30"}`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) setReceipt(file);
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <Upload className={`w-6 h-6 ${receipt ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`} />
                {receipt ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{receipt.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(receipt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, or GIF (max. 10MB)
                    </p>
                  </div>
                )}
              </div>
            </label>
            <Input
              id="receipt-upload"
              type="file"
              accept="image/*"
              onChange={(e) => setReceipt(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!receipt || isSubmitting}>
            {isSubmitting ? "Processing..." : "Submit Payment & Launch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
