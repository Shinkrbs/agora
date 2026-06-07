"use client";
import { useEffect } from "react";
import { isOwner as checkIsOwner } from "../_queries/organization-management-queries";
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
import { Building2, UserCircle, Search, Filter, X } from "lucide-react";
import Image from "next/image";
import { MemberDetails } from "@/types/database"; // Must match the OrganizationCard import!
import { toast } from "sonner";
import { kickMember } from "../_queries/organization-management-queries";

export interface ViewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
  members: MemberDetails[];
  isLoading?: boolean;
  id: string; // Added organization ID for ownership check
  inviteCode: string; // Added invite code for sharing
}

type FilterStatus = "all" | "active" | "kicked";

export function ViewOrganizationDialog({
  isOpen,
  onClose,
  name,
  shorthandName,
  logoUrl,
  members,
  id: organizationId,
  inviteCode,
}: ViewOrganizationDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("active");
  const [owner, setOwner] = useState(false); // You can set this based on your logic, e.g., from props or a hook
  const [kickingMemberId, setKickingMemberId] = useState<string | null>(null);

  useEffect(() => {
    // Example logic to determine if the user is an owner (you can replace this with your actual logic)
    const checkOwnership = async () => {
      const response = await checkIsOwner(organizationId); // You need to have organizationId available in this component
      setOwner(response);
    };

    checkOwnership();
  }, [organizationId]);

  const handleKickMember = async (memberId: string, memberName: string) => {
    setKickingMemberId(memberId);
    try {
      const result = await kickMember(organizationId, memberId);
      if (result.success) {
        toast.success(`${memberName} has been kicked from the organization.`);
        // Optionally refresh the members list here
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error kicking member:", error);
      toast.error("An error occurred while kicking the member.");
    } finally {
      setKickingMemberId(null);
    }
  };

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
      <DialogContent className="sm:max-w-300 w-[95vw] h-[85vh] max-h-[95vh] min-w-[320px] min-h-100 p-6 md:p-8 flex flex-col bg-card text-card-foreground border-border shadow-lg resize overflow-hidden">
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
          <div className="shrink-0 flex items-center gap-3 p-3 rounded-lg border border-border bg-background">
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
              <div className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center border border-border bg-background">
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
            <div className="ml-auto flex items-center gap-2">
              {owner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    toast.success("Invite code copied to clipboard!");}}
                >
                  Copy Invite Code
                </Button>
              )}    
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

            <div className="relative shrink-0 w-full sm:w-45">
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
          <div className="flex-1 overflow-hidden border border-border rounded-lg flex flex-col bg-background">
            <div className="overflow-y-auto h-full">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="sticky top-0 z-10 text-muted-foreground bg-background border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
                    <th className="px-4 py-3 font-medium">Kicked Date</th>
                    {owner && <th className="px-4 py-3 font-medium">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="transition-colors">
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
                            className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                              ${String(member.role).toUpperCase() === "OWNER" ? "border-primary/30 text-primary" : ""}
                              ${String(member.role).toUpperCase() === "ADMIN" ? "border-blue-500/30 text-blue-600 dark:text-blue-400" : ""}
                              ${String(member.role).toUpperCase() === "MEMBER" ? "border-border text-foreground" : ""}
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
                        {owner && (
                          <td className="px-4 py-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 hover:bg-red-100 dark:hover:bg-red-950"
                              onClick={() => handleKickMember(member.id, `${member.first_name} ${member.last_name}`)}
                              disabled={member.kicked_at !== null || kickingMemberId === member.id}
                              aria-label={`Kick ${member.first_name} ${member.last_name}`}
                              title={member.kicked_at ? "Member already kicked" : "Kick member"}
                            >
                              <X className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                              Kick
                            </Button>
                          </td>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={owner ? 6 : 5}
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
