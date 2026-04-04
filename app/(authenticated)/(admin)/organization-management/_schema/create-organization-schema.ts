import { z } from "zod";

const MAX_FILE_SIZE = 10000000; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const emptyFileToNull = (val: any) => {
  if (val instanceof File && val.size === 0) return null;
  return val;
};

export const createOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  shorthandName: z.string().min(1, "Shorthand is required").max(10, "Max 10 characters"),
  
  logo: z.preprocess(
    emptyFileToNull,
    z.any()
      .optional()
      .nullable()
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .gif formats are supported."
      )
  ),
  
  receipt: z.preprocess(
    emptyFileToNull,
    z.any()
      .refine((file) => file !== null, "Receipt is required")
      .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max file size is 10MB.`)
      .refine(
        (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .gif formats are supported."
      )
  ),
});

export type ActionState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof createOrganizationSchema>, string[]>>;
  success?: boolean;
};