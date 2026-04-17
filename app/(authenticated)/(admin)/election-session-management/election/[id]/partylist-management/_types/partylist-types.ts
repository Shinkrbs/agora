import { Partylist } from "@/types/database";

export interface PartylistWithCandidateCount extends Partylist {
  candidate_count: number;
}