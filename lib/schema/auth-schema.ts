import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email address."),
  password: z.string(),
});

export const signUpSchema = z
  .object({
    first_name: z.string().min(1, "This field must not be empty."),
    middle_name: z.string(),
    last_name: z.string().min(1, "This field must not be empty."),
    suffix: z.string(),
    username: z
      .string()
      .min(8, "Usernames must be at least 8 characters long."),
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Passwords must be at least 8 characters long."),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type LoginSchema = z.infer<typeof loginSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
