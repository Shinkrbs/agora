"use client";

import { useState, useActionState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { joinOrganization } from "../_actions/join-organization";

interface JoinOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const initialState = { message: "", success: false };

export function JoinOrganizationDialog({
  isOpen,
  onClose,
}: JoinOrganizationDialogProps) {
  const [inviteCode, setInviteCode] = useState("");
  const [state, formAction, isPending] = useActionState(joinOrganization, initialState);

  const handleClose = () => {
    setInviteCode("");
    onClose();
  };

  // If submission is successful, close the dialog
  useEffect(() => {
    if (state.success) {
      setInviteCode("");
      handleClose();
    }
  }, [state.success]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          type="button"
          className="absolute top-4 right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
              Join Organization
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Enter your invite code to join an approved organization
            </p>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-4">
            {/* Invite Code Input */}
            <div className="space-y-2">
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input
                id="inviteCode"
                name="inviteCode"
                placeholder="e.g., ABC-123456"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                disabled={isPending}
              />
              {state.errors?.inviteCode && (
                <p className="text-red-500 text-xs">{state.errors.inviteCode[0]}</p>
              )}
            </div>

            {/* Error or Success Message */}
            {state.message && (
              <p
                className={`text-sm text-center ${
                  state.success
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {state.message}
              </p>
            )}

            {/* Join Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={!inviteCode.trim() || isPending}
            >
              {isPending ? "Joining..." : "Join"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
