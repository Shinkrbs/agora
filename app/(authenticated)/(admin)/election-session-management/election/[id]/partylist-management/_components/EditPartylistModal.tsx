"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { RotateCcw, X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PartylistWithCandidateCount } from "../_types/partylist-types";
import { Candidate } from "@/types/database";
import { cn } from "@/lib/utils";

interface EditPartylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partylist: PartylistWithCandidateCount | null;
  candidates: Candidate[];
  onSave: (data: {
    name: string;
    description: string;
    addedMemberIds: string[];
    removedMemberIds: string[];
    logoFile?: File | null;
  }) => Promise<void>;
}

export function EditPartylistModal({
  open,
  onOpenChange,
  partylist,
  candidates,
  onSave,
}: EditPartylistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [initialName, setInitialName] = useState("");
  const [description, setDescription] = useState("");
  const [initialDescription, setInitialDescription] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set()
  );
  const [initialMemberIds, setInitialMemberIds] = useState<Set<string>>(
    new Set()
  );
  const [newMemberIds, setNewMemberIds] = useState<Set<string>>(
    new Set()
  );
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with partylist data
  useEffect(() => {
    if (partylist && open) {
      setName(partylist.name);
      setInitialName(partylist.name);
      setDescription(partylist.description || "");
      setInitialDescription(partylist.description || "");
      setLogoFile(null);
      setLogoPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Get members associated with this partylist
      const memberIds = new Set(
        candidates
          .filter((c) => c.partylist_id === partylist.id && !c.is_deleted)
          .map((c) => c.id)
      );
      setSelectedMemberIds(memberIds);
      setInitialMemberIds(new Set(memberIds));
      setNewMemberIds(new Set());
    }
  }, [partylist, open, candidates]);

  const handleAddMember = (candidateId: string) => {
    setSelectedMemberIds((prev) => new Set([...prev, candidateId]));
    setNewMemberIds((prev) => new Set([...prev, candidateId]));
  };

  const handleRemoveMember = (candidateId: string) => {
    // This now just removes from selectedMemberIds without removing from the UI
    setSelectedMemberIds((prev) => {
      const newSet = new Set(prev);
      newSet.delete(candidateId);
      return newSet;
    });
    // Mark as removed (will show visual indication)
  };

  const handleUndoRemove = (candidateId: string) => {
    // Add back to selected members
    setSelectedMemberIds((prev) => new Set([...prev, candidateId]));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    if (!partylist) return;

    setIsLoading(true);
    try {
      const addedMemberIds = Array.from(selectedMemberIds).filter(
        (id) => !initialMemberIds.has(id)
      );
      const removedMemberIds = Array.from(initialMemberIds).filter(
        (id) => !selectedMemberIds.has(id)
      );

      await onSave({
        name,
        description,
        addedMemberIds,
        removedMemberIds,
        logoFile: logoFile || null,
      });

      onOpenChange(false);
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsLoading(false);
    }
  };

  // Get available candidates (not currently selected and not assigned to any partylist)
  const availableCandidates = candidates.filter(
    (c) => !c.is_deleted && c.partylist_id === null && !selectedMemberIds.has(c.id)
  );

  // Get current members
  const currentMembers = Array.from(selectedMemberIds)
    .map((id) => candidates.find((c) => c.id === id))
    .filter((c) => c !== undefined) as Candidate[];

  // Calculate changes
  const addedMemberIds = Array.from(selectedMemberIds).filter(
    (id) => !initialMemberIds.has(id)
  );
  const removedMemberIds = Array.from(initialMemberIds).filter(
    (id) => !selectedMemberIds.has(id)
  );
  const hasNameChanged = name !== initialName;
  const hasDescriptionChanged = description !== initialDescription;
  const hasLogoChanged = logoFile !== null;
  const hasChanges = addedMemberIds.length > 0 || removedMemberIds.length > 0 || hasNameChanged || hasDescriptionChanged || hasLogoChanged;

  // Determine save button text
  const getSaveButtonText = () => {
    const parts = [];
    if (addedMemberIds.length > 0) parts.push(`${addedMemberIds.length} Added`);
    if (removedMemberIds.length > 0) parts.push(`${removedMemberIds.length} Removed`);
    
    if (parts.length === 0) {
      return isLoading ? "Saving..." : "Save Changes";
    }
    return isLoading ? "Saving..." : `Save (${parts.join(", ")})`;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Partylist</DialogTitle>
          <DialogDescription>
            Update the partylist name, description, and manage members
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="partylist-name">Partylist Name</Label>
            <Input
              id="partylist-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter partylist name"
              disabled={isLoading}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="partylist-description">Description</Label>
            <textarea
              id="partylist-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter partylist description"
              disabled={isLoading}
              className="w-full min-h-20 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Logo Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Logo</h3>
            
            {/* Current Logo Preview */}
            {partylist?.logo_url && !logoPreview && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Current Logo</Label>
                <div className="h-24 w-24">
                  <Image
                    src={partylist.logo_url}
                    alt="Current logo"
                    className="h-full w-full object-cover rounded-md border border-input"
                    width={95}
                    height={95}
                  />
                </div>
              </div>
            )}

            {/* Logo Upload or Preview */}
            {!logoPreview ? (
              <div className="space-y-2">
                <Label htmlFor="partylist-logo">Change Logo (Optional)</Label>
                <input
                  ref={fileInputRef}
                  id="partylist-logo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                  className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90
                    disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label>New Logo Preview</Label>
                <div className="relative inline-block">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-24 w-24 object-cover rounded-md border border-input"
                    width={95}
                    height={95}
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6"
                    onClick={handleRemoveLogo}
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove new logo</span>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Members Section */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-sm mb-3">Manage Members</h3>

              {/* Add Member Dropdown */}
              <div className="mb-4">
                <Label htmlFor="add-member" className="text-xs text-muted-foreground mb-2 block">
                  Add Member
                </Label>
                <Select
                  onValueChange={(candidateId) => {
                    handleAddMember(candidateId);
                  }}
                  disabled={isLoading || availableCandidates.length === 0}
                >
                  <SelectTrigger id="add-member">
                    <SelectValue
                      placeholder={
                        availableCandidates.length === 0
                          ? "No available candidates"
                          : "Select a candidate to add"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCandidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.first_name} {candidate.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Members List */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Current Members ({currentMembers.length})
                </Label>
                {currentMembers.length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {currentMembers.map((member) => {
                      const isRemoved = !selectedMemberIds.has(member.id) && initialMemberIds.has(member.id);
                      const isNew = newMemberIds.has(member.id);

                      return (
                        <Card
                          key={member.id}
                          className={cn(
                            isRemoved && "opacity-50",
                            isNew && "bg-green-50 border-green-200"
                          )}
                        >
                          <CardContent className="p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={member.image_url || undefined}
                                  alt={`${member.first_name} ${member.last_name}`}
                                />
                                <AvatarFallback>
                                  {getInitials(member.first_name, member.last_name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p
                                    className={cn(
                                      "text-sm font-medium truncate",
                                      isRemoved && "line-through text-muted-foreground"
                                    )}
                                  >
                                    {member.first_name} {member.last_name}
                                    {member.middle_name && ` ${member.middle_name}`}
                                    {member.suffix && ` ${member.suffix}`}
                                  </p>
                                  {isRemoved && (
                                    <Badge variant="destructive" className="shrink-0">
                                      Removed
                                    </Badge>
                                  )}
                                  {isNew && (
                                    <Badge className="shrink-0 bg-green-100 text-green-800 hover:bg-green-200">
                                      New
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                if (isRemoved) {
                                  handleUndoRemove(member.id);
                                } else {
                                  handleRemoveMember(member.id);
                                }
                              }}
                              disabled={isLoading}
                              className="ml-2 shrink-0"
                            >
                              {isRemoved ? (
                                <>
                                  <RotateCcw className="h-4 w-4" />
                                  <span className="sr-only">Undo removal</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-lg">×</span>
                                  <span className="sr-only">Remove member</span>
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground py-4 text-center border border-dashed rounded-md">
                    No members added yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading || !hasChanges}>
            {getSaveButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
