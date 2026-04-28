export type VoterCodeStatus = 'PENDING' | 'VOTED';

export interface VoterTableRow {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  voting_code: string;
  code_status: VoterCodeStatus;
}
