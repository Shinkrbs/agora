"use server";

import { getCurrentUser } from "@/lib/queries/users-queries";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateElectionPayments(
  paymentId: string,
  newStatus: "verified" | "rejected"
): Promise<{ success: boolean; message: string; electionId?: string }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const user = await getCurrentUser();

    if (!user) {
      return { success: false, message: "Unauthorized" };
    }
    if(user.role !== "superadmin"){
      return { success: false, message: "Forbidden" };
    }

    const { data: paymentData, error: fetchError } = await supabase
      .from("election_payments")
      .select("election_id, status")
      .eq("id", paymentId)
      .single();

    if (fetchError || !paymentData) {
      return { success: false, message: "Payment not found" };
    }

    if(paymentData.status !== 'pending'){
      return { success: false, message: "Only pending payments can be updated" };
    }

    const electionId = paymentData.election_id;

    const { error: paymentError } = await supabase
      .from("election_payments")
      .update({
        status: newStatus,
        verified_by: user.id,
      })
      .eq("id", paymentId);

    if (paymentError) {
      return { success: false, message: "Failed to update payment status" };
    }

    revalidatePath("/payments-management");
    return {
      success: true,
      message: "Payment status updated successfully",
      electionId,
    };
    
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}
