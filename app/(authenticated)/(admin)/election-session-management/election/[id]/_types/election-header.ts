import { ElectionStatus, PaymentStatus } from "@/types/database";

export interface ElectionHeaderData {
  title: string | null;
  startDate: string | null;
  endDate: string | null;
  status: ElectionStatus;
  paymentStatus: PaymentStatus;
  isSetupComplete: boolean;
}