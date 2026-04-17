"use client";

import { useState } from "react";
import { MemberDetails } from "@/types/database";
import { getOrganizationMembers } from "@/app/(authenticated)/(admin)/organization-management/_actions/view-members";

export function useOrganizationMembers(organizationId: string) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  const handleOpenViewMembers = () => {
    setTimeout(async () => {
      setIsViewDialogOpen(true);
      setIsLoadingMembers(true);

      try {
        const dbMembers = await getOrganizationMembers(organizationId);
        setMembers(dbMembers);
      } catch (error) {
        console.error("Error fetching organization members:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    }, 50);
  };

  return {
    isViewDialogOpen,
    setIsViewDialogOpen,
    members,
    isLoadingMembers,
    handleOpenViewMembers,
  };
}
