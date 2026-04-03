export type UserRole = "admin" | "superadmin";
export type OrgMemberRole = "owner" | "editor" | "viewer"; // Adjust based on your specific needs

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "verified" | "rejected";
export type ElectionStatus = "draft" | "scheduled" | "active" | "completed" | "cancelled" | "archived";
export type VoterCodeStatus = "unused" | "used" | "revoked";