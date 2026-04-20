// app/live-election/lib/mock-data.ts
import {
  ElectionSession,
  Position,
  Partylist,
  Candidate,
} from "@/types/database"; // Adjust path as needed

// 1. Election Session
export const currentElection: ElectionSession = {
  id: "elec-123",
  title: "VSU Supreme Student Council Elections 2026",
  organization_id: "org-vsu-ssc",
  start_date: "2026-04-20T08:00:00Z",
  end_date: "2026-04-21T17:00:00Z",
  status: "active",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
};

// 2. Partylists
export const partylists: Record<string, Partylist> = {
  "party-1": {
    id: "party-1",
    election_id: "elec-123",
    name: "Alyansang Tapat",
    shorthand_name: "AT",
    description: "Progressive student leadership.",
    logo_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  "party-2": {
    id: "party-2",
    election_id: "elec-123",
    name: "Lakas Estudyante",
    shorthand_name: "LE",
    description: "Action-driven governance.",
    logo_url: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
};

// 3. Positions
export const positions: Position[] = [
  {
    id: "pos-pres",
    election_id: "elec-123",
    name: "Student Body President",
    seat_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
  {
    id: "pos-senator",
    election_id: "elec-123",
    name: "Senators",
    seat_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  },
];

// 4. Candidates with Mock Vote Data
// We extend the Candidate type locally just for the UI to include vote counts.
export interface CandidateWithVotes extends Candidate {
  vote_count: number;
  percentage: number;
  color_hex: string;
}

export const presidentCandidates: CandidateWithVotes[] = [
  {
    id: "cand-1",
    position_id: "pos-pres",
    election_id: "elec-123",
    partylist_id: "party-1",
    first_name: "Mia",
    last_name: "Chen",
    middle_name: null,
    suffix: null,
    image_url: null,
    platform: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
    vote_count: 4253,
    percentage: 54.4,
    color_hex: "#2563eb", // Blue
  },
  {
    id: "cand-2",
    position_id: "pos-pres",
    election_id: "elec-123",
    partylist_id: "party-2",
    first_name: "Ravi",
    last_name: "Patel",
    middle_name: null,
    suffix: null,
    image_url: null,
    platform: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
    vote_count: 3561,
    percentage: 45.6,
    color_hex: "#16a34a", // Green
  },
];

// 5. Overall Stats
export const electionStats = {
  totalBallotsCast: 7814,
  reportingPercentage: 84,
  lastUpdated: "Just now",
};
