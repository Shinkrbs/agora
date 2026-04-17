"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, UserCircle, Search, Filter } from "lucide-react";
import Image from "next/image";
import { MemberDetails } from "@/types/database"; // Must match the OrganizationCard import!

interface ViewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
  members: MemberDetails[];
  isLoading?: boolean;
}

type FilterStatus = "all" | "active" | "kicked";

export function ViewOrganizationDialog({
  isOpen,
  onClose,
  name,
  shorthandName,
  logoUrl,
  members,
}: ViewOrganizationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch = fullName.includes(query) || email.includes(query);

    let matchesFilter = true;
    if (filterStatus === "active") {
      matchesFilter = member.kicked_at === null;
    } else if (filterStatus === "kicked") {
      matchesFilter = member.kicked_at !== null;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Replaced Card with DialogContent. 
        Kept the resize, custom dimensions, and flex layouts for the dynamic table height.
      */}
      <DialogContent className="sm:max-w-[1200px] w-[95vw] h-[85vh] max-h-[95vh] min-w-[320px] min-h-[400px] p-6 md:p-8 flex flex-col bg-card text-card-foreground border-border shadow-lg resize overflow-hidden">
        {/* Replaced manual h2/p with accessible DialogHeader components */}
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Organization Members
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            View the list of members currently in this organization.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4 mt-2">
          {/* Organization Info Header */}
          <div className="shrink-0 flex items-center gap-3 bg-muted/50 p-3 rounded-lg border border-border">
            {logoUrl ? (
              <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden border border-border bg-background">
                <Image
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center border border-border bg-muted">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            <div className="flex flex-col">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                Organization Name
              </Label>
              <p className="text-sm font-medium text-foreground leading-tight">
                {name || "N/A"} {shorthandName && `(${shorthandName})`}
              </p>
            </div>
          </div>

          {/* Search and Filter Controls */}
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search members by name or email..."
                className="pl-9 w-full bg-background border-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative shrink-0 w-full sm:w-[180px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <Filter className="h-4 w-4 text-muted-foreground" />
              </div>
              <Select
                value={filterStatus}
                onValueChange={(value) =>
                  setFilterStatus(value as FilterStatus)
                }
              >
                <SelectTrigger className="w-full pl-9 bg-background border-input">
                  <SelectValue placeholder="Filter status..." />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="active">Active Members</SelectItem>
                  <SelectItem value="kicked">Kicked Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Members Table */}
          <div className="flex-1 overflow-hidden border border-border rounded-lg flex flex-col bg-card">
            <div className="overflow-y-auto h-full">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-muted/50 sticky top-0 z-10 text-muted-foreground backdrop-blur-sm shadow-sm border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
                    <th className="px-4 py-3 font-medium">Kicked Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 flex items-center gap-3">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={`${member.first_name} avatar`}
                              width={28}
                              height={28}
                              className="rounded-full object-cover border border-border"
                            />
                          ) : (
                            <UserCircle className="w-7 h-7 text-muted-foreground" />
                          )}
                          <span className="font-medium text-foreground">
                            {member.first_name} {member.last_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                              ${String(member.role).toUpperCase() === "OWNER" ? "bg-primary/15 text-primary" : ""}
                              ${String(member.role).toUpperCase() === "ADMIN" ? "bg-secondary text-secondary-foreground" : ""}
                              ${String(member.role).toUpperCase() === "MEMBER" ? "bg-muted text-muted-foreground" : ""}
                            `}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(member.joined_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.kicked_at ? (
                            <span className="text-destructive font-medium">
                              {new Date(member.kicked_at).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          ) : (
                            <span className="italic opacity-50">-</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        {searchQuery || filterStatus !== "all" ? (
                          <>No members found matching your search or filter.</>
                        ) : (
                          <>No members found.</>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Optional: DialogFooter could go here, but this bottom area is fine too */}
          <div className="shrink-0 pt-4 flex justify-end">
            <Button type="button" onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
