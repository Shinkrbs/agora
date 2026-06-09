"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
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
import { createPartylist } from "../_actions/create-partylist";
import Image from "next/image";

interface CreatePartylistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  electionId: string;
  onSuccess: () => void;
}

export function CreatePartylistModal({
  open,
  onOpenChange,
  organizationId,
  electionId,
  onSuccess,
}: CreatePartylistModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Partylist name is required");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("organization_id", organizationId);
      formData.append("election_id", electionId);
      formData.append("name", name);
      formData.append("description", description);
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const result = await createPartylist(formData);

      if (result.success) {
        // Reset form
        setName("");
        setDescription("");
        setLogoFile(null);
        setLogoPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(result.error || "Failed to create partylist");
      }
    } catch (error) {
      console.error("Create error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Partylist</DialogTitle>
          <DialogDescription>
            Create a new partylist for this election
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="partylist-name">
              Partylist Name <span className="text-destructive">*</span>
            </Label>
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
              placeholder="Enter partylist description (optional)"
              disabled={isLoading}
              className="w-full min-h-20 px-3 py-2 border border-input rounded-md bg-background text-foreground placeholder-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          {/* Logo Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="partylist-logo">Logo (Optional)</Label>
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

          {/* Logo Preview */}
          {logoPreview && (
            <div className="space-y-2">
              <Label>Logo Preview</Label>
              <div className="relative inline-block">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-24 w-24 object-cover rounded-md border border-input"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemoveLogo}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove logo</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Partylist"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
