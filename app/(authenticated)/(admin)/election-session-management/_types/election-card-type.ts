import { ElectionStatus, PaymentStatus } from "@/types/database";

export interface ElectionCardSummary {
  id: string;
  title: string;
  status: ElectionStatus;
  start_date: string | null;
  end_date: string | null;
  payment_status: PaymentStatus; 
  turnout_percentage: number | null; 
}