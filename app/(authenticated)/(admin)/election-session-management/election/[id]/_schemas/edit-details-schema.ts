import * as z from "zod";

export const editElectionDetailsSchema = z.object({
  title: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type EditElectionDetailsSchema = z.infer<typeof editElectionDetailsSchema>;