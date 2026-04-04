"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Upload, User, Mail, LockKeyhole, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  updateProfileAction,
  changePasswordAction,
} from "@/lib/actions/profile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileEditorProps, ProfileActionState } from "@/types/profile-types";

const initialActionState: ProfileActionState = {};

export function ProfileEditor({ initialData }: ProfileEditorProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initialActionState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    changePasswordAction,
    initialActionState,
  );

  const [isUploading, startUpload] = useTransition();
  const [avatarUrl, setAvatarUrl] = useState(initialData.avatar_url ?? "");
  const [username, setUsername] = useState(initialData.username);
  const [firstName, setFirstName] = useState(initialData.first_name);
  const [lastName, setLastName] = useState(initialData.last_name);
  const [middleName, setMiddleName] = useState(initialData.middle_name ?? "");
  const [suffix, setSuffix] = useState(initialData.suffix ?? "");
  const [email, setEmail] = useState(initialData.email);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const suffixOptions = ["", "Jr.", "Sr.", "II", "III", "IV", "V"];

  const editableByRole: Record<"admin" | "superadmin", string[]> = {
    admin: [
      "avatar_url",
      "username",
      "first_name",
      "last_name",
      "middle_name",
      "suffix",
      "email",
    ],
    superadmin: [
      "avatar_url",
      "username",
      "first_name",
      "last_name",
      "middle_name",
      "suffix",
      "email",
    ],
  };

  const canEdit = (field: string) =>
    editableByRole[initialData.role].includes(field);

  const handleAvatarUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    startUpload(async () => {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "png";
      const filePath = `${initialData.userId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) return;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      if (data.publicUrl) setAvatarUrl(data.publicUrl);
    });
  };

  const initials =
    initialData.username?.trim()?.slice(0, 2)?.toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Edit profile</CardTitle>
          <CardDescription>Update your account information.</CardDescription>
        </CardHeader>

        <CardContent>
          <form action={profileAction} className="space-y-6">
            <input type="hidden" name="avatar_url" value={avatarUrl} />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 sm:justify-start sm:gap-4">
                <Avatar className="size-16 sm:size-24">
                  <AvatarImage
                    src={avatarUrl || "/default-avatar.png"}
                    alt="Profile avatar"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-2 sm:flex-none">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    className="hidden"
                    onChange={(e) => handleAvatarUpload(e.target.files?.[0])}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={!canEdit("avatar_url") || isUploading}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isUploading ? "Uploading..." : "Upload new image"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    At least 800x800 px recommended. JPG, PNG, GIF allowed.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="pl-9"
                  disabled={!canEdit("username")}
                />
              </div>
              {profileState?.fieldErrors?.username?.[0] && (
                <p className="text-xs text-red-500">
                  {profileState.fieldErrors.username[0]}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">First name</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!canEdit("first_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last name</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!canEdit("last_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle_name">Middle name</Label>
                <Input
                  id="middle_name"
                  name="middle_name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  disabled={!canEdit("middle_name")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="suffix">Suffix</Label>
                <input type="hidden" name="suffix" value={suffix} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      id="suffix"
                      type="button"
                      disabled={!canEdit("suffix")}
                      className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-2.5 py-1 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                    >
                      <span>{suffix || "None"}</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  >
                    {suffixOptions.map((option) => (
                      <DropdownMenuItem
                        key={option || "none"}
                        onClick={() => setSuffix(option)}
                      >
                        {option || "None"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  disabled={!canEdit("email")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={initialData.role} disabled />
              </div>
              <div className="space-y-1">
                <Label htmlFor="created_at">Created at</Label>
                <Input
                  id="created_at"
                  value={new Date(initialData.created_at).toLocaleString()}
                  disabled
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="updated_at">Updated at</Label>
                <Input
                  id="updated_at"
                  value={new Date(initialData.updated_at).toLocaleString()}
                  disabled
                />
              </div>
            </div>

            {profileState?.error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                {profileState.error}
              </p>
            )}
            {profileState?.success && (
              <p className="rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                {profileState.success}
              </p>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl"
              disabled={profilePending || isUploading}
            >
              {profilePending ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LockKeyhole className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Use at least 8 characters for better security.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={passwordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                minLength={8}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                minLength={8}
              />
              {passwordState?.fieldErrors?.confirmPassword?.[0] && (
                <p className="text-xs text-red-500">
                  {passwordState.fieldErrors.confirmPassword[0]}
                </p>
              )}
            </div>

            {passwordState?.error && (
              <p className="rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                {passwordState.error}
              </p>
            )}
            {passwordState?.success && (
              <p className="rounded-md border border-green-200 bg-green-50 p-2 text-sm text-green-700">
                {passwordState.success}
              </p>
            )}

            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={passwordPending}
            >
              {passwordPending ? "Updating..." : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
