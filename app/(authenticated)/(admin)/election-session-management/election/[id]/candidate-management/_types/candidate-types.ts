import { Candidate } from "@/types/database";

/**
 * Platform data structure for candidate
 */
export interface CandidatePlatform {
  vision: string;
  key_projects: string[];
}

export interface CandidateWithRelations extends Candidate {
  position?: {
    name: string;
  };
  partylist?: {
    name: string;
    shorthand_name: string;
  } | null;
}

export interface CandidateTableRow {
  id: string;
  image_url: string | null;
  full_name: string; 
  
  position_id: string;
  position_name: string;
  
  partylist_id: string | null;
  partylist_name: string | null;
  partylist_shorthand: string | null;
  is_independent: boolean; 
  
  has_platform: boolean; 
  
  raw_candidate: CandidateWithRelations;
}

export interface CandidateFormData {
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  position_id: string;
  partylist_id: string | null;
  vision: string; 
  key_projects: string[]; 
}
