"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { editElectionDetailsSchema } from "../_schemas/edit-details-schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function editElectionDetailsAction(electionId: string, _prevState: unknown, formData: FormData) {
    const validatedData = editElectionDetailsSchema.safeParse({
        title: formData.get("title") as string,
        startDate: formData.get("start-date") as string,
        endDate: formData.get("end-date") as string,
    });

    if(!validatedData.success) {
        console.error("Validation error:", validatedData.error);
        return { error: "Invalid input data" };
    }

    try {
        const cookieStore = await cookies();
        const supabase = await createClient(cookieStore);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            redirect("/login");
        }

        const { error } = await supabase.from("election_sessions").update({
            title: validatedData.data.title,
            start_date: validatedData.data.startDate,
            end_date: validatedData.data.endDate,
        }).eq("id", electionId).select().single();

        if (error) {
            console.error("Error updating election details:", error);
            return { error: "Failed to update election details" };
        }
        revalidatePath(`/election-session-management/election/${electionId}`);
        return { message: "Election details updated successfully" };
    } catch (error) {
        console.error("Error updating election details:", error);
        return { error: "An unexpected error occurred" };
    }
}