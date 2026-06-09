"use server";

import { cookies } from "next/headers";
import { createElectionSchema } from "../_schemas/create-election-schema";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { isMemberOfOrganization } from "../_queries/election-sessions";
import { fetchPositionTemplatebyId } from "../_queries/fetch-position-template"; // Adjust path as needed
import { revalidatePath } from "next/cache";

export async function createElectionAction(
  prevState: any,
  formData: FormData
) {
  try {
    const title = formData.get("title");
    const organization_id = formData.get("organization_id");
    const position_template_id = formData.get("position_template_id");

    const validatedData = createElectionSchema.parse({
      title,
      organization_id,
      position_template_id,
    });

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const user = await getCurrentUser();

    if (!user) {
      throw new Error("Unauthorized");
    }

    if (!(await isMemberOfOrganization(validatedData.organization_id))) {
      throw new Error("User is not a member of the organization");
    }

    // 1. Fetch the selected template to get the positions
    const { data: template, error: templateError } = await fetchPositionTemplatebyId(validatedData.position_template_id);

    if (templateError || !template) {
      console.error("Failed to fetch template:", templateError);
      throw new Error("Failed to load the selected position template.");
    }

    if (!template.positions || template.positions.length === 0) {
      throw new Error("The selected template has no positions.");
    }

    // 2. Insert the Election Session
    const { data: electionData, error: electionError } = await supabase.from("election_sessions").insert({
      title: validatedData.title,
      organization_id: validatedData.organization_id,
      status: "draft",
    }).select("*").single();

    if (electionError) {
      console.error("Failed to create election:", electionError);
      throw new Error(electionError.message);
    }

    // 3. Map over the template's positions and insert them
    const positionsToInsert = template.positions.map((position) => ({
      name: position.name,
      seat_count: position.seat_count,
      election_id: electionData.id,
    }));

    const { error: positionError } = await supabase.from("positions").insert(positionsToInsert);

    if (positionError) {
      console.error("Failed to create positions:", positionError);
      throw new Error(positionError.message);
    }
    revalidatePath("/election-session-management")
    return {
      message: "Election created successfully",
      error: null,
    };
  } catch (error: any) {
    console.error("Failed to create election:", error);
    return {
      message: null,
      error: error.message || "Failed to create election",
    };
  }
}