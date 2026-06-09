"use client";
import { useEffect, useState } from "react";
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
import { Building2, UserCircle, Search, Filter, X, ArrowRightLeft, ShieldAlert } from "lucide-react";
import Image from "next/image";
import { MemberDetails, OrgMemberRole } from "@/types/database"; 
import { toast } from "sonner";
import { kickMember } from "../_queries/organization-management-queries";
import { getUserOrganizationRole, updateOrganizationMemberRole, transferOwnership } from "../_actions/organization-member-role";
import { createClient } from "@/lib/supabase/client";

export interface ViewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
  members: MemberDetails[];
  isLoading?: boolean;
  id: string; 
  inviteCode: string; 
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
  const [currentUserRole, setCurrentUserRole] = useState<OrgMemberRole | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserContext = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        const role = await getUserOrganizationRole(user.id, organizationId);
        setCurrentUserRole(role);
      }
    };

    if (isOpen) {
      fetchUserContext();
    }
  }, [isOpen, organizationId]);

  const handleKickMember = async (memberRecordId: string, memberName: string) => {
    setProcessingId(memberRecordId);
    try {
      const result = await kickMember(organizationId, memberRecordId);
      if (result.success) {
        toast.success(`${memberName} has been kicked.`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while kicking the member.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRoleChange = async (memberRecordId: string, newRole: OrgMemberRole) => {
    setProcessingId(memberRecordId);
    try {
      const result = await updateOrganizationMemberRole(memberRecordId, organizationId, newRole);
      if (result.success) {
        toast.success(`Role updated to ${newRole}.`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating the role.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleTransferOwnership = async (memberRecordId: string, memberName: string) => {
    if (!confirm(`Are you absolutely sure you want to transfer ownership to ${memberName}? You will be demoted to Admin.`)) {
        return;
    }
    
    setProcessingId(memberRecordId);
    try {
      const result = await transferOwnership(memberRecordId, organizationId);
      if (result.success) {
        toast.success(result.message);
        setCurrentUserRole("admin"); // Update local state immediately
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred while transferring ownership.");
    } finally {
      setProcessingId(null);
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

  // Security Helper Functions for the UI
  const canEditRole = (targetRole: string) => {
    if (currentUserRole === "owner" && targetRole !== "owner") return true;
    if (currentUserRole === "admin" && targetRole !== "owner") return true;
    return false;
  };

  const canKick = (targetRole: string) => {
    if (currentUserRole === "owner" && targetRole !== "owner") return true;
    if (currentUserRole === "admin" && targetRole === "member") return true;
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-300 w-[95vw] h-[85vh] max-h-[95vh] min-w-[320px] min-h-100 p-6 md:p-8 flex flex-col bg-card text-card-foreground border-border shadow-lg resize overflow-hidden">
        <DialogHeader className="shrink-0 text-left">
          <DialogTitle className="text-2xl font-semibold text-foreground">
            Organization Members
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            View and manage the members of this organization.
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
              {currentUserRole === "owner" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode);
                    toast.success("Invite code copied to clipboard!");
                  }}
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
                onValueChange={(value) => setFilterStatus(value as FilterStatus)}
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
                    <th className="px-4 py-3 font-medium">Status</th>
                    {(currentUserRole === "owner" || currentUserRole === "admin") && (
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => {
                      const isSelf = member.user_id === currentUserId;
                      const isKicked = member.kicked_at !== null;
                      const editableRole = !isSelf && !isKicked && canEditRole(member.role);
                      const kickable = !isSelf && !isKicked && canKick(member.role);
                      const isProcessing = processingId === member.id;

                      return (
                      <tr key={member.id} className="transition-colors hover:bg-muted/50">
                        <td className="px-4 py-3 flex items-center gap-3">
                          {member.avatar_url ? (
                            <Image
                              src={member.avatar_url}
                              alt={`${member.first_name} avatar`}
                              width={28}
                              height={28}
                              className="rounded-full object-cover border border-border"
                            />
                          ) : (
                            <UserCircle className="w-7 h-7 text-muted-foreground" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {member.first_name} {member.last_name}
                              {isSelf && <span className="ml-2 text-xs text-muted-foreground font-normal">(You)</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {member.email}
                        </td>
                        <td className="px-4 py-3">
                          {editableRole ? (
                            <Select
                              disabled={isProcessing}
                              defaultValue={member.role}
                              onValueChange={(val) => handleRoleChange(member.id, val as OrgMemberRole)}
                            >
                              <SelectTrigger className="w-27.5 h-8 text-xs font-semibold uppercase tracking-wider">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="admin">ADMIN</SelectItem>
                                <SelectItem value="member">MEMBER</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border
                                ${String(member.role).toUpperCase() === "OWNER" ? "border-primary/30 text-primary bg-primary/10" : ""}
                                ${String(member.role).toUpperCase() === "ADMIN" ? "border-blue-500/30 text-blue-600 bg-blue-500/10" : ""}
                                ${String(member.role).toUpperCase() === "MEMBER" ? "border-border text-foreground bg-muted" : ""}
                              `}
                            >
                              {member.role}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(member.joined_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                        </td>
                        <td className="px-4 py-3">
                          {isKicked ? (
                            <span className="inline-flex items-center text-xs font-medium text-destructive">
                              <ShieldAlert className="w-3 h-3 mr-1" />
                              Kicked
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                              Active
                            </span>
                          )}
                        </td>
                        
                        {(currentUserRole === "owner" || currentUserRole === "admin") && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {currentUserRole === "owner" && member.role === "admin" && !isKicked && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  disabled={isProcessing}
                                  onClick={() => handleTransferOwnership(member.id, `${member.first_name} ${member.last_name}`)}
                                >
                                  <ArrowRightLeft className="w-3 h-3 mr-1" />
                                  Make Owner
                                </Button>
                              )}
                              
                              {kickable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 hover:bg-red-100 dark:hover:bg-red-950 text-red-600"
                                  onClick={() => handleKickMember(member.id, `${member.first_name} ${member.last_name}`)}
                                  disabled={isProcessing}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Kick
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    )})
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        {searchQuery || filterStatus !== "all" 
                          ? "No members found matching your search or filter."
                          : "No members found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

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