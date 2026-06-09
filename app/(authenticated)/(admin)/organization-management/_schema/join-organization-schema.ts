import { z } from "zod";

export const joinOrganizationSchema = z.object({
  inviteCode: z.string().min(1, "Invite code is required"),
});

export type JoinOrganizationState = {
  message: string;
  errors?: Partial<Record<keyof z.infer<typeof joinOrganizationSchema>, string[]>>;
  success?: boolean;
};
