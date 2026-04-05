import { PaymentStatus } from "@/types/database";

export interface OrganizationPaymentRowData {
  id: string;
  amount: number;
  receipt_url: string;
  status: PaymentStatus;
  created_at: string;
  users: {
    first_name: string;
    last_name: string;
    email: string;
  };
  organizations: {
    name: string;
    shorthand_name: string;
  };
}