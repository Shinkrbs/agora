"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { JoinOrganizationDialog } from "./JoinOrganizationDialog";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";

export function OrganizationsHeader() {
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-4 mb-8">
        {/* Title and Description */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50">
            Organizations
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            View and manage the organizations you are part of
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            className="gap-2"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Organization
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setJoinDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Join Organization
          </Button>
        </div>
      </div>

      <JoinOrganizationDialog
        isOpen={joinDialogOpen}
        onClose={() => setJoinDialogOpen(false)}
      />

      <CreateOrganizationDialog
        isOpen={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </>
  );
}
