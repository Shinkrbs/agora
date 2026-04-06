import { z } from "zod";

export const createElectionSchema = z.object({
  title: z
    .string()
    .min(1, "Election title is required")
    .min(3, "Election title must be at least 3 characters")
    .max(255, "Election title must be less than 255 characters"),
});

export type CreateElectionInput = z.infer<typeof createElectionSchema>;
