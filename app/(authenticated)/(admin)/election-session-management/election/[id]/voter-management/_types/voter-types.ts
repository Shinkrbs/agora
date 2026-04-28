import { VoterCodeStatus } from "@/types/database";

export interface VoterTableRow {
  id: string;
  student_id: string;
  email: string;
  voting_code: string;
  code_status: VoterCodeStatus;
}
