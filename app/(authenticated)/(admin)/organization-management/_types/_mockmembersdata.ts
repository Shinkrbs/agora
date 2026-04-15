// --- Types ---

export type UserRole = "SUPER_ADMIN" | "UNIVERSITY_ADMIN" | "STUDENT";
export type OrgMemberRole = "OWNER" | "ADMIN" | "MEMBER";

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

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgMemberRole;
  joined_at: string;
  kicked_at: string | null;
}

export interface MemberDetails extends OrganizationMember {
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string | null;
}

// --- Mock Data ---

export const mockUsers: User[] = [
  {
    id: "usr_001",
    username: "jdelacruz",
    first_name: "Juan",
    last_name: "Dela Cruz",
    middle_name: "Santos",
    suffix: null,
    email: "juan.delacruz@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-01-15T08:00:00Z",
    updated_at: "2024-01-15T08:00:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_001",
  },
  {
    id: "usr_002",
    username: "mramos",
    first_name: "Maria",
    last_name: "Ramos",
    middle_name: null,
    suffix: null,
    email: "maria.ramos@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-02-10T09:30:00Z",
    updated_at: "2024-02-12T10:15:00Z",
    is_deleted: false,
    avatar_url: null,
  },
  {
    id: "usr_003",
    username: "sbeef",
    first_name: "Steve",
    last_name: "Beef",
    middle_name: "Angus",
    suffix: "Jr.",
    email: "23-1-01635@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2023-11-05T14:20:00Z",
    updated_at: "2024-03-01T11:00:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_003",
  },
];

export const mockOrganizationMembers: OrganizationMember[] = [
  {
    id: "org_mem_101",
    organization_id: "org_cherai_01",
    user_id: "usr_003",
    role: "OWNER",
    joined_at: "2023-11-10T10:00:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_102",
    organization_id: "org_cherai_01",
    user_id: "usr_001",
    role: "ADMIN",
    joined_at: "2024-01-20T13:45:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_103",
    organization_id: "org_cherai_01",
    user_id: "usr_002",
    role: "MEMBER",
    joined_at: "2024-02-15T16:20:00Z",
    kicked_at: null,
  },
];

// Combined Data with dynamically mapped UI fields
export const mockCombinedMembers: MemberDetails[] = mockOrganizationMembers.map(
  (member) => {
    // Find the associated user for this member
    const user = mockUsers.find((u) => u.id === member.user_id);

    return {
      ...member,
      // Flatten the requested user details directly onto the member object
      first_name: user?.first_name || "Unknown",
      last_name: user?.last_name || "Unknown",
      email: user?.email || "No email provided",
      avatar_url: user?.avatar_url || null,
    };
  },
);
