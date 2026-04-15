"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input"; // Make sure you have this component
import { X, Building2, UserCircle, Search } from "lucide-react";
import Image from "next/image";
import { MemberDetails } from "../_types/_mockmembersdata";

interface ViewOrganizationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  shorthandName: string;
  logoUrl?: string | null;
  members: MemberDetails[];
}

export function ViewOrganizationDialog({
  isOpen,
  onClose,
  name,
  shorthandName,
  logoUrl,
  members,
}: ViewOrganizationDialogProps) {
  // State for the search query
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  // Filter members based on name or email
  const filteredMembers = members.filter((member) => {
    const fullName = `${member.first_name} ${member.last_name}`.toLowerCase();
    const email = member.email.toLowerCase();
    const query = searchQuery.toLowerCase();

    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl p-6 md:p-8 relative max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>

        <div className="mb-6 shrink-0">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Organization Members
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            View the list of members currently in this organization.
          </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col space-y-4">
          {/* Organization Info Header */}
          <div className="shrink-0 flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            {logoUrl ? (
              <div className="shrink-0 w-10 h-10 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                <Image // Note: keeping as Image, change back to <img> if using external mock URLs without config
                  src={logoUrl}
                  alt={`${name} logo`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="shrink-0 w-10 h-10 rounded-md flex items-center justify-center border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <Building2 className="w-5 h-5 text-slate-400" />
              </div>
            )}

            <div className="flex flex-col">
              <Label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
                Organization Name
              </Label>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-50 leading-tight">
                {name || "N/A"} {shorthandName && `(${shorthandName})`}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="shrink-0 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400" />
            <Input
              type="text"
              placeholder="Search members by name or email..."
              className="pl-9 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Members Table */}
          <div className="flex-1 overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg flex flex-col">
            <div className="overflow-y-auto max-h-[40vh]">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-900/80 sticky top-0 z-10 text-slate-500 dark:text-slate-400 backdrop-blur-sm shadow-sm">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Joined Date</th>
                    <th className="px-4 py-3 font-medium">Kicked Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="px-4 py-3 flex items-center gap-3">
                          {member.avatar_url ? (
                            <img
                              src={member.avatar_url}
                              alt={`${member.first_name} avatar`}
                              width={28}
                              height={28}
                              className="rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <UserCircle className="w-7 h-7 text-slate-400" />
                          )}
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {member.first_name} {member.last_name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                          {member.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${member.role === "OWNER" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : ""}
                  ${member.role === "ADMIN" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : ""}
                  ${member.role === "MEMBER" ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" : ""}
                `}
                          >
                            {member.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {new Date(member.joined_at).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                          {member.kicked_at ? (
                            new Date(member.kicked_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 italic">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-8 text-center text-slate-500"
                      >
                        {searchQuery ? (
                          <>No members found matching "{searchQuery}".</>
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

          <div className="shrink-0 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto sm:float-right"
            >
              Close Window
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
