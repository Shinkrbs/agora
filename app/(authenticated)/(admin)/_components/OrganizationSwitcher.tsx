"use client";

import React, { useState } from "react";
import { Organization } from "@/types/database";
import { useOrganization } from "./OrganizationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface OrganizationSwitcherProps {
  organizations: Organization[];
}

export function OrganizationSwitcher({
  organizations,
}: OrganizationSwitcherProps) {
  const {
    currentOrganization,
    setCurrentOrganization,
    isLoading,
    setIsLoading,
  } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);

  const approvedOrganizations = organizations.filter(
    (org) => org.approval_status === "approved",
  );

  if (!currentOrganization || approvedOrganizations.length === 0) {
    return null;
  }

  const handleSelectOrganization = (org: Organization) => {
    if (org.id === currentOrganization.id) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    // Simulate loading time for switching
    setTimeout(() => {
      setCurrentOrganization(org);
      setIsLoading(false);
      setIsOpen(false);
      toast.success(`Switched to ${org.name}`);
    }, 500);
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="gap-2 px-3 h-9"
            disabled={isLoading}
          >
            <div className="w-6 h-6 border rounded-full bg-transparent overflow-hidden flex items-center justify-center">
              <Image
                src={currentOrganization.logo_url || "/logo.svg"}
                alt={`${currentOrganization.name} logo`}
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-50">
              {currentOrganization.shorthand_name}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
            Organizations
          </div>
          {approvedOrganizations.length === 0 ? (
            <div className="px-2 py-2 text-sm text-slate-600 dark:text-slate-400">
              No approved organizations
            </div>
          ) : (
            approvedOrganizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => handleSelectOrganization(org)}
                className="flex items-center gap-2 py-2 px-2"
              >
                <div className="w-6 h-6 rounded-full border bg-transparent overflow-hidden flex items-center justify-center shrink-0">
                  <Image
                    src={org.logo_url || "/logo.svg"}
                    alt={`${org.name} logo`}
                    width={24}
                    height={24}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-slate-50 truncate">
                    {org.shorthand_name}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
                    {org.name}
                  </p>
                </div>
                {org.id === currentOrganization.id && (
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                )}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
