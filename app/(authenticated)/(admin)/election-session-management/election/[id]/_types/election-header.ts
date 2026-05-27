import { ElectionStatus, PaymentStatus } from "@/types/database";

export interface ElectionHeaderData {
  id: string;
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ElectionStatus;
  paymentStatus: PaymentStatus;
  isSetupComplete: boolean;
  totalVoters: number;
  totalCandidates: number;
  totalPositions: number;
  votedCount: number;
  sentCount: number;
}