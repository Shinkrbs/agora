"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { OrganizationPaymentRowData } from "../_types/payment-types";
import { getCurrentUser } from "@/lib/queries/users-queries";

export async function getOrganizationPayments(): Promise<{ data: OrganizationPaymentRowData[], message: string | null, error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const user = await getCurrentUser();

    if (!user) {
      return { data: [], message: null, error: "Unauthorized" };
    }
    if(user.role !== "superadmin"){
      return { data: [], message: null, error: "Forbidden" };
    }

    const { data, error } = await supabase
      .from("organization_payments")
      .select("*, users!organization_payments_user_id_fkey(first_name, last_name, email), organizations!organization_payments_organization_id_fkey(name, shorthand_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching organization payments:", error);
      return { data: [], message: null, error: error.message };
    }

    const validData = (data || []).filter((payment: any) => payment.organizations !== null);

    const transformedData = await Promise.all(
      validData.map(async (payment: any) => {
        let secureUrl = payment.receipt_url;

        if (secureUrl && secureUrl.includes("/public/receipts/")) {
          const filePath = secureUrl.split("/public/receipts/")[1];
          
          // Generate a signed URL valid for 1 day (86400 seconds)
          const { data: signedData, error: signError } = await supabase.storage
            .from("receipts")
            .createSignedUrl(filePath, 86400);

          if (signedData?.signedUrl) {
            secureUrl = signedData.signedUrl;
          } else {
            console.error("Failed to sign URL for:", filePath, signError);
          }
        }

        return {
          ...payment,
          receipt_url: secureUrl,
        } as OrganizationPaymentRowData;
      })
    );

    return { data: transformedData, message: null, error: null };
    
  } catch (error) {
    console.error("Unexpected error:", error);
    return { data: [], message: null, error: "An unexpected error occurred." };
  }
}