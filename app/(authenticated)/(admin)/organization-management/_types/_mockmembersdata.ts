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
  // --- New Mock Users Below ---
  {
    id: "usr_004",
    username: "areyes",
    first_name: "Ana",
    last_name: "Reyes",
    middle_name: "Garcia",
    suffix: null,
    email: "ana.reyes@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-01-20T08:00:00Z",
    updated_at: "2024-01-20T08:00:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_004",
  },
  {
    id: "usr_005",
    username: "mvillanueva",
    first_name: "Mark Anthony",
    last_name: "Villanueva",
    middle_name: null,
    suffix: null,
    email: "mark.villanueva@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2023-12-01T09:00:00Z",
    updated_at: "2024-01-05T10:00:00Z",
    is_deleted: false,
    avatar_url: null,
  },
  {
    id: "usr_006",
    username: "slim",
    first_name: "Sarah Jane",
    last_name: "Lim",
    middle_name: "Tan",
    suffix: null,
    email: "sarah.lim@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-03-01T14:30:00Z",
    updated_at: "2024-03-02T08:15:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_006",
  },
  {
    id: "usr_007",
    username: "mchen",
    first_name: "Michael",
    last_name: "Chen",
    middle_name: null,
    suffix: null,
    email: "michael.chen@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2023-10-15T11:20:00Z",
    updated_at: "2023-10-15T11:20:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_007",
  },
  {
    id: "usr_008",
    username: "dgonzales",
    first_name: "David",
    last_name: "Gonzales",
    middle_name: "Perez",
    suffix: "III",
    email: "david.gonzales@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-02-28T09:45:00Z",
    updated_at: "2024-03-10T16:00:00Z",
    is_deleted: false,
    avatar_url: null,
  },
  {
    id: "usr_009",
    username: "ecruz",
    first_name: "Elena",
    last_name: "Cruz",
    middle_name: "Mendoza",
    suffix: null,
    email: "elena.cruz@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-01-10T13:00:00Z",
    updated_at: "2024-02-01T10:30:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_009",
  },
  {
    id: "usr_010",
    username: "jyap",
    first_name: "James",
    last_name: "Yap",
    middle_name: null,
    suffix: null,
    email: "james.yap@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2023-09-05T08:20:00Z",
    updated_at: "2023-11-20T14:15:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_010",
  },
  {
    id: "usr_011",
    username: "pbautista",
    first_name: "Patricia",
    last_name: "Bautista",
    middle_name: "Flores",
    suffix: null,
    email: "patricia.bautista@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2024-03-15T10:10:00Z",
    updated_at: "2024-03-15T10:10:00Z",
    is_deleted: false,
    avatar_url: "https://i.pravatar.cc/150?u=usr_011",
  },
  {
    id: "usr_012",
    username: "rsy",
    first_name: "Robert",
    last_name: "Sy",
    middle_name: null,
    suffix: "Jr.",
    email: "robert.sy@vsu.edu.ph",
    role: "STUDENT",
    created_at: "2023-11-25T15:45:00Z",
    updated_at: "2024-01-10T09:00:00Z",
    is_deleted: false,
    avatar_url: null,
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
  // --- New Mock Organization Members Below ---
  {
    id: "org_mem_104",
    organization_id: "org_cherai_01",
    user_id: "usr_004",
    role: "MEMBER",
    joined_at: "2024-01-25T09:00:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_105",
    organization_id: "org_cherai_01",
    user_id: "usr_005",
    role: "MEMBER",
    joined_at: "2023-12-10T14:30:00Z",
    kicked_at: "2024-02-01T10:00:00Z", // Kicked member
  },
  {
    id: "org_mem_106",
    organization_id: "org_cherai_01",
    user_id: "usr_006",
    role: "ADMIN",
    joined_at: "2024-03-05T11:15:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_107",
    organization_id: "org_cherai_01",
    user_id: "usr_007",
    role: "MEMBER",
    joined_at: "2023-11-01T08:45:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_108",
    organization_id: "org_cherai_01",
    user_id: "usr_008",
    role: "MEMBER",
    joined_at: "2024-03-01T13:20:00Z",
    kicked_at: "2024-03-15T09:30:00Z", // Kicked member
  },
  {
    id: "org_mem_109",
    organization_id: "org_cherai_01",
    user_id: "usr_009",
    role: "MEMBER",
    joined_at: "2024-01-15T16:00:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_110",
    organization_id: "org_cherai_01",
    user_id: "usr_010",
    role: "MEMBER",
    joined_at: "2023-09-20T10:10:00Z",
    kicked_at: null,
  },
  {
    id: "org_mem_111",
    organization_id: "org_cherai_01",
    user_id: "usr_011",
    role: "ADMIN",
    joined_at: "2024-03-16T08:00:00Z",
    kicked_at: "2024-04-01T14:45:00Z", // Kicked Admin
  },
  {
    id: "org_mem_112",
    organization_id: "org_cherai_01",
    user_id: "usr_012",
    role: "MEMBER",
    joined_at: "2023-12-05T11:30:00Z",
    kicked_at: null,
  },
];
// Combined Data with dynamically mapped UI fields
const mapMockMemberDetails = (member: OrganizationMember): MemberDetails => {
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
};

// New helper function to get members scoped to a specific organization
export const getMockMembersForOrg = (orgId: string): MemberDetails[] =>
  mockOrganizationMembers
    .filter((member) => member.organization_id === orgId)
    .map(mapMockMemberDetails);

// Keeping this for backward compatibility or global views
export const mockCombinedMembers: MemberDetails[] =
  mockOrganizationMembers.map(mapMockMemberDetails);
