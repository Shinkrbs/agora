import { PaymentStatus } from "@/types/database";

export type ElectionPaymentType = {
    user_id: string | null;
    organization_id: string;
    election_id: string;
    amount: number;
    receipt_url: string;
    status: PaymentStatus;
}