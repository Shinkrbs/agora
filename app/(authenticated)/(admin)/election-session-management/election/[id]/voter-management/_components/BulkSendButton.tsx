"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { VoterTableRow } from "../_types/voter-types";
import { sendBatchedVotingCodesAction } from "../_actions/voter-actions";

interface BulkSendModalProps {
  unsentVoters: VoterTableRow[];
}

const BATCH_SIZE = 25;

export function BulkSendModal({ unsentVoters }: BulkSendModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleBulkSend = async () => {
    if (unsentVoters.length === 0) {
      toast.error("No unsent voters to send codes to");
      return;
    }

    setIsSending(true);
    setProgress(0);

    try {
      let totalSent = 0;
      let totalFailed = 0;
      const allFailedIds: string[] = [];

      for (let i = 0; i < unsentVoters.length; i += BATCH_SIZE) {
        const batch = unsentVoters.slice(i, i + BATCH_SIZE);

        try {
          const result = await sendBatchedVotingCodesAction(batch);

          totalSent += result.sentCount;
          totalFailed += result.failedCount;
          allFailedIds.push(...result.failedIds);

          setProgress(totalSent + totalFailed);

          if (!result.success && result.failedCount === batch.length) {
            toast.error(`Failed to send batch starting at voter ${i + 1}`);
            break;
          }
        } catch (error) {
          console.error("Error sending batch:", error);
          toast.error("An error occurred while sending batch");
          break;
        }
      }

      if (totalFailed === 0) {
        toast.success(`Successfully sent ${totalSent} voting codes!`);
        setIsComplete(true);
      } else {
        toast.warning(
          `Sent ${totalSent} codes, but ${totalFailed} failed. Please retry the failed voters.`
        );
        setIsComplete(true);
      }
    } catch (error) {
      console.error("Bulk send error:", error);
      toast.error("An unexpected error occurred");
      setIsSending(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (isSending) return;
    setIsOpen(false);
    setIsComplete(false);
    setProgress(0);
  };

  const handleSuccess = () => {
    setIsOpen(false);
    setIsComplete(false);
    setProgress(0);
    router.refresh();
  };

  const progressPercent = (progress / unsentVoters.length) * 100;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={unsentVoters.length === 0}
        className="gap-2"
        size="sm"
      >
        Distribute Unsent Codes
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          onInteractOutside={(e) => {
            if (isSending) e.preventDefault();
          }}
        >
          {!isSending && !isComplete && (
            <>
              <DialogHeader>
                <DialogTitle>Distribute Voting Codes</DialogTitle>
                <DialogDescription>
                  Confirm bulk distribution of voting codes
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-yellow-50 p-4 border border-yellow-200">
                  <p className="text-sm text-yellow-900 font-medium">
                    ⚠️ You are about to send {unsentVoters.length} emails. Please
                    keep this window open until the process finishes.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button onClick={handleBulkSend}>
                  Confirm & Send
                </Button>
              </DialogFooter>
            </>
          )}

          {/* Processing State */}
          {isSending && (
            <>
              <DialogHeader>
                <DialogTitle>Distributing Codes</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <p className="text-sm text-muted-foreground">
                  Sending emails... {progress} of {unsentVoters.length} completed.
                </p>
                <Progress value={progressPercent} className="h-2" />
              </div>
            </>
          )}

          {isComplete && !isSending && (
            <>
              <DialogHeader>
                <DialogTitle>Distribution Complete</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="rounded-lg bg-green-50 p-4 border border-green-200">
                  <p className="text-sm text-green-900 font-medium">
                    ✅ All {unsentVoters.length} codes have been distributed!
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSuccess}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
