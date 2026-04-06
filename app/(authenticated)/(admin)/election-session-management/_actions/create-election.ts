"use server";

import { createElectionSchema } from "../_schemas/create-election-schema";

export async function createElectionAction(
  prevState: any,
  formData: FormData
) {
  try {
    // Parse form data
    const title = formData.get("title");

    // Validate against schema
    const validatedData = createElectionSchema.parse({
      title,
    });

    // TODO: Implement server action logic
    // - Get current organization from context/auth
    // - Create election in database
    // - Handle any business logic

    return {
      message: "Election created successfully",
      error: null,
    };
  } catch (error: any) {
    return {
      message: null,
      error: error.message || "Failed to create election",
    };
  }
}
