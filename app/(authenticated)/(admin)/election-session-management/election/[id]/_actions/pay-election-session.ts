"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { ElectionPaymentType } from "../_types/election-payment-type";
import { redirect } from "next/navigation";
import { uploadFile } from "@/app/(authenticated)/(admin)/organization-management/_actions/create-organization";

export async function payElectionSessionAction(
    electionPayment: ElectionPaymentType,
    receipt: File
): Promise<{ success: boolean; message: string }> {
    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            redirect("/login");
        }

        // Upload receipt
        const receiptUpload = await uploadFile(supabase, "receipts", receipt);
        if (receiptUpload.error) {
            return { success: false, message: "Failed to upload receipt" };
        }

        const { error } = await supabase.from("election_payments").insert({
            user_id: session.user.id,
            organization_id: electionPayment.organization_id,
            election_id: electionPayment.election_id,
            amount: electionPayment.amount,
            receipt_url: receiptUpload.url,
            status: electionPayment.status,
        });

        if (error) {
            console.error("Error processing payment:", error);
            return { success: false, message: "Failed to process payment" };
        }

        // Update election status to scheduled
        const { error: updateError } = await supabase
            .from("election_sessions")
            .update({ status: "scheduled" })
            .eq("id", electionPayment.election_id);

        if (updateError) {
            console.error("Error updating election status:", updateError);
            return { success: false, message: "Payment processed but failed to update election status" };
        }

        return { success: true, message: "Payment processed successfully and election scheduled" };
    } catch (error) {
        console.error("Error processing payment:", error);
        return { success: false, message: "An unexpected error occurred" };
    }
}