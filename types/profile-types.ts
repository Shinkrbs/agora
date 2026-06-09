import type { UserRole } from "./database";

export type ProfileFieldErrors = Partial<
  Record<
    | "avatar_url"
    | "username"
    | "first_name"
    | "last_name"
    | "middle_name"
    | "suffix"
    | "email"
    | "currentPassword"
    | "newPassword"
    | "confirmPassword",
    string[]
  >
>;

export type ProfileActionState = {
  success?: string;
  error?: string;
  fieldErrors?: ProfileFieldErrors;
};

export type EditableProfileField =
  | "avatar_url"
  | "username"
  | "first_name"
  | "last_name"
  | "middle_name"
  | "suffix"
  | "email";

export type EditableFieldsByRole = Record<UserRole, EditableProfileField[]>;

export type ProfileEditorProps = {
  initialData: {
    userId: string;
    role: UserRole;
    avatar_url: string | null;
    username: string;
    first_name: string;
    last_name: string;
    middle_name: string | null;
    suffix: string | null;
    email: string;
    created_at: string;
    updated_at: string;
  };
};
