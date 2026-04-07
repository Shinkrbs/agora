"use server";

import { cookies } from "next/headers";
import { createElectionSchema } from "../_schemas/create-election-schema";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { DEFAULT_POSITIONS } from "../templates/position-templates";
import { isMemberOfOrganization } from "../_queries/election-sessions";

export async function createElectionAction(
  prevState: any,
  formData: FormData
) {
  try {
    const title = formData.get("title");
    const organization_id = formData.get("organization_id");

    const validatedData = createElectionSchema.parse({
      title,
      organization_id,
    });

    const cookieStore = await cookies();
    const supabase = await createClient(cookieStore);
    const user = await getCurrentUser();

    if(!user) {
      throw new Error("Unauthorized");
    }

    if(! (await isMemberOfOrganization(validatedData.organization_id))) {
      throw new Error("User is not a member of the organization");
    }

    const { data: electionData, error: electionError } = await supabase.from("election_sessions").insert({
      title: validatedData.title,
      organization_id: validatedData.organization_id,
      status: "draft",
    }).select("*").single();

    if(electionError) {
      console.error("Failed to create election:", electionError);
      throw new Error(electionError.message);
    }

    const { error: positionError } = await supabase.from("positions").insert(DEFAULT_POSITIONS.map((position) => ({
      ...position,
      election_id: electionData.id,
    })));

    if(positionError) {
      console.error("Failed to create default positions:", positionError);
      throw new Error(positionError.message);
    }

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
