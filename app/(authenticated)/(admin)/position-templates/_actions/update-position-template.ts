'use server';

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { PositionTemplate } from "@/types/database";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updatePositionTemplate(
  templateId: string,
  templateData: Pick<PositionTemplate, 'name' | 'positions'>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      redirect("/login");
    }

    const { error } = await supabase
      .from("position_templates")
      .update({
        name: templateData.name,
        positions: templateData.positions,
      })
      .eq("id", templateId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/position-templates");
    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred: " + (error as Error).message,
    };
  }
}
