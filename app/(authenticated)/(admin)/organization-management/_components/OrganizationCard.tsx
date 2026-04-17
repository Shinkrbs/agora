"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Pencil,
  Check,
  Clock,
  X,
  CircleUser,
} from "lucide-react";
import Image from "next/image";
import { ApprovalStatus } from "@/types/database";
import { EditOrganizationDialog } from "./EditOrganizationDialog";
import { ViewOrganizationDialog } from "./ViewMembersDialog";
import { Organization, MemberDetails } from "@/types/database";
import { useOrganizationMembers } from "../hooks/useOrganizationMembers";
interface OrganizationCardProps {
  id: string;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
  approvalStatus: ApprovalStatus;
}

const getStatusConfig = (status: ApprovalStatus) => {
  switch (status) {
    case "approved":
      return {
        icon: Check,
        color: "text-green-500",
        bgColor: "bg-green-50 dark:bg-green-950",
        borderColor: "border-green-200 dark:border-green-800",
        label: "Approved",
      };
    case "pending":
      return {
        icon: Clock,
        color: "text-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950",
        borderColor: "border-amber-200 dark:border-amber-800",
        label: "Pending",
      };
    case "rejected":
      return {
        icon: X,
        color: "text-red-500",
        bgColor: "bg-red-50 dark:bg-red-950",
        borderColor: "border-red-200 dark:border-red-800",
        label: "Rejected",
      };
  }
};

export function OrganizationCard({
  id,
  name,
  shorthandName,
  logoUrl,
  approvalStatus,
}: OrganizationCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const statusConfig = getStatusConfig(approvalStatus);
  const StatusIcon = statusConfig.icon;
  const isApproved = approvalStatus === "approved";
  const {
    isViewDialogOpen,
    setIsViewDialogOpen,
    members,
    isLoadingMembers,
    handleOpenViewMembers,
  } = useOrganizationMembers(id);

  return (
    <>
      <Card className="relative p-6 h-full hover:shadow-lg transition-shadow flex flex-col">
        <div className="flex gap-4 mb-4">
          <div className="shrink-0">
            <div className="w-14 h-14 rounded-full bg-transparent overflow-hidden flex items-center justify-center ring-1 ring-slate-300 dark:ring-slate-700">
              <Image
                src={logoUrl || "/logo.svg"}
                alt={`${name} logo`}
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={!isApproved}
                  onClick={handleOpenViewMembers}
                >
                  <CircleUser className="h-4 w-4 mr-2" />
                  View Members
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  disabled={!isApproved}
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Organization
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer">
                  Switch to {name}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 line-clamp-2">
              {name}
            </h3>
            {shorthandName && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {shorthandName}
              </p>
            )}
          </div>

          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${statusConfig.bgColor} ${statusConfig.borderColor} w-fit`}
          >
            <StatusIcon className={`h-3.5 w-3.5 ${statusConfig.color}`} />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {statusConfig.label}
            </span>
          </div>

          {!isApproved && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Editing will be available once your organization is approved.
            </p>
          )}
        </div>
      </Card>

      <EditOrganizationDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        organizationId={id}
        initialName={name}
        initialShorthand={shorthandName}
        initialLogoUrl={logoUrl}
      />
      <ViewOrganizationDialog
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        name={name}
        shorthandName={shorthandName}
        logoUrl={logoUrl}
        members={members} // Pass the mock data here
        isLoading={isLoadingMembers}
      />
    </>
  );
}
