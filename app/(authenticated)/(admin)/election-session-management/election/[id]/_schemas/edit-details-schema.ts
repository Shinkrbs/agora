import * as z from "zod";

export const editElectionDetailsSchema = z.object({
  title: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
}).refine(
  (data) => {
    // Only validate if both dates are provided
    if (!data.startDate || !data.endDate) return true;
    
    // Compare the dates
    return new Date(data.startDate) <= new Date(data.endDate);
  },
  {
    message: "Start date cannot be later than end date",
    path: ["startDate"], // Show error on startDate field
  }
);

export type EditElectionDetailsSchema = z.infer<typeof editElectionDetailsSchema>;