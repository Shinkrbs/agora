"use server";

import { getCurrentUser } from "@/lib/queries/users-queries";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function updateOrganizationPayments(
  paymentId: string,
  newStatus: "verified" | "rejected"
): Promise<{ success: boolean; message: string; organizationId?: string }> {
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
      .from("organization_payments")
      .select("organization_id, status")
      .eq("id", paymentId)
      .single();

    if (fetchError || !paymentData) {
      return { success: false, message: "Payment not found" };
    }

    if(paymentData.status !== 'pending'){
      return { success: false, message: "Only pending payments can be updated" };
    }

    const organizationId = paymentData.organization_id;

    const { error: paymentError } = await supabase
      .from("organization_payments")
      .update({
        status: newStatus,
        verified_by: user.id,
      })
      .eq("id", paymentId);

    if (paymentError) {
      return { success: false, message: "Failed to update payment status" };
    }

    const approvalStatus = newStatus === "verified" ? "approved" : "rejected";
    const { error: orgError } = await supabase
      .from("organizations")
      .update({
        approval_status: approvalStatus,
      })
      .eq("id", organizationId);

    if (orgError) {
      console.error("Error updating organization approval status:", orgError);
      return { success: false, message: "Payment updated but failed to update organization status" };
    }
    revalidatePath("/payments-management");
    return {
      success: true,
      message: "Payment status updated successfully",
      organizationId,
    };
    
  } catch (error) {
    console.error("Error updating payment status:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}