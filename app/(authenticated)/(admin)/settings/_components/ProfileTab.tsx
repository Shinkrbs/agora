"use client";

import { Organization } from "@/types/database";
import { useActionState, useEffect, useState } from "react";
import { updateOrgProfile } from "../_actions/update-org-profile";
import { UpdateOrgProfileState } from "../_schema/update-org-profile-schema";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import Image from "next/image";

interface ProfileTabProps {
  organization: Organization;
}

export function ProfileTab({ organization }: ProfileTabProps) {
  const [state, formAction, isPending] = useActionState<UpdateOrgProfileState, FormData>(
    updateOrgProfile,
    { message: "", success: undefined }
  );

  const [uiState, setUiState] = useState({
    name: organization.name,
    shorthandName: organization.shorthand_name,
    logoFile: null as File | null,
    logoPreview: organization.logo_url || null,
  });

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message);
    } else if (state.success === false) {
      toast.error(state.message);
    }
  }, [state]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUiState((prev) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUiState((p) => ({
            ...p,
            logoFile: file,
            logoPreview: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
        return prev;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Organization Profile</CardTitle>
            <CardDescription>
              Manage your organization's identity and basic information.
            </CardDescription>
          </div>
          <Badge className={getStatusColor(organization.approval_status)} variant="outline">
            {organization.approval_status.charAt(0).toUpperCase() + organization.approval_status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6 max-w-2xl">
          <input type="hidden" name="organizationId" value={organization.id} />
          
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input 
              id="name" 
              name="name" 
              value={uiState.name}
              onChange={(e) => setUiState((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Computer Science Society"
            />
            {state.errors?.name && (
              <p className="text-sm text-destructive">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shorthandName">Shorthand Name</Label>
            <Input 
              id="shorthandName" 
              name="shorthandName" 
              value={uiState.shorthandName}
              onChange={(e) => setUiState((prev) => ({ ...prev, shorthandName: e.target.value }))}
              placeholder="e.g. CSS"
              maxLength={10}
            />
            {state.errors?.shorthandName && (
              <p className="text-sm text-destructive">{state.errors.shorthandName[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Organization Logo (Optional)</Label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 max-w-sm">
              <input
                id="logo"
                name="logo"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                onChange={handleLogoChange}
                className="hidden"
              />
              <label htmlFor="logo" className="flex flex-col items-center justify-center cursor-pointer">
                {uiState.logoPreview && typeof uiState.logoPreview === "string" ? (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-lg overflow-hidden">
                      <Image
                        src={uiState.logoPreview}
                        alt="Logo preview"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      {uiState.logoFile ? uiState.logoFile.name : "Current logo"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Click to change</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                      Click to upload logo
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </label>
            </div>
            {state.errors?.logo && (
              <p className="text-sm text-destructive">{state.errors.logo[0]}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving changes..." : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
