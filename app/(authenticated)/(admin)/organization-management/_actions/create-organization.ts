"use server";

import { createClient } from "@/lib/supabase/server";
import { ActionState, createOrganizationSchema } from "../_schema/create-organization-schema";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache"; 
import { AGORA_PRICING } from "@/lib/constants";
import { randomUUID } from "crypto"; // <-- Import this natively from Node
import { AppSupabaseClient } from "@/lib/queries/billing-queries";

// ------------------------------------------------------------------
// HELPER FUNCTIONS
// ------------------------------------------------------------------

function generateInviteCode(prefix: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix.toUpperCase()}-${result}`; 
}

export async function uploadFile(supabase: AppSupabaseClient, bucket: string, file: File, folderPath?: string) {
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    
    const filePath = folderPath 
        ? `${folderPath}/${Date.now()}-${safeFileName}` 
        : `${Date.now()}-${safeFileName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
        console.error("File Upload Error:", uploadError);
        return { error: uploadError };
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { url: data.publicUrl };
}

// ------------------------------------------------------------------
// MAIN SERVER ACTION
// ------------------------------------------------------------------

export async function submitForm(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const rawData = {
        name: formData.get("name"),
        shorthandName: formData.get("shorthandName"),
        logo: formData.get("logo"),
        receipt: formData.get("receipt"),
    };

    console.log("Received form data:", rawData);

    const validatedFields = createOrganizationSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            message: "Please check the form for errors.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
        };
    }

    try {
        const supabase = await createClient(await cookies());
        
        // Authenticate
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { message: "Unauthorized. Please log in.", success: false };
        }

        const { logo, receipt, name, shorthandName } = validatedFields.data;

        // Upload Receipt
        const receiptUpload = await uploadFile(supabase, "receipts", receipt);
        if (receiptUpload.error) return { message: "Failed to upload receipt.", success: false };

        const newOrgId = randomUUID(); 

        const { error: orgError } = await supabase
            .from("organizations")
            .insert({
                id: newOrgId,
                name: name,
                shorthand_name: shorthandName,
                logo_url: null, 
                invite_code: generateInviteCode(shorthandName),
                approval_status: "pending",
            });

        if (orgError) {
            console.error("Organization Insert Error:", orgError);
            return { message: "Failed to create organization.", success: false };
        }

        // Insert Member Role using our pre-generated ID
        const { error: memberError } = await supabase
            .from("organization_members")
            .insert({
                organization_id: newOrgId,
                user_id: user.id,
                role: "owner",
            });

        if (memberError) {
            console.error("Member Insert Error:", memberError);
            return { message: "Organization created, but failed to assign ownership.", success: false };
        }

        // Insert Payment Record
        const { error: paymentError } = await supabase
            .from("organization_payments")
            .insert({
                user_id: user.id,
                organization_id: newOrgId,
                amount: AGORA_PRICING.ORGANIZATION_REGISTRATION_FEE,
                receipt_url: receiptUpload.url,
                status: "pending",
            });

        if (paymentError) {
            console.error("Payment Insert Error:", paymentError);
        }

        // Upload Logo
        if (logo) {
            const logoUpload = await uploadFile(supabase, "organizations", logo, newOrgId);
            
            if (!logoUpload.error && logoUpload.url) {
                await supabase
                    .from("organizations")
                    .update({ logo_url: logoUpload.url })
                    .eq("id", newOrgId);
            } else {
                console.error("Failed to upload logo after org creation.");
            }
        }

        revalidatePath("/admin/organization-management"); 
        return { message: "Organization created successfully!", success: true };

    } catch (error) {
        console.error("Unexpected error:", error);
        return { message: "A server error occurred. Please try again.", success: false };
    }
}