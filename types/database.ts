export type UserRole = "admin" | "superadmin";
export type OrgMemberRole = "owner" | "editor" | "viewer";

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "verified" | "rejected";
export type ElectionStatus = "draft" | "scheduled" | "active" | "completed" | "cancelled" | "archived";
export type VoterCodeStatus = "unused" | "used" | "revoked";

// ==========================================
// USERS & ORGANIZATIONS
// ==========================================
export interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  avatar_url?: string | null;
}

export interface Organization {
  id: string;
  name: string;
  shorthand_name: string;
  invite_code: string;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  logo_url: string | null;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgMemberRole;
  joined_at: string;
  kicked_at: string | null;
}

// ==========================================
// BILLING & LEDGERS
// ==========================================
export interface OrganizationPayment {
  id: string;
  user_id: string;
  organization_id: string;
  amount: number;
  receipt_url: string;
  status: PaymentStatus;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface ElectionPayment {
  id: string;
  user_id: string;
  organization_id: string;
  election_id: string;
  amount: number;
  receipt_url: string;
  status: PaymentStatus;
  verified_by: string | null;
  created_at: string;
  updated_at: string;
}

// ==========================================
// ELECTIONS & VOTING
// ==========================================
export interface ElectionSession {
  id: string;
  title: string;
  organization_id: string;
  start_date: string | null;
  end_date: string | null;
  status: ElectionStatus;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Position {
  id: string;
  election_id: string;
  name: string;
  seat_count: number;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Partylist {
  id: string;
  election_id: string;
  name: string;
  shorthand_name: string;
  description: string;
  logo_url: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Candidate {
  id: string;
  position_id: string;
  partylist_id: string | null; // Null if running independently
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  image_url: string;
  platform: Record<string, unknown> | null; // For the JSON column
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Voter {
  id: string;
  election_id: string;
  student_id: string;
  email: string;
  voting_code: string;
  code_status: VoterCodeStatus;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface Vote {
  id: string;
  voter_id: string;
  candidate_id: string;
  created_at: string;
  is_deleted: boolean;
}

// Profile attributes
export type UserProfileEditable = Pick<
  User,
  "avatar_url" | "username" | "first_name" | "last_name" | "middle_name" | "suffix" | "email"
>;

export type UserProfileReadonly = Pick<
  User,
  "role" | "created_at" | "updated_at"
>;