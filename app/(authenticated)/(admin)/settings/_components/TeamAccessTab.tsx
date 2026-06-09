"use client";

import { useState, useEffect } from "react";
import { Organization, MemberDetails } from "@/types/database";
import { getOrganizationMembers } from "../_queries/get-organization-members";
import { updateMemberRole } from "../_actions/update-member-role";
import { kickMember } from "../_actions/kick-member";
import { transferOwnership } from "../_actions/transfer-ownership";
import { useCurrentOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Copy, MoreHorizontal, Shield, ShieldAlert, UserIcon } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TeamAccessTabProps {
  organization: Organization;
}

export function TeamAccessTab({ organization }: TeamAccessTabProps) {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const currentOrg = useCurrentOrganization();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadMembers() {
      setIsLoading(true);
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user && isMounted) {
          setCurrentUserId(user.id);
        }

        const data = await getOrganizationMembers(organization.id);
        if (isMounted) {
          setMembers(data || []);
        }
      } catch (error) {
        console.error("Failed to load members:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadMembers();

    return () => {
      isMounted = false;
    };
  }, [organization.id]);

  const currentUserRole = members.find(m => m.user_id === currentUserId)?.role || "member";
  
  const canCopyInvite = currentUserRole === "admin" || currentUserRole === "owner";

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(organization.invite_code);
    toast.success("Invite code copied to clipboard!");
  };

  const handleRoleChange = async (memberId: string, userId: string, newRole: "admin" | "member") => {
    toast.loading("Updating role...", { id: `role-${memberId}` });
    const result = await updateMemberRole(organization.id, userId, newRole);
    
    if (result.success) {
      toast.success(result.message, { id: `role-${memberId}` });
      setMembers(members.map(m => m.id === memberId ? { ...m, role: newRole } : m));
    } else {
      toast.error(result.message, { id: `role-${memberId}` });
    }
  };

  const handleKick = async (memberId: string, userId: string) => {
    if (!confirm("Are you sure you want to kick this member?")) return;
    
    toast.loading("Kicking member...", { id: `kick-${memberId}` });
    const result = await kickMember(organization.id, userId);
    
    if (result.success) {
      toast.success(result.message, { id: `kick-${memberId}` });
      setMembers(members.filter(m => m.id !== memberId));
    } else {
      toast.error(result.message, { id: `kick-${memberId}` });
    }
  };

  const handleTransferOwnership = async (memberId: string, userId: string) => {
    if (!confirm("Are you sure you want to transfer ownership to this admin? You will be demoted to admin.")) return;

    toast.loading("Transferring ownership...", { id: `transfer-${memberId}` });
    const result = await transferOwnership(organization.id, userId);

    if (result.success) {
      toast.success(result.message, { id: `transfer-${memberId}` });
      setMembers(members.map(m => {
        if (m.user_id === userId) return { ...m, role: "owner" };
        if (m.user_id === currentUserId) return { ...m, role: "admin" };
        return m;
      }));
    } else {
      toast.error(result.message, { id: `transfer-${memberId}` });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner": return <ShieldAlert className="w-4 h-4 text-red-500" />;
      case "admin": return <Shield className="w-4 h-4 text-blue-500" />;
      default: return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {canCopyInvite && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Organization Invite Code</span>
              <Button variant="outline" size="sm" onClick={handleCopyInvite}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>
            </CardTitle>
            <CardDescription>
              Share this code with your members so they can join this organization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-mono font-bold tracking-widest text-primary">
              {organization.invite_code}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage who has access to your organization.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-8">Loading members...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.avatar_url || ""} />
                          <AvatarFallback>{member.first_name[0]}{member.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.first_name} {member.last_name}</p>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(member.role)}
                        <span className="capitalize">{member.role}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(member.joined_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {/* Role Management */}
                          {currentUserRole === "owner" && member.role === "admin" && (
                            <>
                              <DropdownMenuItem onClick={() => handleRoleChange(member.id, member.user_id, "member")}>
                                Demote to Member
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleTransferOwnership(member.id, member.user_id)}>
                                Transfer Ownership
                              </DropdownMenuItem>
                            </>
                          )}

                          {currentUserRole === "owner" && member.role === "member" && (
                             <DropdownMenuItem onClick={() => handleRoleChange(member.id, member.user_id, "admin")}>
                               Promote to Admin
                             </DropdownMenuItem>
                          )}
                          
                          {currentUserRole === "admin" && member.role === "member" && (
                            <DropdownMenuItem onClick={() => handleRoleChange(member.id, member.user_id, "admin")}>
                              Promote to Admin
                            </DropdownMenuItem>
                          )}

                          {/* Kick Management */}
                          {(currentUserRole === "owner" && (member.role === "admin" || member.role === "member")) || 
                           (currentUserRole === "admin" && member.role === "member") ? (
                            <DropdownMenuItem className="text-red-600" onClick={() => handleKick(member.id, member.user_id)}>
                              Kick Member
                            </DropdownMenuItem>
                          ) : null}

                          {/* Allow leaving if it's the current user (and not owner) */}
                          {member.user_id === currentUserId && member.role !== "owner" && (
                            <DropdownMenuItem className="text-red-600" onClick={() => handleKick(member.id, member.user_id)}>
                              Leave Organization
                            </DropdownMenuItem>
                          )}
                          
                          {/* Display state when no actions available */}
                          {(currentUserRole === "member" || member.role === "owner" || (currentUserRole === "admin" && member.role === "admin")) && member.user_id !== currentUserId && (
                            <DropdownMenuItem disabled>No actions available</DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
