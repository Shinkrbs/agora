import { Candidate } from "@/types/database";

/**
 * Candidate with joined relations (Position and Partylist data)
 */
export interface CandidateWithRelations extends Candidate {
  position?: {
    name: string;
  };
  partylist?: {
    name: string;
    shorthand_name: string;
  } | null;
}

/**
 * Flattened table row for the data table UI
 */
export interface CandidateTableRow {
  // Basic info
  id: string;
  image_url: string | null;
  full_name: string; // Combined: first_name middle_name last_name suffix
  
  // Position info
  position_id: string;
  position_name: string;
  
  // Partylist info
  partylist_id: string | null;
  partylist_name: string | null;
  partylist_shorthand: string | null;
  is_independent: boolean; // True if partylist_id is null
  
  // Platform info
  has_platform: boolean; // Derived from platform JSON column
  
  // Original candidate for modals
  raw_candidate: CandidateWithRelations;
}

/**
 * Form data for creating/editing a candidate
 */
export interface CandidateFormData {
  first_name: string;
  last_name: string;
  middle_name: string | null;
  suffix: string | null;
  position_id: string;
  partylist_id: string | null;
  vision: string; // Candidate's vision statement
  key_projects: string[]; // Array of key projects
}
