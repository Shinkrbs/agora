"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface JoinOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinOrganizationDialog({
  isOpen,
  onClose,
}: JoinOrganizationDialogProps) {
  const [inviteCode, setInviteCode] = useState("");

  if (!isOpen) return null;

  const handleJoin = () => {
    // TODO: Implement join logic
    console.log("Joining with code:", inviteCode);
    setInviteCode("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-sm p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
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
              Enter your invite code to join an organization
            </p>
          </div>

          {/* Invite Code Input */}
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              placeholder="Enter invite code..."
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Join Button */}
          <Button
            onClick={handleJoin}
            className="w-full"
            disabled={!inviteCode.trim()}
          >
            Join
          </Button>
        </div>
      </Card>
    </div>
  );
}
